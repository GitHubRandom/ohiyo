import { useEffect } from "react"

const WatchTopBar = ({ showEpisodeButton, episodeName, animeTitle }) => {

    useEffect(() => {
        window.onscroll = () => {
            var button = document.getElementsByClassName("floating-button")[0]
            if (button && window.innerWidth > 600 && window.pageYOffset < 60) {
                button.style.position = "unset"
            } else {
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
            <div className="floating-button" onClick={ () => document.getElementById("episodes-popup").style.display = "flex" }><span className="mdi mdi-cards-variant"></span>
            الحلقات
            </div> : null }
        </div>
    )
}

export default WatchTopBar