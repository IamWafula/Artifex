import styles from "./home.module.css"
import Header from "../../components/header/header"
import Footer from "../../components/footer/footer"
import PostCmp from '../../components/post/post'
import Filter from '../../components/filter/Filter.jsx'
import MenuBar from '../../components/menubar/menuBar.jsx'

import UserInfo from '../../components/userInfo/userInfo.jsx'

import API from "../../utils/api";

import { useEffect, useRef, useContext,  useState } from "react";
import { ImageLoading } from "../../App"

import { Navigate, useLocation } from "react-router-dom";


import Cookies from "universal-cookie";

export default function Home() {

    const cookies = new Cookies(null, {path : '/'})
    const user = cookies.get("currentUser")

    const location = useLocation()

    const [navNewPost, setNaveNewPost] = useState(false)
    const [showAllPosts, setShowAllPosts] = useState(true)
    const [allPosts, setAllPosts] = useState([])

    // store state with posts not filtered or changed so we dont re-fetch
    const [allPostsOriginal, setAllPostsOriginal] = useState([])

    const [recommendations, setRecommendations] = useState([])
    const [likedPosts, setLikedPosts] = useState([])


    const {loadingState, startWorker} = useContext(ImageLoading)
    const [loading, SetLoading] = loadingState;

    const [filters, setFilters] = useState([])
    const [search, setSearch] = useState()

    useEffect(()=> {
        // fill in with filter names
        const filtered = {
            'oil' : filters[0],
            'photography' : filters[1],
            'pixel' : filters[2],
            '3D' : filters[3],
            'digital art' : filters[4]
        }


        if (search){
            setAllPosts((prev) => {
                let temp = [...prev];

                temp = temp.filter((post) => {
                    return (post.title.toLowerCase().includes(search.toLowerCase()) || post.description.toLowerCase().includes(search.toLowerCase()))
                })
                return temp
            })
        } else {
            setAllPosts(allPostsOriginal)
        }


        setAllPosts((prev) => {
            let temp = prev;

            temp = temp.filter((post) => {
                return (filtered[post.category])
            })

            return temp;
        })

    }, [filters, search])

    useEffect(()=> {

        const worker = startWorker()

        worker.postMessage({
            check: true
        })

        worker.onmessage = function (e) {
            if (e.data.imgUrl){
                SetLoading(false)
            }
        }


        async function getPosts(){
            const fetchedPosts = await API.getAllPosts()
            setAllPosts(fetchedPosts)
            setAllPostsOriginal(fetchedPosts)
        }

        async function getRecs(){
            if (user.id){
                setRecommendations(await API.getRecommendations(user.id))
            }
        }

        async function getLiked(){
            if (user.id){
                const liked = await API.getLiked(user.id)
                setLikedPosts(liked)
            }
        }

        getPosts();
        getRecs();
        getLiked();
    }, [location.key])

    const checkLiked = (post) =>{
        const bool = likedPosts.some((likedPost) => {
            return likedPost.postId == post.id
        })
        return bool
    }

    return (
        <div id={styles.home}>

            {
                (navNewPost) && (
                    <Navigate to="/new-post" />
                )
            }

            <Header />

            <MenuBar />


            <div id={styles.tabs}>

                <div className={styles.title}
                    onClick={()=>{setShowAllPosts(true)}}
                >
                    <p>All Posts</p>
                    <div className={styles.underline}
                        style={{ backgroundColor: showAllPosts? "rgb(80, 80, 80)" : "" }}
                    >
                    </div>
                </div>

                <div className={styles.title}
                    onClick={()=>{setShowAllPosts(false)}}
                >
                    <p>Recommendations</p>
                    <div  className={styles.underline}
                    style={{ backgroundColor: showAllPosts? "" : "rgb(80, 80, 80)" }}>
                    </div>
                </div>
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
                        const check_liked = checkLiked(post)
                        return( <PostCmp key={post.id} post={post} liked={checkLiked(post)} /> )
                    })
                }

            </div>

            <div id={styles.filters}>
                <Filter setSearch={setSearch} setFilters={setFilters} />
                <UserInfo />
            </div>

            <div id={styles.pagenumbers}>

            </div>

            <Footer />
        </div>
    )
}
