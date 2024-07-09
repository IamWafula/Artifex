import Rating from '../rating/rating'
import styles from  './post.module.css'
import Cookies from 'universal-cookie'

export default function PostCmp(props){
    // TODO: Date converted to something more legible
    const postDetails = props.post
    const cookies = new Cookies(null, { path : "/"})

    return(
        <div className={styles.post}>
            <div className={styles.images}>
                <img src={postDetails.images[0].imgUrl} />
            </div>

            <div className={styles.details_container}>

                <div>
                    <h2>{postDetails.title}</h2>
                    <h4>{postDetails.category}</h4>
                    <p>{postDetails.description}</p>
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
