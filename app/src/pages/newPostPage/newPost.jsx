import { useEffect, useState } from "react"
import Footer from "../../components/footer/footer"
import Header from "../../components/header/header"
import ArtImage from "../../components/image/image"
import styles from "./newPost.module.css"
import Cookies from "universal-cookie"
import { Navigate } from "react-router-dom"

import API from '../../utils/api'


export default function NewImage () {
    const cookies = new Cookies(null, { path : "/"})
    if (!cookies.get('images')){
        cookies.set('images', [])
    }

    // only add draft images if they exist
    const [images, setImages] = useState(cookies.get('images')? cookies.get('images') : [])
    const [currentImage, setCurrentImage] = useState({"id" : null})
    const [description, setDescription] = useState("")

    const [selectedImages, setSelectedImages] = useState([])
    const [navPending, setNavPending] = useState(false)

    async function handleNewImage (e) {

        if (!description) {return }

        console.log(cookies.get("currentUser"))

        const response = await API.postNewImage(cookies.get('currentUser').id, description)

        if (response.status == 200){
            let resJson = await response.json()
            resJson['imagePrompt'] = description
            resJson['user'] = cookies.get('currentUser')

            // add generated images to current sessions generated images
            cookies.set('images', [...cookies.get('images'), resJson])
            setImages([... new Set(cookies.get('images'))])
        }

        console.log(images)
    }

    function uniqueImages(list_images){
        const seen = new Set()
        const unique = list_images.filter(item => {
            const json = JSON.stringify(item);
            return seen.has(json) ? false : seen.add(json);
        });

        return unique;

    }

    useEffect( () => {
        async function loadImages(){
            if (cookies.get('currentUser')){
                const allUserImages = await API.getUserImages(cookies.get('currentUser').id);

                const combinedImages = [...allUserImages, ...cookies.get('images')]

                console.log(combinedImages)

                // ensure that combines images are unique
                cookies.set('images', uniqueImages(combinedImages))
                setImages(cookies.get('images'))
            }
        }

        loadImages()
    }, [])

    const handleImageChange = (imageData) => {
        setCurrentImage(imageData)
    }

    return (
        <div id={styles.newpost}>
            <Header />

            {
                (navPending && (selectedImages.length == 3)) && (
                    <Navigate to="/pending" state={{selectedImages: selectedImages}} />
                )
            }
            <div id={styles.form}>
                <input type="text" placeholder="enter image description"
                    onChange={(e)=> {setDescription(e.target.value)}}
                ></input>
                <button onClick={handleNewImage}> get image </button>
            </div>

            <div id={styles.image} >
                <ArtImage selectedImages={selectedImages} setSelectedImages={setSelectedImages} height={480} width={480} imageData={currentImage} />
            </div>

            <div id={styles.annotate} >
                <button onClick={()=> setNavPending(true)}> annotate </button>
            </div>

            <div id={styles.images} >

                {
                    images.map((image) => {
                        return ( <ArtImage selectedImages={selectedImages} setSelectedImages={setSelectedImages} setCurrentImage={handleImageChange} imageData={image} prevImage={true} imageUrl={"https://media-cldnry.s-nbcnews.com/image/upload/rockcms/2024-05/240515-mona-lisa-mb-1241-e9b88e.jpg"} /> )
                    })
                }

            </div>

            <div  id={styles.post}>
                {/* probably use this for error display */}
            </div>

            <Footer />
        </div>
    )

}
