import React, { useEffect, useRef } from "react"
import { motion, useCycle } from 'framer-motion'
import { useState } from "react"
import Link from 'next/link'
import Router from 'next/router'
import { useCallback } from "react"
import Popup from "./Popup"

interface IWatchTopBar {
    animeTitle: string,
    episodeNumber: number,
    episodesList: Record<string,string>[],
    mal: string,
    type: string,
    setEpisodeNumber: (newEpisodeNumber: number) => void
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

const episodeNameVariants = {
    hidden: {
        translateY: -20,
        opacity: 0
    },
    visible: {
        translateY: 0,
        opacity: 1,
        transition: {
            delay: 0.5
        }
    },
}

const WatchTopBar = ({ setEpisodeNumber, mal, type, episodesList, episodeNumber, animeTitle }: IWatchTopBar) => {

    const [ ascending, updateEpisodesOrder ] = useState<boolean>(true)
    const [ episodeTitle, updateEpisodeTitle ] = useState<string>("")
    const [ episodeName, updateEpisodeName ] = useState<string>("")
    const titleFetchController = useRef<AbortController>()
    const episodesPopupTrigger = useRef()

    useEffect(() => {
        if (episodeName && animeTitle) {
            document.title = `${ animeTitle } - ${episodeName}`
        }
    }, [])

    useEffect(() => {
        const episode = episodesList[episodeNumber - 1]
        // Update episodeName
        if (type == "Movie") {
            updateEpisodeName("الفلم")
        } else {
            updateEpisodeName(`الحلقة ${episode.Episode}${episode.ExtraEpisodes ? `-${episode.ExtraEpisodes}` : ""}`)
        }

        /**
         * Update episodeTitle when currentEpisode changes
         * Data is fetched from MyAnimeList via Jikan API
         * */
        const titleController = new AbortController()
        titleFetchController.current = titleController
        fetch("https://api.jikan.moe/v3/anime/" + mal + "/episodes/" + Math.ceil(parseInt(episode.Episode) / 100), { signal: titleController.signal })
            .then(res => res.json())
            .then(data => {
                try {
                    let epData = data.episodes.find((ep: Record<string,any>) => ep.episode_id == parseInt(episode.Episode))
                    updateEpisodeTitle(epData.title)
                } catch (err) { } // Fail silently
            })
            .catch(err => console.error(err))
        return () => {
            titleFetchController.current.abort()
            updateEpisodeTitle("")
        }
    }, [episodeNumber])

    const reverseList = () => {
        updateEpisodesOrder(!ascending)
    }

    return (
        <div className="top-bar">
            <div className="top-bar-text">
                { animeTitle ? <h1 className="top-bar-anime-title">{ animeTitle }</h1> : <div className="anime-title-placeholder loading"></div>}
                { episodeName ? <motion.p variants={ episodeNameVariants } animate="visible" initial="hidden" className="top-bar-episode-name"><span className="episode-name">{ episodeName }{ getEpisodeTags(episodesList[episodeNumber - 1]) }</span>{ episodeTitle.length ? <><span style={{ marginTop: 2 }} className="mdi mdi-nm mdi-circle-medium"></span><span title="عنوان الحلقة" dir="ltr" className="episode-title">{ episodeTitle }</span></> : null }</motion.p> : <div className="episode-name-placeholder loading"></div> }
            </div>
            { episodesList.length > 1 ?
            <motion.div ref={ episodesPopupTrigger } initial={{ scale: 0 }} animate={{ scale: 1.0 }} transition={{ delay: 0.5 }} id="episodes-button" className="floating-button"><span className="mdi mdi-cards-variant"></span>
            الحلقات
            </motion.div> : null }
            { episodesList.length > 1 ?
                <Popup id="episodes-popup" dismissOnRouterEvent={ true } trigger={ episodesPopupTrigger } title="الحلقات">
                    { ascending ? <>
                        <div onClick={ () => reverseList() } style={{ display: "inline" }} className="dark-button episodes-popup-order">
                            <span className="mdi mdi-sort-ascending"></span>تصاعدي
                        </div>
                        <div id="episodes-list" className="popup-list">
                            { episodesList.map((episode,index) => {
                                return <div key={ index } onClick={ () => setEpisodeNumber(index + 1) } className="episode-link">{ `الحلقة ${episode.Episode}${episode.ExtraEpisodes.length ? `-${episode.ExtraEpisodes}` : ""}` }{ getEpisodeTags(episode) }</div>
                            })}
                        </div>
                        </>
                    : <>
                        <div onClick={ () => reverseList() } style={{ display: "inline" }} className="dark-button episodes-popup-order">
                            <span className="mdi mdi-sort-descending"></span>تنازلي
                        </div>
                        <div id="episodes-list" className="popup-list">
                            { episodesList.map((episode,index) => {
                                return <div key={ index } onClick={ () => setEpisodeNumber(index + 1) } className="episode-link">{ `الحلقة ${episode.Episode}${episode.ExtraEpisodes.length ? `-${episode.ExtraEpisodes}` : ""}` }{ getEpisodeTags(episode) }</div>
                            }).reverse()}
                        </div>
                        </>
                    }
                </Popup> : null }
        </div>
    )
}

export default React.memo(WatchTopBar)