import styles from "./header.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faUser, faSearch} from '@fortawesome/free-solid-svg-icons'
import Modal from "../modal/modal"
import { useState } from "react"

import Cookies from 'universal-cookie';

// firebase utils
import {newUser, existingUser} from "../../utils/firebase_utils"
import { Navigate } from "react-router-dom"

export default function Header(){

    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("Login")
    const [password, setPassword] = useState("")

    const [navHome, setNavHome] = useState(false)

    //state for modal show
    const [isOpen, setIsOpen] = useState(false)

    // set up cookies
    const cookies = new Cookies(null, {path: '/'})

    const changeCache = (userData) => {
        cookies.set('currentUser', {
            id: userData.id,
            profileImage : userData.profileIMage,
            userName: userData.userName,
            userRating : userData.userRating
        })

        cookies.set('userPosts', userData.posts)
        cookies.set('images', [])

        setUsername(userData.userName)
    }

    // handleNewUser
    const handleNewUser = async () => {
        if (email && password) {
            const userData = await newUser(email, password)
            // once auth state changes, change cache
            changeCache(userData)
            setIsOpen(false)
            setNavHome(true)
        }
    }
    // TODO : Add Page reload to refetch data
    const handleExistingUser = async () => {
        if (email && password) {
            const userData = await existingUser(email, password)

            // once auth state changes, change cache
            changeCache(userData)
            setIsOpen(false)
            setNavHome(true)
        }
    }

    useState(() => {
        setUsername(cookies.get('currentUser')? cookies.get('currentUser').userName : "Guest")
        setEmail("")
        setPassword("")
    }, [cookies.get('currentUser'), isOpen])



    return (
        <div id={styles.header}>
            {

                (navHome) && (
                    <Navigate to="/" />
                )
            }

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


            <h1
                onClick={()=>{setNavHome(true)}}
                style={{cursor: 'pointer'}}
            >Artifex</h1>

            {/* <div id={styles.searchBar}>
                <input id={styles.searchterm} type="text" placeholder="enter search term" />
                <FontAwesomeIcon icon={faSearch} color="white"/>
            </div> */}

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
