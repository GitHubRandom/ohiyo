import next from 'next'
import React from 'react'


class VideoPlayer extends React.Component {

    constructor(props) {
        super(props)
        this.videoOverlay = React.createRef()
        this.introButton = React.createRef()
        this.videoContainer = React.createRef()
        this.forward = React.createRef()
        this.rewind = React.createRef()
        this.videoAd = React.createRef()
        this.openingHint = React.createRef()
        this.copyConfirm = React.createRef()
        this.rewindTen = this.rewindTen.bind(this)
        this.forwardTen = this.forwardTen.bind(this)
        this.skipIntro = this.skipIntro.bind(this)
        this.showCopyConfirm = this.showCopyConfirm.bind(this)
    }

    initDPlayer() {
        let video = {
            quality: this.props.sources,
            defaultQuality: 0
        }
        if (this.props.sources.length == 1) {
            video = {
                url: this.props.sources[0].url,
                type: "normal"
            }
        }
        const DPlayer = require('dplayer')
        this.player = new DPlayer({
            container: this.videoContainer.current,
            theme: '#fffb00',
            video
        })
        this.player.on('progress', () => {
            const currentProgress = this.player.video.currentTime
            if (this.props.introInterval[0] != this.props.introInterval[1]) {
                if (currentProgress >= this.props.introInterval[0] && currentProgress <= this.props.introInterval[1]) {
                    this.introButton.current.style.display = "block"
                    if (this.props.openingName.length) this.openingHint.current.style.opacity = "1"
                } else if (this.introButton.current.style.display == "block") {
                    this.introButton.current.style.display = "none"
                    if (this.props.openingName.length) this.openingHint.current.style.opacity = "0"
                }
            }
        })
        // Why TF did they add crossorigin attribute by default ?
        document.querySelector(".dplayer-video").removeAttribute("crossorigin")
        this.videoContainer.current.appendChild(this.videoOverlay.current)
    }

    shouldComponentUpdate(nextProps,nextState) {
        return !((this.props.introInterval[0] != nextProps.introInterval[0] && this.props.introInterval[1] != nextProps.introInterval[1])
            || nextProps.openingName != this.props.openingName) 
    }

    componentDidMount() {
        this.initDPlayer()
    }

    componentDidUpdate() {
        this.player.destroy()
        this.initDPlayer()
    }

    forwardTen() {
        this.player.seek(this.player.video.currentTime + 10)
    }

    rewindTen() {
        this.player.seek(this.player.video.currentTime - 10)
    }

    skipIntro() {
        if (this.props.introInterval != undefined && this.props.introInterval.length != 0) {
            this.player.seek(this.props.introInterval[1])
            this.introButton.current.style.display = 'none'
        }
    }

    componentWillUnmount() {
        this.player.destroy()
    }

    showCopyConfirm() {
        if (this.copyConfirm.current) {
            this.copyConfirm.current.style.height = "20px"
            setTimeout(() => {
                this.copyConfirm.current.style.height = "0"
            }, 2000)
        }
    }

    render() {
        return (
            <div dir="ltr" ref={ this.videoContainer } className="anime-video-player">
                <div ref={ this.videoOverlay } className="anime-video-overlay">
                    <button onClick={ this.skipIntro } ref={ this.introButton } style={{ display: "none" }} type="button" id="episode-skip-intro">
                        تخطي المقدمة
                    </button>
                    <div ref={ this.videoAd } id="video-ad">
                    </div>
                    <div style={{ opacity: 0 }} ref={ this.openingHint } className="opening-hint">
                        <div className="opening-hint-container">
                            <div className="opening-hint-icon">
                                <span className="mdi mdi-music-note mdi-nm"></span>
                            </div>
                            <div className="opening-hint-text">
                                <p>
                                    اسم المقدمة
                                </p>
                                <p onClick={ () => { navigator.clipboard.writeText(this.props.openingName); this.showCopyConfirm() } }>
                                    { this.props.openingName }
                                </p>
                            </div>
                        </div>
                        <div ref={ this.copyConfirm } className="opening-hint-copy-confirm">
                            <span className="mdi mdi-content-copy"></span>تم النسخ
                        </div>
                    </div>
                    { /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? <>
                        <div onClick={ () => document.querySelector(".dplayer-video-current").click() } onDoubleClick={ this.forwardTen } ref={ this.forward } id="forward" className="control-overlay">
                        </div>  
                        <div onClick={ () => document.querySelector(".dplayer-video-current").click() } onDoubleClick={ this.rewindTen } ref={ this.rewind } id="rewind" className="control-overlay">
                        </div></> : null }
                </div>
            </div>
        )
    }
}

export default VideoPlayer
