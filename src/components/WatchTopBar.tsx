import { useEffect } from "react"

interface IWatchTopBar {
    showEpisodeButton: boolean,
    episodeName: string,
    animeTitle: string
}

const WatchTopBar = ({ showEpisodeButton, episodeName, animeTitle }: IWatchTopBar) => {

    useEffect(() => {
        if (episodeName && animeTitle) {
            document.title = `${ animeTitle } - ${episodeName}`
        }
        window.onscroll = () => {
            var button = document.getElementsByClassName("floating-button")[0] as HTMLElement
            if (button && window.innerWidth > 600 && window.pageYOffset < 100) {
                button.style.position = "unset"
            } else if (button) {
                button.style.position = "fixed"
            }
        }
    })

    return (
        <div className="top-bar">
            <div className="top-bar-text">
                { animeTitle ? <h1 className="top-bar-anime-title">{ animeTitle }</h1> : <div className="anime-title-placeholder loading"></div>}
                { episodeName ? <p className="top-bar-episode-name">{ episodeName }</p> : <div className="episode-name-placeholder loading"></div> }
            </div>
            { showEpisodeButton ?
            <div id="episodes-button" className="floating-button"><span className="mdi mdi-cards-variant"></span>
            الحلقات
            </div> : null }
        </div>
    )
}

export default WatchTopBar