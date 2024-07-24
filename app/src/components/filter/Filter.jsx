import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import styles from "./filter.module.css"
import { faArrowDown, faList, faSearch } from "@fortawesome/free-solid-svg-icons"

import { useState } from "react"

export default function Filter(props){

    const [showCatSelect, setShowCatSelect] = useState(false)


    return (
    <div id={styles.filterCmp}>

        <p>Filters</p>

        <div id={styles.search}>
            <input  placeholder="enter search term" />
            <FontAwesomeIcon icon={faSearch} color="white" />
        </div>

        <hr />

        <div className={styles.filterD}
            onClick={()=>{
                setShowCatSelect(!showCatSelect)
            }}
        >
            <FontAwesomeIcon icon={faList} color="white"  />
            <p>Select Category</p>
        </div>

        <hr />

        {(showCatSelect) && (
            <div className={styles.selections} >
                <label class={styles.container}>Oil
                    <input type="checkbox"/>
                    <span class={styles.checkmark}></span>
                </label>

                <label class={styles.container}>Photography
                    <input type="checkbox"/>
                    <span class={styles.checkmark}></span>
                </label>

                <label class={styles.container}>Three
                    <input type="checkbox"/>
                    <span class={styles.checkmark}></span>
                </label>

                <label class={styles.container}>Four
                    <input type="checkbox"/>
                    <span class={styles.checkmark}></span>
                </label>
            </div>
        )}






    </div>
    )
}
