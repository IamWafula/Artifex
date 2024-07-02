import { useState } from "react"
import styles from "./image.module.css"

export default function  ArtImage() {

    const [imageUrl, setImageUrl] = useState("https://media-cldnry.s-nbcnews.com/image/upload/rockcms/2024-05/240515-mona-lisa-mb-1241-e9b88e.jpg")

    return (

        <div className={styles.main_image} style={{ backgroundImage: `url(${imageUrl})` }} >
        </div>
    )
}
