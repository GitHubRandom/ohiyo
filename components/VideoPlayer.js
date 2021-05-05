import React from 'react'
import Plyr from 'plyr'
import 'plyr/dist/plyr.css'

class VideoPlayer extends React.Component {

    componentDidMount() {
        this.player = new Plyr('#main-content', {
            title: this.props.title,
            controls: ['play-large', 'rewind', 'play', 'fast-forward', 'progress', 'current-time', 'mute', 'download', 'volume', 'settings', 'pip', 'airplay', 'fullscreen'],
            quality: {
                default: "1080"
            },
            keyboard: {
                focused: false,
                global: true
            }
        })
        this.player.source = this.props.sources
    }

    componentDidUpdate() {
        this.player.source = this.props.sources
    }

    componentWillUnmount() {
        this.player.destroy()
    }

    render() {
        return (
            <div className="anime-video-player">
                <video id="main-content" playsInline controls className='player plyr'>
                </video> 
            </div>
        )
    }
}

export default VideoPlayer
