import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import styles from './menubar.module.css'

export default function MenuBar(props){

    const location = useLocation()

    const [navHome, setNavHome] = useState(location.pathname == "/")
    const [navProfile, setNavProfile] = useState(location.pathname == "/profile")

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
                    style={{ background : navHome ? "rgba(255, 255, 255, 0.437)" : "background: rgba( 255, 255, 255, 0.25 );"  }}
                    onClick={()=>{setNavHome(true); setNavProfile(false)}}
                >Home</li>


                <li
                    style={{ background : navProfile ? "rgba(255, 255, 255, 0.437)" : "background: rgba( 255, 255, 255, 0.25 );"  }}
                    onClick={()=>{setNavHome(false); setNavProfile(true)}}
                >Profile</li>
            </ul>
        </div>
    )
}
