import Footer from "../../components/footer/footer"
import Header from "../../components/header/header"
import ArtImage from "../../components/image/image"
import styles from "./newPost.module.css"

export default function NewImage () {



    return (
        <div id={styles.newpost}>
            <Header />
            <div id={styles.form}>
                <input type="text" placeholder="enter image description"></input>
                <button type='submit'> get image </button>
            </div>

            <div id={styles.image} >
                <img className={styles.main_image} src="https://media-cldnry.s-nbcnews.com/image/upload/rockcms/2024-05/240515-mona-lisa-mb-1241-e9b88e.jpg" height="480" width="480" />
            </div>

            <div id={styles.annotate} >
                <button > annotate </button>
            </div>

            <div id={styles.images} >
                <ArtImage />
                <ArtImage />
                <ArtImage />
            </div>

            <div  id={styles.post}>
                <button>post</button>
            </div>

            <Footer />
        </div>
    )

}
