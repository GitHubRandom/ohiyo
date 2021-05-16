import React, { useEffect } from "react"
import { motion } from 'framer-motion'

interface IWatchTopBar {
    showEpisodeButton: boolean,
    episodeName: string,
    animeTitle: string,
    episode: Record<string,any>,
    episodeTitle: string
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

const WatchTopBar = ({ episodeTitle, episode, showEpisodeButton, episodeName, animeTitle }: IWatchTopBar) => {

    useEffect(() => {
        if (episodeName && animeTitle) {
            document.title = `${ animeTitle } - ${episodeName}`
        }
    }, [])

    return (
        <div className="top-bar">
            <div className="top-bar-text">
                { animeTitle ? <h1 className="top-bar-anime-title">{ animeTitle }</h1> : <div className="anime-title-placeholder loading"></div>}
                { episodeName ? <p className="top-bar-episode-name"><span className="episode-name">{ episodeName }{ getEpisodeTags(episode) }</span>{ episodeTitle.length ? <><span style={{ marginTop: 2 }} className="mdi mdi-nm mdi-circle-medium"></span><span title="عنوان الحلقة" dir="ltr" className="episode-title">{ episodeTitle }</span></> : null }</p> : <div className="episode-name-placeholder loading"></div> }
            </div>
            { showEpisodeButton ?
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1.0 }} transition={{ delay: 0.7 }} id="episodes-button" className="floating-button"><span className="mdi mdi-cards-variant"></span>
            الحلقات
            </motion.div> : null }
        </div>
    )
}

export default React.memo(WatchTopBar)