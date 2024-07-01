import styles from "./home.module.css"
import Header from "../../components/header/header"
import Footer from "../../components/footer/footer"

export default function Home() {
    return (
        <div id={styles.home}>
            <Header />

            <div id={styles.tabs}>

            </div>

            <div id={styles.content}>

            </div>

            <div id={styles.filters}>

            </div>

            <div id={styles.pagenumbers}></div>

            <Footer />
        </div>
    )
}
