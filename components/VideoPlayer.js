import next from 'next'
import React from 'react'


class VideoPlayer extends React.Component {

    constructor(props) {
        super(props)
        this.introButton = React.createRef()
        this.videoContainer = React.createRef()
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
                } else if (this.introButton.current.style.display == "block") {
                    this.introButton.current.style.display = "none"
                }
            }
        })
        document.querySelector(".dplayer-video").removeAttribute("crossorigin")
        this.videoContainer.current.appendChild(this.introButton.current)
    }

    shouldComponentUpdate(nextProps, nextState) {
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
                <button onClick={ this.skipIntro.bind(this) } ref={ this.introButton } style={{ display: "none" }} type="button" id="episode-skip-intro">
                    تخطي المقدمة
                </button>  
            </div>
        )
    }
}

export default VideoPlayer
