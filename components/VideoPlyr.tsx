import { useRef, useEffect, useState, memo } from 'react'
import { getEpisodeTags } from './WatchTopBar'
import tippy from 'tippy.js'
import Plyr, { QualityOptions } from 'plyr'
import 'plyr/dist/plyr.css'

const VideoPlyr = ({ introInterval, sources, openingName, episode, episodeTitle }) => {

    const [ inIntro, setInIntro ] = useState(false)
    const [ showCopyConfirm, setShowCopyConfirm ] = useState(false)
    const [ dismiss, setDismiss ] = useState(false)
    const [ UIShown, setUIShown ] = useState(false)
    const player = useRef<Plyr>() // Plyr
    const plyrHost = useRef<HTMLVideoElement>()
    const videoPlayerContainer = useRef<HTMLDivElement>()
    const videoOverlay = useRef<HTMLDivElement>()
    // Swipe detection
    const swipeStart = useRef<number>()
    const [ swipeDelta, updateSwipeDelta ] = useState<number>(0)

    const startTouchHandler = event => {
        swipeStart.current = event.changedTouches[0].screenX 
    }

    const moveTouchHandler = event => {
        if (event.changedTouches) {
            const swipeDeltaX = event.changedTouches[0].screenX - swipeStart.current
            updateSwipeDelta(swipeDeltaX)
        }  
    }

    const endTouchHandler = () => {
        if (player.current && (swipeDelta > 1 || swipeDelta < -1)) {
            player.current.forward(swipeDelta * 0.1)
        }
        updateSwipeDelta(0)    
    }

    const skipIntro = event => {
        /**
         * The event is needed to check if skip intro was actually clicked or
         * the dismiss button.
         *  */
        if (player.current && introInterval[0] != introInterval[1] && !event.target.classList.contains('dismiss-skip')) player.current.currentTime = introInterval[1]
    }

    const forwardTen = () => {
        // Forward video 10 secs
        if (player.current) player.current.forward(10)
    }

    const rewindTen = () => {
        // Rewind video 10 secs
        if (player.current) player.current.rewind(10)
    }

    const isMobileDevice = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

    useEffect(() => {
        // Reinit tippy every re-render
        tippy("[data-tippy-content]")
    })

    // Destroy & initialize player when sources changes
    useEffect(() => {
        player.current = new Plyr(plyrHost.current, {
            quality: {
                default: 1080
            } as QualityOptions,
            ratio: "16:9",
            fullscreen: {
                container: '#video-plyr'
            },
            tooltips: {
                controls: true,
                seek: true
            },
            i18n: {
                play: "تشغيل",
                pause: "وقف",
                quality: "الجودة",
                speed: "السرعة",
                normal: "عادي",
                mute: "كتم الصوت",
                download: "تحميل",
                enterFullscreen: "شاشة كاملة",
                exitFullscreen: "الخروج من الشاشة الكاملة",
                settings: "الإعدادات"
            },
            controls: ['play', 'progress', 'current-time', 'download', 'mute', 'volume', 'settings', 'fullscreen', 'pip']
        })
        player.current.on('controlshidden', () => {
            setUIShown(false)
        })
        player.current.on('controlsshown', () => {
            setUIShown(true)
        })
        if (player.current.elements.container) {
            player.current.elements.container.addEventListener('touchstart', startTouchHandler)
            player.current.elements.container.addEventListener('touchmove', moveTouchHandler)
        }
        return () => {
            if (player.current.elements.container) {
                player.current.elements.container.removeEventListener('touchstart', startTouchHandler)
                player.current.elements.container.removeEventListener('touchmove', moveTouchHandler)
            }
            // Clean effect
            setInIntro(false)
            setDismiss(false)
        }
    }, [])

    useEffect(() => {
        if (player.current.elements.container) {
            player.current.elements.container.addEventListener('touchend', endTouchHandler)
            return () => {
                player.current.elements.container.removeEventListener('touchend', endTouchHandler)
            }    
        }
    }, [swipeDelta])

    useEffect(() => {
        if (player.current) {
            player.current.source = {
                type: 'video',
                sources: sources
            }
        }
    }, [sources])

    useEffect(() => {
        const keyPressCallback = event => {
            const key = event.key
            if (inIntro && key == "Enter") {
                event.preventDefault()
                player.current.currentTime = introInterval[1]
            }
        }
        window.addEventListener("keydown", keyPressCallback)
        return () => {
            window.removeEventListener("keydown", keyPressCallback)
        }
    }, [introInterval, inIntro])

    useEffect(() => {
        const introCheck = !dismiss ? window.setInterval(() => {
            if (player.current) {
                const currentTime = player.current.currentTime
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
        <div dir="ltr" ref={ videoPlayerContainer } id="video-plyr" className="anime-video-player">
            <video ref={ plyrHost }></video>
            { swipeDelta > 1 || swipeDelta < -1 ? 
                <div className="swipe-indicator">
                    { swipeDelta }
                </div>
            : null }
            <div ref={ videoOverlay } className="anime-video-overlay">
                <div id="bebi-ads"></div>
                <div style={{ opacity: UIShown ? 1 : 0 }} className="anime-video-info">
                    <h1 style={{ margin: 0 }} className="top-bar-anime-title">{ episode.Title }</h1>
                    <p style={{ marginBottom: 7 }} className="top-bar-episode-name">{ episode.Episode ? `الحلقة ${episode.Episode}` : "الفلم" }{ getEpisodeTags(episode) }{ episodeTitle.length ? <><span style={{ marginTop: 2 }} className="mdi mdi-nm mdi-circle-medium"></span><span title="عنوان الحلقة" dir="ltr" className="episode-title">{ episodeTitle }</span></> : null }</p>
                    { openingName &&
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
                        </div> }
                </div>
                <button dir="rtl" onClick={ event => skipIntro(event) } style={{ display: inIntro && UIShown ? "flex" : "none" }} type="button" id="episode-skip-intro">
                    <span data-tippy-content="إلغاء" onClick={ () => setDismiss(true) } className="mdi mdi-close dismiss-skip"></span>
                    <span className="skip-intro-text">تخطي المقدمة</span>
                    { !isMobileDevice() ? <span className="skip-intro-shortcut">Enter</span> : null}
                </button>
            </div>
        </div>    
    )

}

export default memo(VideoPlyr)