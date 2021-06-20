import next from 'next'
import React from 'react'


class VideoPlayer extends React.Component {

    constructor(props) {
        super(props)
        this.introButton = React.createRef()
        this.videoContainer = React.createRef()
        this.forward = React.createRef()
        this.rewind = React.createRef()
        this.videoAd = React.createRef()
        this.rewindTen = this.rewindTen.bind(this)
        this.forwardTen = this.forwardTen.bind(this)
        this.skipIntro = this.skipIntro.bind(this)
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
                } else if (this.introButton.current.style.display == "block") {
                    this.introButton.current.style.display = "none"
                }
            }
        })
        // Why TF did they add crossorigin attribute by default ?w
        document.querySelector(".dplayer-video").removeAttribute("crossorigin")
        this.videoContainer.current.appendChild(this.introButton.current)
        if (this.forward.current && this.rewind.current) {
            this.videoContainer.current.appendChild(this.forward.current)
            this.videoContainer.current.appendChild(this.rewind.current)
        }
        if (this.videoAd.current) {
            this.videoContainer.current.appendChild(this.videoAd.current)
        }
    }

    shouldComponentUpdate(nextProps,_) {
        if (this.props.introInterval[0] != nextProps.introInterval[0] && this.props.introInterval[1] != nextProps.introInterval[1]) {
            return false
        }
        return true
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

    render() {
        return (
            <div dir="ltr" ref={ this.videoContainer } className="anime-video-player">
                <button onClick={ this.skipIntro } ref={ this.introButton } style={{ display: "none" }} type="button" id="episode-skip-intro">
                    تخطي المقدمة
                </button>
                <div ref={ this.videoAd } id="video-ad">
                </div>
                { /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? <>
                    <div onClick={ () => document.querySelector(".dplayer-video-current").click() } onDoubleClick={ this.forwardTen } ref={ this.forward } id="forward" className="control-overlay">
                    </div>  
                    <div onClick={ () => document.querySelector(".dplayer-video-current").click() } onDoubleClick={ this.rewindTen } ref={ this.rewind } id="rewind" className="control-overlay">
                    </div></> : null }
            </div>
        )
    }
}

export default VideoPlayer
