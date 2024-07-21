import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import styles from './menubar.module.css'

export default function MenuBar(props){

    const [navHome, setNavHome] = useState(false)
    const [navProfile, setNavProfile] = useState(false)

    return (
        <div id={styles.menuBar}>


            {
                (navHome) && (
                    <Navigate to="/" />
                )
            }
            {
                (navProfile) && (
                    <Navigate to="/profile" />
                )
            }

            <ul id={styles.menu}>
                <li
                    onClick={()=>{setNavHome(true); setNavProfile(false)}}
                >Home</li>


                <li
                    onClick={()=>{setNavHome(false); setNavProfile(true)}}
                >Profile</li>
            </ul>
        </div>
    )
}
