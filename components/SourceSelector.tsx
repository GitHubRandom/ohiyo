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

const SourceSelector = ({ sources, value, onSelectSource }: ISourceSelector) => {

    const [ showDropdown, updateShowDropdown ] = useState<boolean>(false)
    const self = useRef<HTMLDivElement>()

    useEffect(() => {
        const dismissDropdown = event => {
            if (!(self.current && self.current.contains(event.target))) {
                updateShowDropdown(false)
            }
        }
        document.addEventListener('click', dismissDropdown)
        return () => {
            document.removeEventListener('click', dismissDropdown)
        }
    })

    return (
        <div ref={ self } className="sources">
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
                        transition={{
                            duration: 0.125,
                            ease: 'easeOut'
                        }}>

                        { Object.keys(sources).sort().map(sourceKey => {
                            if (sourceKey != value) {
                                const source = sources[sourceKey]
                                return (
                                    <div key={ sourceKey } onClick={ () => { onSelectSource(sourceKey); updateShowDropdown(false) } } className="sources-list-item">
                                        <div className="sources-list-item-quality">{ getQualityLabel(sourceKey, source) }</div>
                                        <div className="sources-list-item-info">
                                            <h4>{ serverKeys[sourceKey.slice(0,2)] }</h4>
                                            <p>{ nativeServers.includes(sourceKey.slice(0,2)) ? "المشغل المحلي" : "مشغل مدمج" }</p>
                                        </div>
                                    </div>)
                            } else {
                                return null
                            }
                        }) }
                    </motion.div>
                : null }
            </AnimatePresence>
        </div>
    )
}

export default SourceSelector