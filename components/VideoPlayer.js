import { useRef, useEffect, useState, memo } from 'react'

const VideoPlayer = ({ introInterval, sources, openingName }) => {

    const [ inIntro, setInIntro ] = useState(false)
    const [ showCopyConfirm, setShowCopyConfirm ] = useState(false)
    const [ dismiss, setDismiss ] = useState(false)
    const player = useRef() // DPlayer
    const videoPlayerContainer = useRef()
    const videoOverlay = useRef()

    // Destroy & initialize player when sources changes
    useEffect(() => {
        let video = sources.length == 1 ? {
            url: sources[0].url,
            type: "normal"
        } : {
            quality: sources,
            defaultQuality: 0
        }
        const DPlayer = require('dplayer')
        player.current = new DPlayer({
            container: videoPlayerContainer.current,
            theme: '#fffb00',
            video
        })
        // DPlayer puts crossorigin attribute by default
        document.querySelector(".dplayer-video").removeAttribute("crossorigin")
        // Reimplement overlay elements (DPlayer removes all container's children).
        videoPlayerContainer.current.appendChild(videoOverlay.current)    
        return () => {
            // Clean effect
            setInIntro(false)
            setDismiss(false)
            player.current.destroy()
        }
    }, [sources])

    useEffect(() => {
        if (player.current && introInterval[0] != introInterval[1]) {
            player.current.options.highlight = [
                {
                    text: 'بداية المقدمة',
                    time: introInterval[0],
                },
                {
                    text: 'نهاية المقدمة',
                    time: introInterval[1]
                },
            ]
        }
    }, [introInterval])

    useEffect(() => {
        let introCheck = !dismiss ? window.setInterval(() => {
            if (player.current) {
                const currentTime = player.current.video.currentTime
                if (currentTime >= introInterval[0] && currentTime < introInterval[1]) {
                    setInIntro(true)
                } else {
                    setInIntro(false)
                }
            }
        }, 1000) : null
        return () => {
            if (introCheck) {
                clearInterval(introCheck)
                setInIntro(false)
            }
        }
    }, [introInterval, dismiss])

    // An effect for timing out copying opening name confirmation.
    useEffect(() => {
        if (showCopyConfirm) {
            setTimeout(() => {
                setShowCopyConfirm(false)
            }, 2000)
        }
    }, [showCopyConfirm])

    const skipIntro = (event) => {
        /**
         * The event is needed to check if skip intro was actually clicked or
         * the dismiss button.
         *  */ 
        if (player.current && introInterval[0] != introInterval[1] && event.target.tagName.toLowerCase() === 'button') player.current.seek(introInterval[1])
    }

    const forwardTen = () => {
        // Forward video 10 secs
        if (player.current) player.current.seek(player.current.video.currentTime + 10)
    }

    const rewindTen = () => {
        // Rewind video 10 secs
        if (player.current) player.current.seek(player.current.video.currentTime - 10)
    }

    return (
        <div dir="ltr" ref={ videoPlayerContainer } className="anime-video-player">
            <div ref={ videoOverlay } className="anime-video-overlay">
                <button dir="rtl" onClick={ (event) => skipIntro(event) } style={{ display: inIntro ? "block" : "none" }} type="button" id="episode-skip-intro">
                    <span onClick={ () => setDismiss(true) } className="mdi mdi-close dismiss-skip"></span>
                    تخطي المقدمة
                </button>
                <div style={{ opacity: inIntro && openingName.length ? 1 : 0 }} className="opening-hint">
                    <div className="opening-hint-container">
                        <div className="opening-hint-icon">
                            <span className="mdi mdi-music-note mdi-nm"></span>
                        </div>
                        <div className="opening-hint-text">
                            <p>
                                اسم المقدمة
                            </p>
                            <p onClick={ () => { navigator.clipboard.writeText(openingName); setShowCopyConfirm(true) } }>
                                { openingName }
                            </p>
                        </div>
                    </div>
                    <div style={{ height: showCopyConfirm ? "20px" : "0" }} className="opening-hint-copy-confirm">
                        <span className="mdi mdi-content-copy"></span>تم النسخ
                    </div>
                    { /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? <>
                        <div onClick={ () => document.querySelector(".dplayer-video-current").click() } onDoubleClick={ forwardTen } id="forward" className="control-overlay">
                        </div>  
                        <div onClick={ () => document.querySelector(".dplayer-video-current").click() } onDoubleClick={ rewindTen }  id="rewind" className="control-overlay">
                        </div></> : null }
                </div>
            </div>
        </div>    
    )

}

export default memo(VideoPlayer)