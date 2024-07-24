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


function Bid(props){
    const cookies = new Cookies("/", {path : null})
    const currentUserId = cookies.get("currentUser").id

    const {description, images} = props;
    const bid = {...props.bid, ...{'posterId': currentUserId}}
    const commissioned = bid.commissionId ? true : false

    let allImages = []

    for (let i in images){

        for (let j in images[i].image){
            console.log(images[i].image[j])

            allImages.push(images[i].image[j])
        }

    }


    return (
        <div className={styles.bid} >
            <div className={styles.bidImgs}>
                { (allImages.length > 0) && allImages.map((image)=> (
                    <img src={image.imgUrl} />
                ))}
            </div>
            <p>{description}</p>

            {
                (commissioned) && (
                    <p> Commissioned! </p>
                )
            }
        </div>
    )
}

export default function Profile () {

    const cookies = new Cookies(null, {path : '/'})
    const user = cookies.get("currentUser")

    const location = useLocation()

    const [showBids, setShowBids] = useState(false)
    const [showPosts, setShowPosts] = useState(true)
    const [showCommissions, setShowCommissions] = useState(false)
    const [navNewPost, setNaveNewPost] = useState(false)

    const [userPosts, setUserPosts] = useState(cookies.get("userPosts")? cookies.get("userPosts") : [])
    const [userBids, setUserBids] = useState([])
    const [allImages, setAllImages] = useState([])

    useEffect(()=> {
        async function getUserData(){
            setUserPosts(await API.getUserPosts(user.id))

            setUserBids(await API.getUserBids(user.id))

            setAllImages(await API.getAllUserImages(user.id))


            const lastRun = await API.getLastRecommendationRun()

            // Reruns every 6 hours
            if (parseInt(lastRun) >= 6){
                await API.rerunRecommendation()
            }
        }

        getUserData()
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
                    <p>All Images</p>
                    <div  className={styles.underline}
                    style={{ backgroundColor: showCommissions? "rgb(80, 80, 80)"  : ""}}>
                    </div>
                </div>
            </div>

            {(showBids) &&
                <div id={styles.content}>

                {
                    userBids.map((bid) => (<Bid description={bid.description} bid={bid} images={ bid['portfolioItems']} />))
                }

                </div>
            }

            {(showCommissions) &&
                <div id={styles.portFolio}>

                    {
                        allImages.map((image) => {
                            return (<img className={styles.portImage} src={image.imgUrl} />)

                        })
                    }

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
