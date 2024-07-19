import styles from "./viewPost.module.css"
import Header from "../../components/header/header"
import Footer from "../../components/footer/footer"
import PostCmp from '../../components/post/post'

import API from "../../utils/api";

import { useEffect, useState } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import GenImage from "../../components/genImage/GenImage";

import Cookies from "universal-cookie";

function Bid(props){
    const cookies = new Cookies("/", {path : null})
    const currentUserId = cookies.get("currentUser").id

    const {description, images} = props;
    const bid = {...props.bid, ...{'posterId': currentUserId}}
    const commissioned = bid.commissionId ? true : false


    return (
        <div className={styles.bid} >
            <div className={styles.bidImgs}>
                { (images.length > 0) && images.map((image)=> (
                    <img src={image.imgUrl} />
                ))}
            </div>
            <p>{description}</p>

            {
                (commissioned) && (
                    <p> Commissioned! </p>
                )
            }

            {
                (!commissioned) && (
                    <button
                    onClick={()=> {API.addCommission(bid)}}
                    >Commision</button>
                )
            }

        </div>
    )
}

export default function ViewPost(){

    // TODO: use cookies to minimize loading time
    const postId = useParams().id;
    const cookies = new Cookies("/", {path : null})
    const currentUserId = cookies.get("currentUser").id

    const [postData, setPostData] = useState({})
    const [imageIdxs, setImageIdxs] = useState([0, 1, 2])

    const [navBid, setNavBid] = useState(false)

    useEffect(() => {
        async function getData(id){
            const data = await API.getPost(id);
            setPostData(data)
        }

        getData(postId)
    }, [])

    console.log(postData)

    // TODO: Has to be a better way to implement this
    // TODO: Add bidder information and ratings
    if (postData.userId == currentUserId){

        const bids = postData['bids']

        return(
            <div id={styles.viewPostUser}>
            {(navBid) && (
                <Navigate to={`/bid/${postId}`} />
            )}

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

            <div id={styles.bids}>
                {
                    bids.map((bid) => (<Bid description={bid.description} bid={bid} images={ bid['portfolioItems'][imageIdxs[1]].image} />))
                }

                {
                    (bids.length ==0) && (
                        <p>There are no bids</p>
                    )
                }


            </div>

            <Footer />
        </div>
        )
    }


    return (
        <div id={styles.viewPost}>
            {(navBid) && (
                <Navigate to={`/bid/${postId}`} />
            )}

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
                {
                    (!postData.commissionId) && (
                        <button
                            onClick={()=> {
                                setNavBid(true)
                            }}
                        > Add Bid </button>
                    )
                }


            </div>

            <Footer />
        </div>
    )
}
