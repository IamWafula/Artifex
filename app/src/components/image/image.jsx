import { useContext, useEffect, useState } from "react"
import styles from "./image.module.css"

import Cookies from "universal-cookie"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faL, faTrash } from "@fortawesome/free-solid-svg-icons"

import API from "../../utils/api"

import { ImageLoading } from "../../App"

import sgMail from '@sendgrid/mail'


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

    const {loadingState, startWorker} = useContext(ImageLoading)
    const [loading, SetLoading] = loadingState;

    let waitTimeOut;
    let countingTimeout;


    // might keep this state to show remaining time
    // TODO: replace with loading later
    const [waitTime, setWaitTime] = useState(Infinity);
    const [finalWait, setFinalWait] = useState(false);

    const cookies = new Cookies(null, { path : "/"});
    const userId= cookies.get('currentUser').id;



    const sendEmail = () => {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        const msg = {
            to: 'test@example.com',
            from: 'test@example.com', // Use the email address or domain you verified above
            subject: 'Sending with Twilio SendGrid is Fun',
            text: 'and easy to do anywhere, even with Node.js',
            html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        };

        (async () => {
            try {
                await sgMail.send(msg);
            } catch (error) {
                console.error(error);

                if (error.response) {
                    console.error(error.response.body)
                }
            }
        })();
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

        const message = {
            text: 'i hope this works',
            from: 'you <username@your-email.com>',
            to: 'someone <someone@your-email.com>, another <another@your-email.com>',
            cc: 'else <else@your-email.com>',
            subject: 'testing emailjs',
            attachment: [
                { data: '<html>i <i>hope</i> this works!</html>', alternative: true },
                { path: 'path/to/file.zip', type: 'application/zip', name: 'renamed.zip' },
            ],
        };

        // send the message and get a callback with an error or details of the message that was sent
        client.send(message, function (err, message) {
            console.log(err || message);
        });

        // if url is not ready, wait for image
        if (props.prevImage && !imageUrl && !generatedData.id){

            const worker = startWorker()


            let options = {
                id : imageData.id,
                generateUrl : `${import.meta.env.VITE_BACKEND_URL}/generate/${imageData.id}`,
                uploadUrl : `${import.meta.env.VITE_BACKEND_URL}/generate/upload-firebase`,
                userId : userId,
                prompt : imageData.imagePrompt
            }

            if (imageData.id){
                worker.postMessage(options);
            }

            worker.onmessage = function (e) {
                if (e.data.wait_time > 0) {
                    let counter = e.data.wait_time;
                    clearInterval(countingTimeout);
                    countingTimeout = setInterval(()=> {
                        counter -= 1
                        if (counter > 0){
                            setWaitTime(counter)
                        } else {
                            clearInterval(countingTimeout)
                            worker.postMessage(options)
                        }
                    }, 1200)
                // shows image is still generated by Ai Horde
                } else if (e.data.worker_id){

                    const allData = {...generatedData, ...e.data}
                    console.log(allData)

                    setGenData(allData)
                    setImageUrl(e.data.imgUrl)
                    setFinalWait(!finalWait)
                } else {

                    if (generatedData.genId && e.data.imgUrl) {

                        // edits the image at the current index to the new stored firebase image
                        props.removeImage(generatedData.genId, e.data)

                        // DID: Use this to fix bug when loading new image
                        setAllData(e.data)
                        imageData = image;

                        SetLoading(!loading)
                    }



                }
            }

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
