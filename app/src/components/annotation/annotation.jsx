import styles from './annotation.module.css'
import { useEffect, useState } from 'react'

export default function Annotation(props){

    const [showInput, setShowInput] = useState(false)
    const [annText, setAnnText] = useState(props.note[2])

    const handleSubmit = (e) => {
        e.preventDefault()
        setShowInput(false)
        if (annText){

            props.setNotes((prev) => {
                let tempArr = prev.filter((item, index) => index != props.index)
                tempArr = [...tempArr, [props.note[0], props.note[1], annText]]

                return tempArr
            })
        }
    }

    return(
        <div className={styles.click_indicator}
            style={{
                left: `${props.note[0]}px`,
                top: `${props.note[1]}px`,
                backgroundColor: annText ? 'green' : 'red'
            }}
            onMouseLeave={()=>{
                setShowInput(false);
            }}

            onClick={()=> {setShowInput(true)}}
        >
            {
                (showInput) && (
                    <form onSubmit={handleSubmit}>
                        <input type="text" onChange={(e)=> {setAnnText(e.target.value)}}
                        />
                    </form>
                )
            }

            {
                (!showInput) &&
                // chose to display props since passing to child caused clash due to concurrent changes
                (<p>{props.note[2]}</p>)
            }



        </div>
    )
}
