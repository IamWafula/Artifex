import { useEffect, useState } from "react"
import Footer from "../../components/footer/footer"
import Header from "../../components/header/header"
import ArtImage from "../../components/image/image"
import styles from "./newPost.module.css"
import Cookies from "universal-cookie"

export default function NewImage () {
    const cookies = new Cookies(null, { path : "/"})
    const [images, setImages] = useState(cookies.get('images'))
    const [currentImage, setCurrentImage] = useState({"id" : null})
    const [description, setDescription] = useState("")


    async function handleNewImage (e) {

        if (!description) {return }

        console.log(cookies.get("currentUser"))

        const url = `${import.meta.env.VITE_BACKEND_URL}/generate`

        let options = {
            method: "POST",
            headers: {
                'accept': 'application/json',
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "prompt" : description,
                "userId" : cookies.get("currentUser").id
            })
        }

        const response = await fetch(url, options)
        if (response.status == 200){
            const resJson = await response.json()

            // add generated images to current sessions generated images
            cookies.set('images', [...cookies.get('images'), resJson])
            setImages(cookies.get('images'))
        }

        console.log(images)
    }

    // useEffect(() => {
    //     const allImages = cookies.get('images')
    //     console.log(allImages)
    //     setImages(allImages)

    // }, [cookies.get('images')])

    return (
        <div id={styles.newpost}>
            <Header />
            <div id={styles.form}>
                <input type="text" placeholder="enter image description"
                    onChange={(e)=> {setDescription(e.target.value)}}
                ></input>
                <button onClick={handleNewImage}> get image </button>
            </div>

            <div id={styles.image} >
                <ArtImage height={480} width={480} imageData={currentImage} />
            </div>

            <div id={styles.annotate} >
                <button > annotate </button>
            </div>

            <div id={styles.images} >

                {
                    images.map((image) => {
                        return ( <ArtImage setCurrentImage={setCurrentImage} imageData={image} prevImage={true} imageUrl={"https://media-cldnry.s-nbcnews.com/image/upload/rockcms/2024-05/240515-mona-lisa-mb-1241-e9b88e.jpg"} /> )
                    })
                }

            </div>

            <div  id={styles.post}>
                <button>post</button>
            </div>

            <Footer />
        </div>
    )

}
