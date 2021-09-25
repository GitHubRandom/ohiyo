import React, { useState, useEffect, RefObject, KeyboardEvent } from "react"
import { AnimatePresence, motion } from 'framer-motion'
import { Router } from "next/router"

interface IPopup {
    trigger: RefObject<HTMLElement>,
    id: string,
    title: string,
    dismissOnRouterEvent?: boolean
    onShow?: () => void,
    onDismiss?: () => void
}

const Popup = ({ children, trigger, id, title, dismissOnRouterEvent, onShow, onDismiss }: React.PropsWithChildren<IPopup>) => {

    const [ visible, updateVisibility ] = useState(false)

    const handleEscape = event => {
        console.log(event.key)
        if (event.key === 'Escape') {
            updateVisibility(false)
        }
    }

    useEffect(() => {
        if (trigger.current) {
            trigger.current.addEventListener('click', () => {
                updateVisibility(true)
            }, { passive: true }) 
        }
    }, [trigger])
    
    useEffect(() => {
        if (visible && onShow) {
            onShow()
        } else if (!visible && onDismiss) {
            onDismiss()
        }
        if (visible) {
            window.addEventListener('keydown', handleEscape, { passive: true })
            return () => {
                window.removeEventListener('keydown', handleEscape)
            }
        }
    }, [visible])

    useEffect(() => {
        if (dismissOnRouterEvent) {
            Router.events.on("routeChangeStart", () => {
                updateVisibility(false)
            })
        }
    }, [])

    return (
        <AnimatePresence>
            { visible ? 
            <motion.div
                id={id}
                className="popup"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                    duration: 0.125
                }}>
                <div className="popup-container">
                    <div className="popup-header">
                        <h2 className="popup-title">{ title }</h2>
                        <div className="popup-close" onClick={ () => { updateVisibility(false) } }>إغلاق</div>
                    </div>
                    { children }
                </div>
            </motion.div> : null }
        </AnimatePresence>
    )
}

export default React.memo(Popup)