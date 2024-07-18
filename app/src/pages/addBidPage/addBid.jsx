import styles from "./addBid.module.css"
import Header from "../../components/header/header"
import Footer from "../../components/footer/footer"
import PostCmp from '../../components/post/post'

import API from "../../utils/api";

import { useEffect, useState, useRef } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import GenImage from "../../components/genImage/GenImage";

import Cookies from "universal-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faCircle, faP } from "@fortawesome/free-solid-svg-icons";

const PortImage = (details) => {
    return (
        <div className={styles.portImage} >
            <div className={styles.imagePreview}  style={{ backgroundImage : `url(${details.src})` }}></div>
            <p>{details.name}</p>
        </div>
    )
}


export default function AddBid (props){
    const postId = useParams().id;

    const [postData, setPostData] = useState({})
    const imageBtns = [0, 1, 2]
    const [imagePortfolios, setImagePortfolios] = useState([[], [], []])

    const [currentIndex, setCurrentIndex] = useState(0)
    // put in separate state to force re-renders
    const [currentImages, setCurrentImages]  = useState([])

    const [description, setDescription] = useState("")

    const fileInputRef = useRef(null);
    const descRef = useRef(null);

    const reader = new FileReader()
    const cookies = new Cookies(null, {path: '/'})
    const userId = cookies.get('currentUser').id


    const [finish, setFinish] = useState(false)
    const [navHome, setNavHome] = useState(false)

    // TODO: this is a re-fetch, find ways to optimize
    useEffect(() => {
        async function getData(id){
            const data = await API.getPost(id);
            setPostData(data)
        }

        getData(postId)
    }, [])

    useEffect(() => {
        setCurrentImages(imagePortfolios[currentIndex])
    }, [currentIndex, imagePortfolios[currentIndex]])


    const handleUpload = (event) => {
        // routine to preview portfolio image before adding it to big
        // called using useRef and div click
        const file = event.target.files[0]
        let imageData = []

        var result = ""
        if (file) {
            reader.onload = (e) => {
                result = e.target.result
                imageData = [result, file.name]

                setImagePortfolios((prev) => {
                    const temp = [...prev];
                    temp[currentIndex] = [...new Set([...temp[currentIndex], [result, file.name]])]
                    return temp;
                })

            }
            reader.readAsDataURL(file)

        }
    }

    const changeDescriptionNext = () => {
        if (currentIndex < 2) {
            setCurrentIndex((prev) => {
                return prev+1}
            )
        }
    }

    const handlePost = async () => {
        if (description){
            const allImageData = []

            for (let i in imagePortfolios){
                const imageData = []

                for (let image in imagePortfolios[i]){
                    imageData.push({
                        "name" : imagePortfolios[i][image][1],
                        "blob" : imagePortfolios[i][image][0]
                    })
                }
                allImageData.push(imageData)
            }

            await API.addBid(allImageData, description, postId, userId)
        }

        setNavHome(true)

    }


    return (
        <div id={styles.addBid}>
            <Header />

            {
                (navHome) &&
                (<Navigate to="/" />)
            }

            <div id={styles.post}>

                <div id={styles.images} >
                    {
                        (postData.images) &&
                        (<GenImage image={postData.images[currentIndex]} postPage={true} style={"main"} />)
                    }

                    <div id={styles.imageBtns}>

                        { imageBtns.map((index) => {
                            // go through post Images
                            return(
                                <FontAwesomeIcon icon={faCircle} color={ currentIndex==index ? "grey" : "rgb(216, 216, 216)"}
                                    onClick={(e)=> {
                                        setCurrentIndex(index)
                                    }}
                                />
                            )
                        })}
                    </div>
                </div>


                <div id={styles.postDetails}>
                    <h1>{postData.title}</h1>
                    <h4>{postData.category}</h4>
                    <p>{postData.description}</p>
                </div>


            </div>

            <div id={styles.bid}
                style={{ display: finish? "none" : "flex" }}
            >
                <h1>Portfolio Images </h1>

                <div id={styles.addImages} onClick={() =>{fileInputRef.current?.click()}} >
                    <input type="file" ref={fileInputRef} style={{ display: "none" }}
                        onChange={handleUpload}
                    />
                    <FontAwesomeIcon icon={faPlus} />
                </div>

                <div id={styles.imagesDisplay}>
                    {
                        currentImages.map((value, index) => {
                            return(
                                <PortImage key={index} src={value[0]} name={value[1]}/>
                            )
                        })
                    }

                </div>

                <textarea name="" id="" cols="10" rows="3"
                    ref={descRef}
                    onChange={(e)=> {setDescription(e.target.value)}}
                    placeholder= {"Enter images description"}
                ></textarea>

                <button
                    onClick={() => {
                        (currentIndex == 2)? setFinish(true):null;
                        changeDescriptionNext()
                    }}
                >{currentIndex == 2? "Finish" : "Next"}</button>

                <button
                    onClick={() => {
                        setCurrentIndex((prev) => {
                            if (prev <= 3){
                                return prev-1
                            }
                        })
                    }}

                    style={{ display : (currentIndex > 0)? "block" : "none" }}
                >Back</button>

            </div>

            <div
                id={styles.bid}
                style={{ display: finish? "flex" : "none" }}
            >
                <h1>Portfolio Items</h1>

                <div id={styles.imagesDisplay}>
                    {imagePortfolios.map((value, index) => (
                        <>
                            <p>{`image ${index+1} portfolio images`}</p>
                            {value.map((portfolio) => (
                                <PortImage key={index} src={portfolio[0]} name={portfolio[1]}/>
                            ))}
                        </>
                        )
                    )}
                </div>

                <textarea name="" id="" cols="10" rows="3"
                    onChange={(e)=> {setDescription(e.target.value)}}
                    placeholder= {"Enter bid description"}
                    defaultValue={description}
                ></textarea>

                <button
                    onClick={() => {
                        setFinish(false)
                        setCurrentIndex(3)
                        setCurrentIndex((prev) => { return prev-1})
                    }}
                >Back</button>
                </div>

            <div id={styles.postBtn}>
                    <button
                        style={{ display: finish? "block" : "none" }}
                        onClick={handlePost}
                    >Post</button>

            </div>

            <Footer />
        </div>
    )
}
