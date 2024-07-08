import styles from "./home.module.css"
import Header from "../../components/header/header"
import Footer from "../../components/footer/footer"

import API from "../../utils/api";

import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function Home() {

    const [navNewPost, setNaveNewPost] = useState(false)

    const [allPosts, setAllPosts] = useState([])

    useEffect(()=> {
        async function getPosts(){
            setAllPosts(await API.getAllPosts())
        }

        getPosts();
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
            </div>

            <div id={styles.content}>
                {
                    allPosts.map((post) => {
                        return( <div> {JSON.stringify(post)}</div> )
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
