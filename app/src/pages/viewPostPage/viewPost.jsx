import styles from "./viewPost.module.css"
import Header from "../../components/header/header"
import Footer from "../../components/footer/footer"
import PostCmp from '../../components/post/post'

import API from "../../utils/api";

import { useEffect, useState } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import GenImage from "../../components/genImage/GenImage";

import Cookies from "universal-cookie";

export default function ViewPost(){

    // TODO: use cookies to minimize loading time
    const postId = useParams().id;

    const [postData, setPostData] = useState({})

    const [imageIdxs, setImageIdxs] = useState([0, 1, 2])

    useEffect(() => {
        async function getData(id){
            const data = await API.getPost(id);
            setPostData(data)
        }

        getData(postId)
    }, [])

    console.log(postData)

    return (
        <div id={styles.viewPost}>
            <Header />

            <div id={styles.images}>
                {
                    (postData.images) &&
                    (
                        <div id={styles.imagesDisplay}>
                            <GenImage image={postData.images[imageIdxs[0]]} postPage={true} style={"side"} customOnClick={() => {setImageIdxs([imageIdxs[1], imageIdxs[0], imageIdxs[2]])}}/>
                            <GenImage image={postData.images[imageIdxs[1]]} postPage={true} style={"main"} />
                            <GenImage image={postData.images[imageIdxs[2]]} postPage={true} style={"side"} customOnClick={() => {setImageIdxs([imageIdxs[1], imageIdxs[2], imageIdxs[0]])}}/>
                        </div>
                    )
                }

            </div>

            <div id={styles.description}>
                <h1>{postData.title}</h1>
                <h4>{postData.category}</h4>
                <p>{postData.description}</p>

            </div>

            <div id={styles.postBtn}>
                <button> Add Bid </button>
            </div>

            <Footer />
        </div>
    )
}
