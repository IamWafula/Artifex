import { useCallback, useEffect, useRef, useState } from "react"
import Footer from "../../components/footer/footer"
import Header from "../../components/header/header"
import ArtImage from "../../components/image/image"
import styles from "./newPost.module.css"
import Cookies from "universal-cookie"
import { Navigate } from "react-router-dom"

import API from '../../utils/api'
import MenuBar from "../../components/menubar/menuBar"


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

    const getImageRef = useRef(null)

    async function handleNewImage (e) {

        if (!description) {return }
        getImageRef.current.disabled = true;
        const response = await API.postNewImage(cookies.get('currentUser').id, description)
        if (response.status == 200){
            let resJson = await response.json()
            resJson['imagePrompt'] = description
            resJson['user'] = cookies.get('currentUser')
            // add generated images to current sessions generated images
            cookies.set('images', [...cookies.get('images'), resJson])
            setImages([...images, resJson])
        }
    }

    function uniqueImages(list_images){
        const seen = new Set()
        const unique = list_images.filter(item => {
            if (!item.imgUrl){
                return seen.has(item.id) ? false : seen.add(item.id);
            }
            return seen.has(item.imgUrl) ? false : seen.add(item.imgUrl);
        });

        return unique;

    }

    useEffect( () => {
        async function loadImages(){
            if (cookies.get('currentUser')){
                const allUserImages = await API.getUserImages(cookies.get('currentUser').id);


                const combinedImages = [...allUserImages, ...cookies.get('images')]
                // ensure that combines images are unique
                const uniqueImagesList =  uniqueImages(combinedImages)
                cookies.set('images', uniqueImagesList)
                setImages(uniqueImagesList)
            }
        }

        loadImages()
    }, [])

    // usecallback here to optimize re-renders
    const handleImageChange = useCallback((imageData) => {
        setCurrentImage(imageData)
    })

    const removeImage = (generatedId, image) => {
        // Remove cache image from state and cookies
        setImages((prev) => {
            let temp = [...prev]

            for (let i in temp){
                if (temp[i].id == generatedId){
                    temp[i] = image
                }
            }

            return temp
        })

        cookies.set("images", [])
        getImageRef.current.disabled = false;
        setCurrentImage(image)
    }

    return (
        <div id={styles.newpost}>
            <Header />

            <MenuBar />

            {
                (navPending && (selectedImages.length == 3)) && (
                    <Navigate to="/pending" state={{selectedImages: selectedImages}} />
                )
            }
            <div id={styles.desc_form}>
                <form>
                    <p>Enter Image description</p>
                    <textarea type="text" placeholder="description"
                        onChange={(e)=> {setDescription(e.target.value)}}

                    ></textarea>
                    <button onClick={handleNewImage} ref={getImageRef}> get image </button>

                </form>

            </div>

            <div id={styles.image} >
                <ArtImage selectedImages={selectedImages} setSelectedImages={setSelectedImages} height={480} width={480} imageData={currentImage} />
            </div>

            <div id={styles.annotate} >

                {(selectedImages.length == 3)
                &&
                (<button onClick={()=> setNavPending(true)} > annotate </button>)
                }

            </div>

            <div id={styles.images} >

                {
                    images.map((image) => {
                        return ( <ArtImage
                            key={image.id}
                            selectedImages={selectedImages}
                            setImages={setImages}
                            setSelectedImages={setSelectedImages}
                            setCurrentImage={handleImageChange}
                            imageData={image}
                            prevImage={true}
                            imageUrl={"https://media-cldnry.s-nbcnews.com/image/upload/rockcms/2024-05/240515-mona-lisa-mb-1241-e9b88e.jpg"}
                            removeImage={removeImage}
                            /> )
                    })
                }

            </div>

            <div  id={styles.post}>
                {/* TODO: use this for error display */}
            </div>

            <Footer />
        </div>
    )

}
