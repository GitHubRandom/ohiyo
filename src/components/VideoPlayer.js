import React from 'react'
import Plyr from 'plyr'
import 'plyr/dist/plyr.css'

class VideoPlayer extends React.Component {

    componentDidMount() {
        this.player = new Plyr('#main-content', {
            title: this.props.title,
            controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'download', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen'],
            fullscreen: {
                container: ".anime-video-player"
            },
            ratio: "16:9",
            keyboard: {
                focused: false,
                global: true
            }
        })
        this.player.source = this.props.sources
        if (this.props.introInterval.length != 0 && this.props.introInterval != undefined) {
            var introSeconds = [toSeconds(this.props.introInterval[0]), toSeconds(this.props.introInterval[1])]
            this.player.on('progress', () => {
                if (this.player.currentTime > introSeconds[0] && this.player.currentTime < introSeconds[1]) {
                    document.getElementById('episode-skip-intro').style.display = 'block'
                } else if (document.getElementById('episode-skip-intro').style.display != 'none') {
                    document.getElementById('episode-skip-intro').style.display = 'none'
                }
            })    
        }    
    }

    componentDidUpdate() {
        this.player.source = this.props.sources
        if (this.props.introInterval != undefined && this.props.introInterval.length != 0) {
            var introSeconds = [toSeconds(this.props.introInterval[0]), toSeconds(this.props.introInterval[1])]
            this.player.on('progress', () => {
                if (this.player.currentTime > introSeconds[0] && this.player.currentTime < introSeconds[1]) {
                    document.getElementById('episode-skip-intro').style.display = 'block'
                } else if (document.getElementById('episode-skip-intro').style.display != 'none') {
                    document.getElementById('episode-skip-intro').style.display = 'none'
                }
            })    
        }
    }

    skipIntro() {
        if (this.props.introInterval != undefined && this.props.introInterval.length != 0) {
            this.player.currentTime = toSeconds(this.props.introInterval[1])
        }
    }

    componentWillUnmount() {
        this.player.destroy()
    }

    render() {
        return (
            <div className="anime-video-player">
                <video id="main-content" rel="noreferrer" playsInline controls className='player plyr'>
                </video> 
                <button onClick={ this.skipIntro.bind(this) } style={{ display: "none" }} type="button" id="episode-skip-intro">
                    تخطي المقدمة
                </button>    
            </div>
        )
    }
}

function toSeconds(time) {
    var timeSplit = time.split(":")
    return (+timeSplit[0]) * 60 * 60 + (+timeSplit[1]) * 60 + (+timeSplit[2])
}

export default VideoPlayer
