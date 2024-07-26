import { useState } from "react"
import styles from "./notification.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faX } from "@fortawesome/free-solid-svg-icons"

export default function NotificationCmp(props){

    const [display, setDisplay] = useState(true)

    return (
    <div id="notification" class={styles.notification_container} style={{display: display? "flex" : "none"}}>
        <FontAwesomeIcon icon={faX} color="white"
            onClick={() => {
                setDisplay(false)
                props.setShowNotif(false)
            }}
        />

        <h4 id="notificationTitle">{props.title}</h4>
        <p id="notificationBody">{props.message}</p>

    </div>
    )
}
