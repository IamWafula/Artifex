import { useContext, useEffect, useState } from "react"
import styles from "./image.module.css"

import Cookies from "universal-cookie"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash } from "@fortawesome/free-solid-svg-icons"

import API from "../../utils/api"

import { ImageLoading } from "../../App"

async function getImageUrl (id) {
    const url = `${import.meta.env.VITE_BACKEND_URL}/generate/${id}`

    let options = {
        method: "GET",
        headers: {
            'accept': 'application/json',
            "Content-Type": "application/json",
        }
    }

    const response = await fetch(url, options)
    const resJson = await response.json()

    return resJson
}

/*
    Function to manually add Image to Firebase storage
*/
async function addImageManually (id, image, user, prompt ) {
    const url = `${import.meta.env.VITE_BACKEND_URL}/generate/upload-firebase`

    let options = {
        method: "POST",
        headers: {
            'accept': 'application/json',
            "Content-Type": "application/json",
        },
        body : JSON.stringify({
            'imageUrl' : image,
            'imageId' : id,
            'imagePrompt' : prompt,
            'userId' : user
        })
    }

    const response = await fetch(url, options)
    const resJson = await response.json()

    return resJson
}


export default function  ArtImage(props) {
    const [allData, setAllData] = useState({})
    const [generatedData, setGenData] = useState({})
    const [selected, setSelected] = useState(false)

    let imageData = allData? props.imageData : allData;
    const [imageUrl, setImageUrl] = useState(imageData.imgUrl)
    const [isVisible, setIsVisible] = useState(true)

    const [loading, SetLoading] = useContext(ImageLoading)

    let waitTimeOut;
    let countingTimeout;


    // might keep this state to show remaining time
    // TODO: replace with loading later
    const [waitTime, setWaitTime] = useState(Infinity)
    const [finalWait, setFinalWait] = useState(false)

    const cookies = new Cookies(null, { path : "/"})
    const userId= cookies.get('currentUser').id

    async function getImageData(){
        const image = await addImageManually(generatedData.id, generatedData.img, userId, generatedData.prompt)

        props.removeImage(generatedData.genId, image)

        // DID: Use this to fix bug when loading new image
        setAllData(image)
        imageData = image;

    }

    /*
        Recursive function to get firebase image url
        Only called when image is still processing
    */
    async function setTimeoutFunction (wait) {
        const data = await getImageUrl(imageData.id)
        console.log(data, generatedData)
        if (data.error) {return}

        if (data.wait_time >= 0){

            setWaitTime(data.wait_time)
            let counter = data.wait_time;
            clearInterval(countingTimeout);
            countingTimeout = setInterval(()=> {
                counter -= 1
                if (counter > 0){
                    setWaitTime(counter)
                } else {
                    clearInterval(countingTimeout)
                    setFinalWait(!finalWait)
                }
            }, 1200)
        }

        // TODO: if we get generated image (response from ai horde), insert into database manually
        if (data.imgUrl) {
            setAllData(data)
            setImageUrl(data.imgUrl)

            clearTimeout(waitTimeOut)
            clearInterval(countingTimeout)
        }else if (data.generations){
            if (data.generations.length > 0) {
                clearTimeout(waitTimeOut)
                clearInterval(countingTimeout)
                setImageUrl(data.generations[0].img)
                setWaitTime(0)

                // set All data after adding to prisma and firebase
                const tempData = {
                    'id' : data.generations[0].id,
                    'genId': generatedData.genId? generatedData.genId : imageData.id,
                    'imgUrl' : data.generations[0].img,
                    'userId' : imageData.userId,
                    'prompt' : imageData.imagePrompt
                }

                setGenData({...data.generations[0], ...tempData})
            }
        }
    }

    const handleDelete = async (e) => {
        e.stopPropagation();
        setIsVisible(false)

        const allCookies = cookies.get('images')
        cookies.set('images', allCookies.filter((image) => {return image.id != imageData.id}))

        await API.deleteImage(imageData.id)

    }

    useEffect(()=> {
        if (!generatedData.genId){
            setGenData({"genId" : imageData.id})
        }

    }, [])


    useEffect(() => {

        // if data in image is from Ai horde (hasn't been uploaded to firebase yet), add manually
        if (generatedData.img){
            if (generatedData.genId){
                getImageData()
            }
            SetLoading(!loading)
        }

        // if url is not ready, wait for image
        if (props.prevImage && !imageUrl &&!generatedData.id){
            setTimeoutFunction(2)
        }

        if (imageData.imgUrl && !props.prevImage) {
            setImageUrl(imageData.imgUrl)
        }

        if (props.selectedImages){
            if (props.selectedImages.includes(imageData)){
                setSelected(true)
            } else{
                setSelected(false)
            }
        }



    }, [imageData,finalWait,generatedData, props.selectedImages])

    if (!isVisible){
        return
    }


    return (
        <div className={styles.main_image} style={{
                backgroundImage: imageUrl? `url(${imageUrl})` : 'url("https://i0.wp.com/port2flavors.com/wp-content/uploads/2022/07/placeholder-614.png?fit=1200%2C800&ssl=1")',
                height: `${props.height? props.height : 120}px`,
                width: `${props.width? props.width : 120}px`,
                cursor: props.prevImage ? 'pointer' : 'auto',
                border: (selected && props.prevImage) ? "10px solid rgb(3, 120, 60)" : null

            }}
            onClick={() => {
                props.prevImage? props.setCurrentImage(imageData) : null;
                (props.prevImage && props.selectedImages && !selected && !imageData.wait_time)? props.setSelectedImages((prev) => {
                    if (prev.length >= 3){
                        prev.shift()
                        return [prev, imageData]
                    } else {
                        return [...prev, imageData]
                    }

                }) : null ;
                (props.prevImage && props.selectedImages && selected && !imageData.wait_time)? props.setSelectedImages((prev) => {
                    return prev.filter(item => item != imageData)
                }) : null
            }}
        >
            {
              ((waitTime) && (!imageData.imgUrl) && (waitTime != Infinity)) > 0 && (<p>{waitTime}</p>)
            }

            {(props.prevImage && (imageData.imgUrl)) && (<FontAwesomeIcon icon={faTrash} color='rgba(255, 0, 0, 0.745)'
                onClick={handleDelete}
            />)}
        </div>
    )
}
