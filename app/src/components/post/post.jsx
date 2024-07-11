import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import Rating from '../rating/rating'
import styles from  './post.module.css'
import Cookies from 'universal-cookie'
import { useState } from 'react'

import API from '../../utils/api'

export default function PostCmp(props){
    // TODO: Date converted to something more legible
    const postDetails = props.post
    const cookies = new Cookies(null, { path : "/"})
    const [liked, setLiked] = useState(props.liked)

    const imageIdx = Math.floor(Math.random()*2)

    if (!postDetails || !postDetails.images){ return }

    return(
        <div className={styles.post}>
            <div className={styles.images}>
                <img src={postDetails.images[imageIdx].imgUrl} />
            </div>

            <div className={styles.details_container}>

                <div>
                    <h2>{postDetails.title}</h2>
                    <h4>{postDetails.category}</h4>
                    <p>{postDetails.description}</p>
                </div>

                <div className={styles.likeBtn}>
                    <FontAwesomeIcon onClick={()=> {liked?
                        (API.removeLiked(cookies.get('currentUser').id, postDetails.id),
                        setLiked(false))
                        :
                        (API.addLiked(cookies.get('currentUser').id, postDetails.id),
                        setLiked(true))
                        }}  icon={faHeart} color={liked? "red" : "grey"} />
                </div>

                <div className={styles.profile}>
                    <div className={styles.profile_details}>
                        <p>{postDetails.user.userName}</p>
                        <Rating rating={postDetails.user.userRating} />
                    </div>
                    <img src={postDetails.user.profileImage} />
                </div>

                <p className={styles.date}>{postDetails.datePublished.split(":")[0]}</p>
            </div>
        </div>
    )
}
