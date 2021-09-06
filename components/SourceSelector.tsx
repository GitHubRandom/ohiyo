import { AnimatePresence, motion } from "framer-motion"
import React, { useEffect } from "react"
import { useRef } from "react"
import { useState } from "react"
import { getQualityLabel, nativeServers, serverKeys, supportedServers } from "../utils/Servers"

interface ISourceSelector {
    sources: Record<string, any>,
    value: string,
    onSelectSource: (sourceKey: string) => void
}

const listItem = ([ sourceKey, source ], selected: boolean, onClickItem: () => void) => (
    <div key={ sourceKey } onClick={ onClickItem } className={ `sources-list-item` }>
        <div className="sources-list-item-quality">{ getQualityLabel(sourceKey, source) }</div>
        <div className="sources-list-item-info">
            <h4>{ serverKeys[sourceKey.slice(0,2)] }</h4>
            { nativeServers.includes(sourceKey.slice(0,2)) && <p>المشغل المحلي</p> }
            {/*<p>{ nativeServers.includes(sourceKey.slice(0,2)) ? "المشغل المحلي" : "مشغل مدمج" }</p>*/}
        </div>
        { selected ? <span className="sources-list-selected-icon mdi mdi-circle-medium"></span> : null }
    </div>
)

const SourceSelector = ({ sources, value, onSelectSource }: ISourceSelector) => {

    const [ showDropdown, updateShowDropdown ] = useState<boolean>(false)
    const selectionButton = useRef<HTMLDivElement>()

    useEffect(() => {
        if (showDropdown) {
            const handleOutsideClick = event => {
                if (event.target != selectionButton.current) {
                    updateShowDropdown(false)
                }
            }
            document.addEventListener('click', handleOutsideClick, { passive: true })
            return () => {
                document.removeEventListener('click', handleOutsideClick)
            }    
        }
    }, [showDropdown])

    return (
        <div className="sources">
            <div onClick={ () => updateShowDropdown(show => !show) } className="selection">
                <div className="selection-quality">{ getQualityLabel(value, sources[value]) }</div>
                <div className="selection-name">{ serverKeys[value.slice(0,2)] }</div>
                <span className="mdi mdi-unfold-more-horizontal"></span>
            </div>
            <AnimatePresence>
                { showDropdown ?
                    <motion.div 
                        className="sources-list"
                        initial={{
                            opacity: 0,
                            translateY: 20
                        }}
                        animate={{
                            opacity: 1,
                            translateY: 0
                        }}
                        exit={{
                            opacity: 0
                        }}
                        transition={{
                            duration: 0.125,
                            ease: 'easeOut'
                        }}>
                        
                        {
                            Object
                                .entries(sources)
                                .filter(entry => nativeServers.includes(entry[0].slice(0,2)))
                                .map(entry => (
                                    listItem(entry, entry[0] === value, () => { onSelectSource(entry[0]); updateShowDropdown(false) })
                                ))
                        }

                        {
                            Object
                                .entries(sources)
                                .filter(entry => !nativeServers.includes(entry[0].slice(0,2)))
                                .map(entry => (
                                    listItem(entry, entry[0] === value, () => { onSelectSource(entry[0]); updateShowDropdown(false) })
                                ))
                        }

                    </motion.div>
                : null }
            </AnimatePresence>
        </div>
    )
}

export default SourceSelector