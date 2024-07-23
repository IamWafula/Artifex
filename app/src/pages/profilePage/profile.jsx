import styles from "./profile.module.css"
import Header from "../../components/header/header"
import Footer from "../../components/footer/footer"
import PostCmp from '../../components/post/post'
import Filter from '../../components/filter/Filter.jsx'
import MenuBar from '../../components/menubar/menuBar.jsx'

import API from "../../utils/api";

import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

import Cookies from "universal-cookie";

export default function Profile () {

    const cookies = new Cookies(null, {path : '/'})
    const user = cookies.get("currentUser")

    const location = useLocation()

    const [showBids, setShowBids] = useState(false)
    const [showPosts, setShowPosts] = useState(true)
    const [showCommissions, setShowCommissions] = useState(false)
    const [navNewPost, setNaveNewPost] = useState(false)

    const [userPosts, setUserPosts] = useState(cookies.get("userPosts")? cookies.get("userPosts") : [])

    useEffect(()=> {
        async function getPosts(){
            setUserPosts(await API.getUserPosts(user.id))
        }

        getPosts()
    }, [])

    return(

        <div id={styles.profile}>

            {
                (navNewPost) && (
                    <Navigate to="/new-post" />
                )
            }

            <Header />

            <MenuBar />


            <div id={styles.tabs}>

                <div className={styles.title}
                    onClick={()=>{
                        setShowBids(true)
                        setShowCommissions(false)
                        setShowPosts(false)
                        }}>
                    <p>My Bids</p>
                    <div className={styles.underline}
                        style={{ backgroundColor: showBids? "rgb(80, 80, 80)" : "" }}
                    >
                    </div>
                </div>

                <div className={styles.title}
                    onClick={()=>{
                        setShowBids(false)
                        setShowCommissions(false)
                        setShowPosts(true)
                    }}
                >
                    <p>My Posts</p>
                    <div  className={styles.underline}
                    style={{ backgroundColor: showPosts? "rgb(80, 80, 80)"  : ""}}>
                    </div>
                </div>

                <div className={styles.title}
                    onClick={()=>{
                        setShowBids(false)
                        setShowCommissions(true)
                        setShowPosts(false)
                    }}
                >
                    <p>Active Commissions</p>
                    <div  className={styles.underline}
                    style={{ backgroundColor: showCommissions? "rgb(80, 80, 80)"  : ""}}>
                    </div>
                </div>
            </div>

            {(showBids) &&
                <div id={styles.content}>

                </div>
            }

            {(showCommissions) &&
                <div id={styles.content}>

                </div>
            }



            {(showPosts) &&
                <div id={styles.content}>
                    <button id={styles.new_post}
                        onClick={() => {setNaveNewPost(true)}}
                    >add new Post</button>


                    {userPosts.map((post) => {
                        return( <PostCmp key={post.id} post={post} userPost={true} /> )
                    })}
                </div>
            }


            <Footer />
        </div>
    )
}
