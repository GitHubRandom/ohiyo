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
        this.openingHint = React.createRef()
        this.rewindTen = this.rewindTen.bind(this)
        this.forwardTen = this.forwardTen.bind(this)
        this.skipIntro = this.skipIntro.bind(this)
        this.state = {
            showIntro: false
        }
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
            video: {
                quality: this.props.sources,
                defaultQuality: 0
            }
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
        document.querySelector(".dplayer-video").removeAttribute("crossorigin")
        this.videoContainer.current.appendChild(this.introButton.current)
        if (this.forward.current && this.rewind.current) {
            this.videoContainer.current.appendChild(this.forward.current)
            this.videoContainer.current.appendChild(this.rewind.current)
        }
        if (this.videoAd.current) {
            this.videoContainer.current.appendChild(this.videoAd.current)
        }
        if (this.openingHint) {
            this.videoContainer.current.appendChild(this.openingHint.current)
        }
    }

    shouldComponentUpdate(nextProps,nextState) {
        return !((this.props.introInterval[0] != nextProps.introInterval[0] && this.props.introInterval[1] != nextProps.introInterval[1])
            || nextProps.openingName != this.props.openingName || nextState.showIntro != this.state.showIntro) 
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
                <div style={{ opacity: 0 }} ref={ this.openingHint } className="opening-hint">
                    <div onClick={ () => this.setState({ showIntro: !this.state.showIntro }) } className="opening-hint-icon">
                        <span className="mdi mdi-music-note mdi-nm"></span>
                    </div>
                    <div className="opening-hint-text">
                        <p>
                            اسم المقدمة
                        </p>
                        <p onClick={ () => navigator.clipboard.writeText(this.props.openingName) }>
                            { this.props.openingName }
                        </p>
                    </div>
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
