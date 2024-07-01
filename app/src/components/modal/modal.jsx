import styles from './modal.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faX} from '@fortawesome/free-solid-svg-icons'

// all purpose modal
export default function Modal ({children, isOpen}) {
    return (
        <div id={styles.overlay} style={{display: isOpen? "flex" : 'none'}}>

            <div id={styles.content}>
                <FontAwesomeIcon icon={faX} color='grey' />
                {children}
            </div>

        </div>
    )
}
