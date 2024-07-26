import Annotation from "../annotation/annotation"
import styles from "./GenImage.module.css"
import {useEffect, useState} from "react"

export default function GenImage (props) {

    const [pointerCor, setPointerCor] = useState([20, 0])
    const [notes, setNotes] = useState(props.image.notes ? props.image.notes : [])


    // reset notes if image changes
    useEffect(()=> {

        setNotes(props.image.notes ? props.image.notes : [])
        if (props.postPage){
            setNotes(props.image.annotations? props.image.annotations : [])
        }
    }, [props.image, props.image.notes])
    if (props.postPage){
        const side = props.style == 'side'
        const dim = side? 120 : 480
        return(
            <div className={`${styles.outline}`} >
                <img className={styles.main_image} src={`${props.image.imgUrl}`} height={dim} width={dim}
                    onClick={props.customOnClick}
                    loading="lazy"
                />
                    {
                        (!side) &&
                        notes.map((note, index)=> {
                            const noteDisplay =  [note["positionX"], note["positionY"], note["text"]]
                            return (<Annotation  key={index} index={index} note={noteDisplay} display={side} />)
                        })
                    }

            </div>
        )
    }

    if (props.prevImage) {
        return(
            <div className={styles.outline}
                onClick={()=> {
                    props.setCurrentImage({...props.image, ...{"idx": props.index, "notes": props.image.notes} } )}}
            >

                {
                    // TODO: Add indicator for number of notes
                }


                <img loading="lazy" className={styles.main_image} src={`${props.image.imgUrl}`} height="120" width="120" />
            </div>
        )
    }

    useEffect(() => {
        props.setImagesAnnotated((prev) => {
            const imageIdx = props.image.idx;

            let tempArray = prev;
            tempArray[imageIdx].notes = notes

            return tempArray;
        })

    }, [notes])

    return (
        <div className={styles.outline}>

            <img

                onClick={(e) => {
                    const rect = e.target.getBoundingClientRect()
                    const offset = 10;
                    const pointerLocation = [e.clientX - rect.left + offset,  e.clientY - rect.top + offset, ""]

                    setNotes((prev) => {return ([...prev, pointerLocation])})

                    // update notes in parent state
                    props.setImagesAnnotated((prev)=>{
                        const tempArr = prev;
                        const imageIdx = props.image.idx;

                        // add notes to state and to parent state
                        const notes = tempArr[imageIdx].notes || []
                        notes.push(pointerLocation)
                        tempArr[imageIdx].notes = notes;

                        return tempArr
                    })
                }}

            className={styles.main_image} src={`${props.image.imgUrl}`} height="480" width="480" />


                {
                    notes.map((note, index)=> {
                        return (<Annotation  key={index} index={index} setNotes={setNotes} note={note} />)
                    })
                }

        </div>
    )
}
