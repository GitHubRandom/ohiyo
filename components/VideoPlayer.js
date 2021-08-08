import { useRef, useEffect, useState, memo } from 'react'
import { getEpisodeTags } from './WatchTopBar'
import tippy from 'tippy.js'

const VideoPlayer = ({ introInterval, sources, openingName, episode, episodeTitle }) => {

    const [ inIntro, setInIntro ] = useState(false)
    const [ showCopyConfirm, setShowCopyConfirm ] = useState(false)
    const [ dismiss, setDismiss ] = useState(false)
    const [ UIShown, setUIShown ] = useState(false)
    const player = useRef() // DPlayer
    const videoPlayerContainer = useRef()
    const videoOverlay = useRef()

    const skipIntro = (event) => {
        /**
         * The event is needed to check if skip intro was actually clicked or
         * the dismiss button.
         *  */ 
        if (player.current && introInterval[0] != introInterval[1] && !event.target.classList.contains('dismiss-skip')) player.current.seek(introInterval[1])
    }

    const forwardTen = () => {
        // Forward video 10 secs
        if (player.current) player.current.seek(player.current.video.currentTime + 10)
    }

    const rewindTen = () => {
        // Rewind video 10 secs
        if (player.current) player.current.seek(player.current.video.currentTime - 10)
    }

    const isMobileDevice = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

    useEffect(() => {
        // Reinit tippy every re-render
        tippy("[data-tippy-content]")
    })

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
        // Reimplementing overlay elements (DPlayer removes all container's children).
        videoPlayerContainer.current.appendChild(videoOverlay.current) 
        
        let mutationObserver = new MutationObserver((mutations) => {
            const classes = mutations[0].target.classList
            if (classes.contains("dplayer-hide-controller")) {
                setUIShown(false)
            } else {
                setUIShown(true)
            }
        })

        mutationObserver.observe(videoPlayerContainer.current, {
            attributes: true,
            attributeFilter: ['class'],
            childList: false,
            characterData: false
        })
        return () => {
            // Clean effect
            setInIntro(false)
            setDismiss(false)
            mutationObserver.disconnect()
            player.current.destroy()
        }
    }, [sources])

    useEffect(() => {
        const keyPressCallback = event => {
            let key = event.key
            if (inIntro && key == "Enter") {
                event.preventDefault()
                player.current.seek(introInterval[1])
            }
        }
        window.addEventListener("keydown", keyPressCallback)
        return () => {
            window.removeEventListener("keydown", keyPressCallback)
        }
    }, [introInterval, inIntro])

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

    return (
        <div dir="ltr" ref={ videoPlayerContainer } className="anime-video-player">
            <div ref={ videoOverlay } className="anime-video-overlay">
                <div id="bebi-ads">
                </div>
                <div style={{ opacity: UIShown ? 1 : 0 }} className="anime-video-info">
                    <h1 style={{ margin: 0 }} className="top-bar-anime-title">{ episode.Title }</h1>
                    <p style={{ marginBottom: 7 }} className="top-bar-episode-name">{ episode.Episode ? `الحلقة ${episode.Episode}` : "الفلم" }{ getEpisodeTags(episode) }{ episodeTitle.length ? <><span style={{ marginTop: 2 }} className="mdi mdi-nm mdi-circle-medium"></span><span title="عنوان الحلقة" dir="ltr" className="episode-title">{ episodeTitle }</span></> : null }</p>
                    <div style={{ opacity: inIntro && UIShown ? 1 : 0 }} className="opening-hint">
                        <div className="opening-hint-container">
                            <div className="opening-hint-icon">
                                <span className="mdi mdi-music-note mdi-nm"></span>
                            </div>
                            <p className="opening-hint-text" onClick={ () => { navigator.clipboard.writeText(openingName); setShowCopyConfirm(true) } }>
                                { openingName }
                            </p>
                        </div>
                        <div style={{ height: showCopyConfirm ? "20px" : "0" }} className="opening-hint-copy-confirm">
                            <span className="mdi mdi-content-copy"></span>تم النسخ
                        </div>
                    </div>
                </div>
                <button dir="rtl" onClick={ event => skipIntro(event) } style={{ display: inIntro && UIShown ? "flex" : "none" }} type="button" id="episode-skip-intro">
                    <span data-tippy-content="إلغاء" onClick={ () => setDismiss(true) } className="mdi mdi-close dismiss-skip"></span>
                    <span className="skip-intro-text">تخطي المقدمة</span>
                    { !isMobileDevice() ? <span className="skip-intro-shortcut">Enter</span> : null}
                </button>
                { isMobileDevice() ? <>
                    <div onClick={ () => document.querySelector(".dplayer-video-current").click() } onDoubleClick={ forwardTen } id="forward" className="control-overlay">
                    </div>  
                    <div onClick={ () => document.querySelector(".dplayer-video-current").click() } onDoubleClick={ rewindTen }  id="rewind" className="control-overlay">
                    </div></> : null }
            </div>
        </div>    
    )

}

export default memo(VideoPlayer)