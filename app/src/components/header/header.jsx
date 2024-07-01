import styles from "./header.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faUser, faX} from '@fortawesome/free-solid-svg-icons'
import Modal from "../modal/modal"

export default function Header(){

    return (
        <div id={styles.header}>

            <Modal isOpen={true}>
                <div id={styles.login_modal} >
                    <p>This is a modal!</p>
                    <input id='email_input' type="text" width='200px' placeholder="enter email" />
                    <input id='password_input' type='password' placeholder="enter password"/>
                    <button>login</button>
                </div>

            </Modal>


            <h1>Artifex</h1>

            <input id={styles.searchterm} type="text" placeholder="enter search term" />

            <div id={styles.login}>
                <FontAwesomeIcon icon={faUser}

                    onClick={()=> {
                        alert("Clicked")
                    }}

                />
                <p>Username</p>

            </div>

        </div>
    )
}
