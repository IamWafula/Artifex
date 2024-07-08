import { useEffect, useState } from "react"
import styles from "./image.module.css"

import Cookies from "universal-cookie"

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
    const [imageUrl, setImageUrl] = useState("")
    const [allData, setAllData] = useState({})
    const [generatedData, setGenData] = useState({})
    const [selected, setSelected] = useState(false)

    const imageData = props.imageData;

    let waitTimeOut;
    let countingTimeout;


    // might keep this state to show remaining time
    // TODO: replace with loading later
    const [waitTime, setWaitTime] = useState(Infinity)

    const cookies = new Cookies(null, { path : "/"})

    /*
        Recursive function to get firebase image url
        Only called when image is still processing
    */
    async function setTimeoutFunction (wait) {
        const data = await getImageUrl(imageData.id)
        if (data.error) {return}

        // TODO: if we get generated image (response from ai horde), insert into database manually
        if (data.imgUrl) {
            setAllData(data)
            setImageUrl(data.imgUrl)

            clearTimeout(waitTimeOut)
            clearInterval(countingTimeout)
        }else if (data.generations.length > 0) {
            clearTimeout(waitTimeOut)
            clearInterval(countingTimeout)
            setImageUrl(data.generations[0].img)
            setWaitTime(0)

            // set All data after adding to prisma and firebase
            const tempData = {
                'id' : data.generations[0].id,
                'imgUrl' : data.generations[0].img,
                'userId' : imageData.userId,
                'prompt' : imageData.imagePrompt
            }

            setGenData({...data.generations[0], ...tempData})

        } else{
            waitTimeOut = setTimeout(async () => {
                if (data.wait_time){
                    console.log(data.wait_time, waitTime, data.wait_time > waitTime)

                    // ensure that new wait time is less

                    if(data.wait_time < waitTime){
                        setWaitTime(data.wait_time)
                        setTimeoutFunction(data.wait_time)
                    }
                }
            }, parseInt(wait*1000))
        }
    }


    useEffect(() => {
        const userId= cookies.get('currentUser').id
        async function getImageData(){
            const image = await addImageManually(generatedData.id, generatedData.img, userId, generatedData.prompt)

            props.setImages((prev) => { return prev.filter((item) => {return item.id == generatedData.id})})
            // cookies.set("images", cookies.get('images').filter((item) => {return item.id == generatedData.id}))
            setAllData(image)
            setGenData({})
        }

        // if data in image is from Ai horde (hasn't been uploaded to firebase yet), add manually
        if (generatedData.img){
            console.log(generatedData)
            getImageData()
        }

        // if url is not ready, wait for image
        if (props.prevImage && !imageUrl){
            setTimeoutFunction(2, 1)
        }

        // if
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

    }, [imageData, props.selectedImages])

    // TODO: Since I store ai horde image temporarily before it uploaded to firebase, I need to differentiate that and fetched data to prevent duplicates

    // image already generated, just cache left
    // if (imageUrl && imageData.wait_time) {
    //     return null
    // }

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
                (props.prevImage && props.selectedImages && !selected)? props.setSelectedImages((prev) => {
                    if (prev.length >= 3){
                        prev.shift()
                        return [prev, imageData]
                    } else {
                        return [...prev, imageData]
                    }

                }) : null ;
                (props.prevImage && props.selectedImages && selected)? props.setSelectedImages((prev) => {
                    return prev.filter(item => item != imageData)
                }) : null
            }}
        >
            {
              ((waitTime) && (waitTime !== Infinity)) > 0 && (<p>{waitTime}</p>)
            }

        </div>
    )
}
