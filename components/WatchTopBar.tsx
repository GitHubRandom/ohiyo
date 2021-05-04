import { useEffect } from "react"

interface IWatchTopBar {
    showEpisodeButton: boolean,
    episodeName: string,
    animeTitle: string,
    episode: Record<string,any>
}

export const getEpisodeTags = (episode: Record<string,any>) => {
    let tags = []
    if (episode.IsSpecial == "1") {
        tags.push(<span key="special" id="special" className="episode-tag">خاصة</span>)
    } else if (episode.IsFlr == "1") {
        tags.push(<span key="filler" id="filler" className="episode-tag">فلر</span>)
    } else if (episode.IsLast == "1") {
        tags.push(<span key="last" id="last" className="episode-tag">الأخيرة</span>)
    } else if (episode.IsOva == "1") {
        tags.push(<span key="ova" id="ova" className="episode-tag">أوفا</span>)
    }
    return tags
}

const WatchTopBar = ({ episode, showEpisodeButton, episodeName, animeTitle }: IWatchTopBar) => {

    useEffect(() => {
        if (episodeName && animeTitle) {
            document.title = `${ animeTitle } - ${episodeName}`
        }
    }, [])

    return (
        <div className="top-bar">
            <div className="top-bar-text">
                { animeTitle ? <h1 className="top-bar-anime-title">{ animeTitle }</h1> : <div className="anime-title-placeholder loading"></div>}
                { episodeName ? <p className="top-bar-episode-name">{ episodeName }{ getEpisodeTags(episode) }</p> : <div className="episode-name-placeholder loading"></div> }
            </div>
            { showEpisodeButton ?
            <div id="episodes-button" className="floating-button"><span className="mdi mdi-cards-variant"></span>
            الحلقات
            </div> : null }
        </div>
    )
}

export default WatchTopBar