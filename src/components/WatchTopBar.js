import { useEffect } from "react"

const WatchTopBar = ({ episodeName, animeTitle }) => {

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
                <h1 className="top-bar-anime-title">{ animeTitle }</h1>
                <p className="top-bar-episode-name">{ episodeName }</p>
            </div>
            <div className="floating-button" onClick={ () => document.getElementById("episodes-popup").style.display = "flex" }><span className="mdi mdi-cards-variant"></span>
            الحلقات
            </div>
        </div>
    )
}

export default WatchTopBar