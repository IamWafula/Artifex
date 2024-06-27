import styles from "./GenImage.module.css"
import {useState} from "react"


export default function GenImage (props) {

    const [pointerCor, setPointerCor] = useState([20, 0])

    const [notes, setNotes] = useState([])

    return (
        <div className={styles.outline}>

            <div className={styles.click_indicator} style={{ left: `${pointerCor[0]}px`, top: `${pointerCor[1]}px` }}></div>
            <img

                onClick={(e) => {
                    const rect = e.target.getBoundingClientRect()

                    // offset the new location by 10 to account for scaling up of image, pointer is too precise when the image is about 480x480px
                    setPointerCor([e.clientX - rect.left + 10,  e.clientY - rect.top + 10])
                }}

            className={styles.main_image} src="https://media-cldnry.s-nbcnews.com/image/upload/rockcms/2024-05/240515-mona-lisa-mb-1241-e9b88e.jpg" height="480" width="480" />
        </div>
    )
}
