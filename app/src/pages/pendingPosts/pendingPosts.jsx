import Footer from "../../components/footer/footer"
import GenImage from "../../components/genImage/GenImage";
import Header from "../../components/header/header"
import styles from "./pendingPosts.module.css"

import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import Cookies from "universal-cookie";
import API from "../../utils/api";
import MenuBar from "../../components/menubar/menuBar";

export default function PendingPosts () {

    const location = useLocation();

    if (location.state){
        if (!location.state.selectedImages){
            return (<Navigate to="/new-post" />)
        }
    }else {
        return (<Navigate to="/new-post" />)
    }

    const images = location.state.selectedImages;
    const [imagesAnnotated, setImagesAnnotated] = useState(images)
    const [currentImage, setCurrentImage] = useState(null)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("")

    const [navHome, setNavHome] = useState(false)

    const cookies = new Cookies(null, {path : "/"})

    async function handleNewPost(e){
        e.preventDefault()
        if (!category || !title || !images || !description) {
            // TODO: Error handling here
        }else{
            API.uploadImages(images, title, description, category)
            cookies.set("images", [])
            setNavHome(true)
        }

    }

    const categories = {
        '' : 'Select a category',
        "digital" : "Digital Art",
        "3D" : "3d Models",
        "oil" : "Oil on Canvas",
        "pixel" : "Pixel Art",
        "photography" : "Photography"
    }

    return (
        <div id={styles.newpost}>
            <Header />

            <MenuBar />

            {
                (!images) && (
                    <Navigate to="/new-post" />
                )
            }

            {
                (navHome) && (
                    <Navigate to="/" />
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

            <div id={styles.details} >
                <form>
                    <p>New Post</p>
                    <div id={styles.title_category}>
                        <input placeholder="title" onChange={(e)=> {setTitle(e.target.value)}}/>
                        <select name="category" id={styles.category_select} onChange={(e)=> {setCategory(e.target.value)}}>
                            {Object.entries(categories).map((value)=> {
                                const id = value[0]
                                const text = value[1]
                                return (<option value={id}>{text}</option>)
                            })}
                            </select>

                    </div>

                    <textarea id={styles.desc} placeholder="description" onChange={(e)=> {setDescription(e.target.value)}}/>
                    <button onClick={handleNewPost}>post</button>
                </form>

            </div>


            <Footer />
        </div>
    )

}
