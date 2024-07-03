import { useEffect, useState } from "react"
import styles from "./image.module.css"

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

export default function  ArtImage(props) {

    const [imageUrl, setImageUrl] = useState("")
    const [allData, setAllData] = useState({})
    const imageData = props.imageData;

    // might keep this state to show remaining time
    const [waitTime, setWaitTime] = useState(0)

    async function setTimeoutFunction (wait, backoff) {
        const data = await getImageUrl(imageData.id)
        console.log(data)

        if (data.error) {return}

        if (data.imgUrl) {
            setAllData(data)
            setImageUrl(data.imgUrl)
        } else{
            setTimeout(async () => {
                setTimeoutFunction(data.wait_time, backoff+1)
            }, (wait+backoff)*1000)

        }
    }

    if (props.prevImage && !imageUrl){
        setTimeoutFunction(0, 1)
    }

    useEffect(() => {
        if (imageData.imgUrl && !props.prevImage) {
            setImageUrl(imageData.imgUrl)
        }

    }, [imageData])

    return (
        <div className={styles.main_image} style={{
                backgroundImage: imageUrl? `url(${imageUrl})` : 'url("https://i0.wp.com/port2flavors.com/wp-content/uploads/2022/07/placeholder-614.png?fit=1200%2C800&ssl=1")',
                height: `${props.height? props.height : 120}px`,
                width: `${props.width? props.width : 120}px`,
                cursor: props.prevImage ? 'pointer' : 'auto'

            }}
            onClick={() => { props.prevImage? props.setCurrentImage(allData) : null }}
        >
        </div>
    )
}
