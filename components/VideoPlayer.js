import React from 'react'
import Plyr from 'plyr'
import 'plyr/dist/plyr.css'

class VideoPlayer extends React.PureComponent {

    constructor(props) {
        super(props)
        this.introButton = React.createRef()
    }

    componentDidMount() {
        this.player = new Plyr('#main-content', {
            title: this.props.title,
            controls: ['play-large', 'rewind', 'play', 'fast-forward', 'progress', 'current-time', 'mute', 'download', 'volume', 'settings', 'pip', 'airplay', 'fullscreen'],
            quality: {
                default: "1080"
            },
            fullscreen: {
                container: ".anime-video-player"
            },
            keyboard: {
                focused: false,
                global: true
            }
        })
        this.player.source = this.props.sources
        this.player.on('progress', () => {
            if (this.player.currentTime > this.props.introInterval[0] && this.player.currentTime < this.props.introInterval[1]) {
                this.introButton.current.style.display = 'block'
            } else if (this.introButton.current.style.display != 'none') {
                this.introButton.current.style.display = 'none'
            }
        })
    }

    componentDidUpdate() {
        this.player.source = this.props.sources
    }

    skipIntro() {
        if (this.props.introInterval != undefined && this.props.introInterval.length != 0) {
            this.player.currentTime = this.props.introInterval[1]
            this.introButton.current.style.display = 'none'
        }
    }

    componentWillUnmount() {
        this.player.destroy()
    }

    render() {
        return (
            <div className="anime-video-player">
                <video id="main-content" playsInline controls className='player plyr'>
                </video>
                <button onClick={ this.skipIntro.bind(this) } ref={ this.introButton } style={{ display: "none" }} type="button" id="episode-skip-intro">
                    تخطي المقدمة
                </button>  
            </div>
        )
    }
}

/*function toSeconds(time) {
    var timeSplit = time.split(":")
    return (+timeSplit[0]) * 60 * 60 + (+timeSplit[1]) * 60 + (+timeSplit[2])
}*/

export default VideoPlayer
