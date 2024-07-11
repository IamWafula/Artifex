import styles from "./home.module.css"
import Header from "../../components/header/header"
import Footer from "../../components/footer/footer"
import PostCmp from '../../components/post/post'

import API from "../../utils/api";

import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import Cookies from "universal-cookie";

export default function Home() {

    const [navNewPost, setNaveNewPost] = useState(false)
    const [showAllPosts, setShowAllPosts] = useState(true)
    const [allPosts, setAllPosts] = useState([])
    const [recommendations, setRecommendations] = useState([])

    const cookies = new Cookies(null, {path : "/"})
    const user = cookies.get("currentUser")

    useEffect(()=> {
        async function getPosts(){
            setAllPosts(await API.getAllPosts())
        }

        async function getRecs(){
            setRecommendations(await API.getRecommendations(user.id))
        }

        getPosts();
        getRecs();
    }, [])

    return (
        <div id={styles.home}>

            {
                (navNewPost) && (
                    <Navigate to="/new-post" />
                )
            }

            <Header />

            <div id={styles.tabs}>
                <button onClick={()=>{setNaveNewPost(true)}}>new post</button>
                <button onClick={()=>{setShowAllPosts(!showAllPosts)}}>recommendations/allPosts</button>
            </div>

            <div id={styles.content}>
                {
                    (!showAllPosts) &&
                    recommendations.map((post) => {
                        return( <PostCmp key={post.post.id} post={post.post} /> )
                    })
                }
                {
                    (showAllPosts) &&
                    allPosts.map((post) => {
                        return( <PostCmp key={post.id} post={post} /> )
                    })
                }

            </div>

            <div id={styles.filters}>

            </div>

            <div id={styles.pagenumbers}></div>

            <Footer />
        </div>
    )
}
