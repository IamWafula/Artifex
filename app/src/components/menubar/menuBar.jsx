import styles from './menubar.module.css'
export default function MenuBar(props){
    return (
        <div id={styles.menuBar}>
            <ul id={styles.menu}>
                <li>Home</li>
                <li>Profile</li>
            </ul>
        </div>
    )
}
