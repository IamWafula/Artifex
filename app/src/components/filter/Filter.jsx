import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import styles from "./filter.module.css"
import { faArrowDown, faList, faSearch } from "@fortawesome/free-solid-svg-icons"

import { useState, useRef } from "react"

export default function Filter(props){

    const [showCatSelect, setShowCatSelect] = useState(false)
    const [searchTerm, setSearchTerm] = useState()
    const [filters, setFilters] = useState([false, false, false, false, false])

    const handleSearch = (e) => {
        props.setSearch(searchTerm)
    }

    const handleFilterChange = (e, index) => {
        setFilters((prev)=> {
            let temp = [...prev];
            temp[index] = !temp[index]
            return temp
        })


    }

    const handleFilter = () => {
        if ((filters.filter((filter) => (!filter == false)).length) == 0){
            props.setFilters([true, true, true, true, true])
            return;
        }

        props.setFilters(filters)
    }

    return (
    <div id={styles.filterCmp}>

        <p>Filters</p>

        <div id={styles.search}>
            <input  placeholder="enter search term"
            onChange={(e)=> {
                if (e.target.value){
                    setSearchTerm(e.target.value)
                } else {
                    props.setSearch("")
                }
                }}
            />
            <FontAwesomeIcon icon={faSearch} onClick={handleSearch} color="white" cursor={"pointer"} />
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
                <label class={styles.container}>Oil on Canvas
                    <input type="checkbox" onChange={(e) => (handleFilterChange(e,0))}/>
                    <span class={styles.checkmark}></span>
                </label>

                <label class={styles.container}>Photography
                    <input type="checkbox" onChange={(e) => (handleFilterChange(e,1))}/>
                    <span class={styles.checkmark}></span>
                </label>

                <label class={styles.container}>Pixel Art
                    <input type="checkbox" onChange={(e) => (handleFilterChange(e,2))}/>
                    <span class={styles.checkmark}></span>
                </label>

                <label class={styles.container}>3d Models
                    <input type="checkbox" onChange={(e) => (handleFilterChange(e,3))}/>
                    <span class={styles.checkmark}></span>
                </label>

                <label class={styles.container}>Digital Art
                    <input type="checkbox" onChange={(e) => (handleFilterChange(e,4))}/>
                    <span class={styles.checkmark}></span>
                </label>

                <button
                    onClick={handleFilter}
                >apply</button>
            </div>
        )}
    </div>
    )
}
