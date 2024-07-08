import Footer from "../../components/footer/footer"
import GenImage from "../../components/genImage/GenImage";
import Header from "../../components/header/header"
import styles from "./pendingPosts.module.css"

import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import Cookies from "universal-cookie";

export default function PendingPosts () {

    const location = useLocation();
    const images = location.state.selectedImages;
    const [imagesAnnotated, setImagesAnnotated] = useState(images)
    const [currentImage, setCurrentImage] = useState(null)

    const cookies = new Cookies(null, {path : "/"})

    async function handleNewPost(){
        const url = `${import.meta.env.VITE_BACKEND_URL}/posts/`


        let options = {
            method: "POST",
            headers: {
                'accept': 'application/json',
                "Content-Type": "application/json",
            },
            body : JSON.stringify(images)
        }

        const response = await fetch(url, options)

        cookies.set("images", [])

    }

    return (
        <div id={styles.newpost}>
            <Header />

            {
                (!images) && (
                    <Navigate to="/new-post" />
                )
            }


            <div id={styles.image} >
                {(!currentImage)&&(
                    <img className={styles.main_image} src="https://media-cldnry.s-nbcnews.com/image/upload/rockcms/2024-05/240515-mona-lisa-mb-1241-e9b88e.jpg" height="480" width="480" />
                )}

                {(currentImage)&&(
                    <GenImage image={currentImage} setImagesAnnotated={setImagesAnnotated} imagesAnnotated={imagesAnnotated} />
                )}

            </div>

            <div id={styles.images} >

                {
                    imagesAnnotated.map((image, index) => {

                        return ( <GenImage image={image} key={index} index={index} prevImage={true} setCurrentImage={setCurrentImage} /> )
                    })
                }
            </div>

            <div  id={styles.post}>
                <button onClick={handleNewPost}>post</button>
            </div>

            <Footer />
        </div>
    )

}
