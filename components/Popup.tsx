import React, { useState, useEffect, FunctionComponent, RefObject } from "react"
import { AnimatePresence, motion } from 'framer-motion'

interface IPopup {
    trigger: RefObject<HTMLElement>,
    id: string,
    title: string
}

const Popup = ({ children, trigger, id, title }: React.PropsWithChildren<IPopup>) => {

    const [ visible, updateVisibility ] = useState(false)

    useEffect(() => {
        if (trigger.current) {
            trigger.current.addEventListener('click', () => {
                updateVisibility(true)
            }) 
        }
    }, [trigger])

    useEffect(() => {
        if (visible) {
            (document.querySelector("body") as HTMLElement).style.overflow = "hidden"
        } else {
            (document.querySelector("body") as HTMLElement).style.overflow = "unset"
        }
    }, [visible])

    return (
        <AnimatePresence>
            { visible ? 
            <div id={id} className="popup">
                <motion.div initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="popup-container">
                    <div className="popup-header">
                        <h2 className="popup-title">{ title }</h2>
                        <div className="popup-close" onClick={ () => { updateVisibility(false) } }>إغلاق</div>
                    </div>
                    { children }
                </motion.div>
            </div> : null }
        </AnimatePresence>
    )
}

export default React.memo(Popup)