import Cookies from "universal-cookie"
import styles from "./userInfo.module.css"

import Rating from "../rating/rating"

export default function UserInfo(props){

    const cookies = new Cookies(null, {path: "/"})

    return (
    <div id={styles.userInfoCmp}>
        <h4>User Info</h4>

        <h5>Username : {cookies.get('currentUser').userName}</h5>
        <Rating rating={cookies.get('currentUser').userRating} />

    </div>
    )
}
