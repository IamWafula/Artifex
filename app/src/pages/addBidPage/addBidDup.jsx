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
        <div id={styles.portImage} style={{ backgroundImage : `url(${details.src})` }}>
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
    const [currentDesc, setCurrentDesc] = useState([])

    const fileInputRef = useRef(null);

    // TODO: this is a re-fetch, find ways to optimize
    useEffect(() => {
        async function getData(id){
            const data = await API.getPost(id);
            setPostData(data)
        }

        getData(postId)
    }, [])

    useEffect(() => {
        setCurrentImages([])
        setCurrentImages(imagePortfolios[currentIndex])
    }, [currentIndex])

    return (
        <div id={styles.addBid}>
            <Header />

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

            <div id={styles.bid}>

                <div id={styles.imagePortfolios}>

                    <div id={styles.portFDetails}>

                        <div id={styles.newPortF}>
                            <p>new Portfolio</p>

                            <div id={styles.addImages}
                                onClick={() =>{fileInputRef.current?.click()}}
                            >
                                <input type="file" ref={fileInputRef} style={{ display: "none" }}

                                    onChange={(event) => {
                                        // routine to preview portfolio image before adding it to big
                                        // called using useRef and div click
                                        const file = event.target.files[0]
                                        var result = ""
                                        if (file) {
                                            const reader = new FileReader()
                                            reader.onload = (e) => {
                                                result = e.target.result

                                                setImagePortfolios((prev) => {
                                                    const temp = prev;
                                                    temp[currentIndex] = [...temp[currentIndex], result]
                                                    return temp;
                                                })

                                                setCurrentImages([...currentImages, result])
                                            }
                                            reader.readAsDataURL(file)

                                            console.log(result)
                                        }



                                    }}
                                />

                                <FontAwesomeIcon icon={faPlus} />
                            </div>

                            <div id={styles.images}>

                            </div>

                        </div>

                        <textarea name="" id="" cols="30" rows="3" placeholder="Enter portfolio details"></textarea>

                        <button>Add Portfolio</button>
                    </div>


                    <div id={styles.previousImages}>
                        <p>previous Images</p>
                    </div>

                    <div id={styles.selectedPortF}>
                        <p>selectedPortfolios</p>
                    </div>

                    <textarea placeholder="enter bid details" onChange={(e)=>{}} />

                </div>


            </div>

            <div id={styles.postBtn}>

            </div>

            <Footer />
        </div>
    )
}
