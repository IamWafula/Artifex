import { faStar } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import styles from "./rating.module.css"

export default function Rating(props){
    const stars = parseInt(props.rating)
    let starsElm = []

    for (let i = 0; i < stars; i++){
        starsElm.push(
            <FontAwesomeIcon key={i} icon={faStar} color="gold" />
        )
    }

    for (let i = stars; i < 5; i++){
        starsElm.push(
            <FontAwesomeIcon  key={i} icon={faStar} color="grey"/>
        )
    }

    return (
        <div className={styles.ratings}>{starsElm}</div>
    )
}
