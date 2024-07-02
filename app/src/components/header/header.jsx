import styles from "./header.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faUser, faX} from '@fortawesome/free-solid-svg-icons'
import Modal from "../modal/modal"
import { useState } from "react"

import Cookies from 'universal-cookie';

// firebase utils
import {newUser, existingUser} from "../../utils/firebase_utils"

export default function Header(){

    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("Login")
    const [password, setPassword] = useState("")


    //state for modal show
    const [isOpen, setIsOpen] = useState(false)

    // set up cookies
    const cookies = new Cookies(null, {path: '/'})

    // handleNewUser
    const handleNewUser = async () => {
        if (email && password) {
            const userData = await newUser(email, password)
            cookies.set("currentUser", userData)
            setIsOpen(false)
        }
    }

    const handleExistingUser = async () => {
        if (email && password) {
            const userData = await existingUser(email, password)
            cookies.set("currentUser", userData)
            setIsOpen(false)
        }
    }

    useState(() => {
        setUsername(cookies.get('currentUser').userName)
    }, [cookies.get('currentUser')])

    return (
        <div id={styles.header}>

            <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
                <div id={styles.login_modal} >
                    <p>Login or Signup</p>
                    <input id='email' type="text" placeholder="enter email" onChange={(e) => {setEmail(e.target.value)}} />
                    <input id='password' type='password' placeholder="enter password" onChange={(e) => {setPassword(e.target.value)}}/>

                    <div style={{ display: 'flex', gap: '20px'}} >
                        <button type="submit" onClick={handleExistingUser}>login</button>
                        <button type="submit" onClick={handleNewUser}>signup</button>
                    </div>
                </div>

            </Modal>


            <h1>Artifex</h1>

            <input id={styles.searchterm} type="text" placeholder="enter search term" />

            <div id={styles.login}>
                <FontAwesomeIcon icon={faUser}

                    onClick={()=> {
                        setIsOpen(true)
                    }}

                />
                <p>{username}</p>

            </div>

        </div>
    )
}
