import Annotation from "../annotation/annotation"
import styles from "./GenImage.module.css"
import {useEffect, useState} from "react"


export default function GenImage (props) {

    const [pointerCor, setPointerCor] = useState([20, 0])
    const [notes, setNotes] = useState(props.image.notes ? props.image.notes : [])

    // reset notes if image changes
    useEffect(()=> {
        setNotes(props.image.notes ? props.image.notes : [])
    }, [props.image, props.image.notes])


    if (props.prevImage) {
        return(
            <div className={styles.outline}
                onClick={()=> {
                    props.setCurrentImage({...props.image, ...{"idx": props.index, "notes": props.image.notes} } )}}
            >

                {
                    // notes.map((note, index)=> {
                    //     return (<Annotation key={index} index={index} note={note} />)
                    // })
                }


                <img className={styles.main_image} src={`${props.image.imgUrl}`} height="120" width="120" />
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
                    const pointerLocation = [e.clientX - rect.left + 10,  e.clientY - rect.top + 10, ""]

                    setNotes((prev) => {return ([...prev, pointerLocation])})

                    // update notes in parent state
                    props.setImagesAnnotated((prev)=>{
                        const tempArr = prev
                        if (tempArr[props.image.idx].notes){
                            tempArr[props.image.idx].notes = [...tempArr[props.image.idx].notes, pointerLocation]
                        } else{
                            tempArr[props.image.idx].notes = [pointerLocation]
                        }

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
