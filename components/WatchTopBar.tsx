import React, { useEffect, useRef } from "react"
import { motion } from 'framer-motion'
import { useState } from "react"
import Link from 'next/link'
import { useCallback } from "react"
import Popup from "./Popup"

interface IWatchTopBar {
    episodeName: string,
    animeTitle: string,
    episodeNumber: number,
    episodeTitle: string,
    episodesList: Record<string,string>[],
    mal: string,
    animeId: string
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

const WatchTopBar = ({ mal, animeId, episodesList, episodeTitle, episodeNumber, episodeName, animeTitle }: IWatchTopBar) => {

    const [ ascending, updateEpisodesOrder ] = useState<boolean>(true)
    const episodesPopupTrigger = useRef()

    useEffect(() => {
        if (episodeName && animeTitle) {
            document.title = `${ animeTitle } - ${episodeName}`
        }
    }, [])

    const reverseList = useCallback(() => {
        updateEpisodesOrder(!ascending)
    }, [ascending])

    const dismissPopup = () => {
        (document.getElementsByClassName("popup")[0] as HTMLElement).style.display = "none"
    }

    return (
        <div className="top-bar">
            <div className="top-bar-text">
                { animeTitle ? <h1 className="top-bar-anime-title">{ animeTitle }</h1> : <div className="anime-title-placeholder loading"></div>}
                { episodeName ? <p className="top-bar-episode-name"><span className="episode-name">{ episodeName }{ getEpisodeTags(episodesList[episodeNumber - 1]) }</span>{ episodeTitle.length ? <><span style={{ marginTop: 2 }} className="mdi mdi-nm mdi-circle-medium"></span><span title="عنوان الحلقة" dir="ltr" className="episode-title">{ episodeTitle }</span></> : null }</p> : <div className="episode-name-placeholder loading"></div> }
            </div>
            { episodesList.length > 1 ?
            <motion.div ref={ episodesPopupTrigger } initial={{ scale: 0 }} animate={{ scale: 1.0 }} transition={{ delay: 0.7 }} id="episodes-button" className="floating-button"><span className="mdi mdi-cards-variant"></span>
            الحلقات
            </motion.div> : null }
            { episodesList.length > 1 ?
                <Popup id="episodes-popup" trigger={ episodesPopupTrigger } title="الحلقات">
                    { ascending ? <>
                        <div onClick={ () => reverseList() } style={{ display: "inline" }} className="dark-button episodes-popup-order">
                            <span className="mdi mdi-sort-ascending"></span>تصاعدي
                        </div>
                        <div id="episodes-list" className="popup-list">
                            { episodesList.map((episode,index) => {
                                return <Link scroll={ false } href={ "/watch/" + animeId + '-' + mal + "/" + (index + 1) } key={ index }><a onClick={ () => dismissPopup() } className="episode-link">{ `الحلقة ${episode.Episode}${episode.ExtraEpisodes.length ? `-${episode.ExtraEpisodes}` : ""}` }{ getEpisodeTags(episode) }</a></Link>
                            })}
                        </div>
                        </>
                    : <>
                        <div onClick={ () => reverseList() } style={{ display: "inline" }} className="dark-button episodes-popup-order">
                            <span className="mdi mdi-sort-descending"></span>تنازلي
                        </div>
                        <div id="episodes-list" className="popup-list">
                            { episodesList.map((episode,index) => {
                                return <Link scroll={ false } href={ "/watch/" + animeId + '-' + mal + "/" + (index + 1) } key={ index }><a onClick={ () => dismissPopup() } className="episode-link">{ `الحلقة ${episode.Episode}${episode.ExtraEpisodes.length ? `-${episode.ExtraEpisodes}` : ""}` }{ getEpisodeTags(episode) }</a></Link>
                            }).reverse()}
                        </div>
                        </>
                    }
                </Popup> : null }
        </div>
    )
}

export default React.memo(WatchTopBar)