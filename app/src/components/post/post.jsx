import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faTrash } from '@fortawesome/free-solid-svg-icons'
import Rating from '../rating/rating'
import styles from  './post.module.css'
import Cookies from 'universal-cookie'
import { Suspense, useState } from 'react'

import API from '../../utils/api'
import { Navigate } from 'react-router-dom'

export default function PostCmp(props){
    // TODO: Date converted to something more legible
    const postDetails = props.post
    const cookies = new Cookies(null, { path : "/"})
    const userId = cookies.get('currentUser').id
    const [navPost, setNavPost] = useState(false)
    const [liked, setLiked] = useState(props.liked)

    const [loaded, setLoaded] = useState(false)

    const imageIdx = Math.floor(Math.random()*2)

    if (!postDetails || !postDetails.images[0] || !postDetails.images[0].imgUrl){
        window.location.reload()
        return
    }


    async function handleDelete(e){
        // TODO: OPEN modal for confirmation
        e.stopPropagation()
        await API.deletePost(postDetails);
    }

    if (!loaded){
        return(
            <div className={styles.post}

            onClick={()=>{setNavPost(true)}}

            >
            {
                (navPost) && (
                    <Navigate to={`/post/${postDetails.id}`} />
                )
            }
            <div className={styles.images}>
                <img loading='lazy' onLoad={()=>(setLoaded(true))} src={"https://archive.org/download/placeholder-image/placeholder-image.jpg"} />
            </div>


        </div>
        )
    }


    return(
        <div className={styles.post}

            onClick={()=>{setNavPost(true)}}

            >
            {
                (navPost) && (
                    <Navigate to={`/post/${postDetails.id}`} />
                )
            }
            <div className={styles.images}>
                <img loading='lazy' onLoad={() => (setLoaded(true))} src={postDetails.images[imageIdx].imgUrl} />
            </div>

            <div className={styles.details_container}>

                <div className={styles.info}>
                    <h2>{postDetails.title}</h2>
                    <p>{postDetails.description}</p>
                </div>

                {/* TODO: Add number of likes and status (commissioned?), arrange by date */}
                {(props.post.userId != userId) &&
                    (<div className={styles.likeBtn}>
                        <FontAwesomeIcon onClick={(e)=> {liked?
                            (API.removeLiked(cookies.get('currentUser').id, postDetails.id),
                            setLiked(false))

                            :
                            (API.addLiked(cookies.get('currentUser').id, postDetails.id),
                            setLiked(true))
                            e.stopPropagation()
                            }}  icon={faHeart} color={liked? "red" : "grey"} />
                    </div>)
                }

                {(props.userPost ) &&
                    (<div className={styles.likeBtn}>
                        <FontAwesomeIcon onClick={handleDelete} icon={faTrash} color='rgba(255, 0, 0, 0.451)'/>
                    </div>)
                }

                {(!props.userPost) &&
                    (<div className={styles.profile}>
                        <div className={styles.profile_details}>
                            <p>{postDetails.user.userName}</p>
                            <Rating rating={postDetails.user.userRating} />
                        </div>
                        <img loading='lazy' src={postDetails.user.profileImage} />
                    </div>)
                }



                <h4>category: {postDetails.category}</h4>
                <p className={styles.date}>date posted: {postDetails.datePublished.split(":")[0]}</p>

            </div>
        </div>
    )
}
