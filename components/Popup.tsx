import React, { useState, useEffect, FunctionComponent, RefObject } from "react"
import { AnimatePresence, motion } from 'framer-motion'
import { Router } from "next/router"

interface IPopup {
    trigger: RefObject<HTMLElement>,
    id: string,
    title: string,
    dismissOnRouterEvent?: boolean
}

const Popup = ({ children, trigger, id, title, dismissOnRouterEvent }: React.PropsWithChildren<IPopup>) => {

    const [ visible, updateVisibility ] = useState(false)

    useEffect(() => {
        if (trigger.current) {
            trigger.current.addEventListener('click', () => {
                updateVisibility(true)
            }) 
        }
    }, [trigger])

    useEffect(() => {
        console.log("useEffect !")
        if (dismissOnRouterEvent) {
            console.log("Attached !")
            Router.events.on("routeChangeStart", () => {
                console.log("Fired !")
                updateVisibility(false)
            })
        }
    },[])

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