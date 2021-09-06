import React, { useEffect, useRef } from "react"
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from "react"
import Head from 'next/head'
import Popup from "./Popup"

interface IWatchTopBar {
    animeTitle: string,
    episodeNumber: number,
    episodesList: Record<string,string>[],
    episodeDetails: Record<string,any>,
    type: string,
    altTitle: string
    setEpisodeNumber: (newEpisodeNumber: number) => void
}

export const getEpisodeTags = (episode: Record<string,any>, episodeDetails?: Record<string,any>) => {
    let tags = []
    if (episode.IsSpecial == "1") {
        tags.push(<span key="special" id="special" className="episode-tag">خاصة</span>)
    } else if ((episodeDetails && episodeDetails.filler) || episode.IsFlr == "1") {
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

const WatchTopBar = ({ setEpisodeNumber, episodeDetails, type, episodesList, episodeNumber, animeTitle, altTitle }: IWatchTopBar) => {

    const [ ascending, updateEpisodesOrder ] = useState<boolean>(true)
    const [ episodeName, updateEpisodeName ] = useState<string>("")
    const [ episodeSearch, updateEpisodeSearch ] = useState<string>("")
    const episodeSearchInput = useRef<HTMLInputElement>()
    const episodesPopupTrigger = useRef()

    useEffect(() => {
        const episode = episodesList[episodeNumber - 1]
        // Update episodeName
        if (type == "MOVIE" || type == "Movie") {
            updateEpisodeName("الفلم")
        } else {
            updateEpisodeName(`الحلقة ${episode.Episode}${episode.ExtraEpisodes ? `-${episode.ExtraEpisodes}` : ""}`)
        }
        return () => {
            updateEpisodeName("")
        }
    }, [episodeNumber])

    const reverseList = () => {
        updateEpisodesOrder(!ascending)
    }

    return (
        <>
            <Head>
                <title>{ animeTitle + (episodeName.length ? " - " + episodeName : "") }</title>
            </Head>
            <div className="top-bar">
                <div className="top-bar-text">
                    { animeTitle ? <h1 className="top-bar-anime-title" title={ altTitle || "" }>{ animeTitle }</h1> : <div className="anime-title-placeholder loading"></div>}
                    { episodeName ?
                        <motion.p
                            variants={ episodeNameVariants }
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className="top-bar-episode-name">
                                <span className="episode-name">
                                    { episodeName }{ getEpisodeTags(episodesList[episodeNumber - 1]) }
                                </span>
                                { episodeDetails && episodeDetails.title &&
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}>
                                            <span style={{ marginTop: 2 }} className="mdi mdi-nm mdi-circle-medium"></span>
                                            <span title="عنوان الحلقة" dir="ltr" className="episode-title">
                                                { episodeDetails.title }
                                            </span>
                                    </motion.span> }
                        </motion.p> 
                        : <div className="episode-name-placeholder loading"></div>
                    }
                </div>
                { episodesList.length > 1 &&
                    <motion.div ref={ episodesPopupTrigger } initial={{ scale: 0 }} animate={{ scale: 1.0 }} transition={{ delay: 0.5 }} id="episodes-button" className="floating-button">
                        <span className="mdi mdi-cards-variant"></span>
                        الحلقات
                    </motion.div>
                }
                { episodesList.length > 1 &&
                    <Popup
                        onShow={() => { if (episodeSearchInput.current) { episodeSearchInput.current.focus() } } }
                        onDismiss={ () => updateEpisodeSearch("") } 
                        id="episodes-popup"
                        dismissOnRouterEvent={ true }
                        trigger={ episodesPopupTrigger }
                        title="الحلقات">
                        <>
                            <div className="episode-popup-parameters">
                                <div onClick={ () => reverseList() } style={{ display: "inline" }} className="dark-button episodes-popup-order">
                                    { ascending ?
                                        <><span className="mdi mdi-sort-ascending"></span>تصاعدي</>
                                    :
                                        <><span className="mdi mdi-sort-descending"></span>تنازلي</>
                                    }
                                </div>
                                <input placeholder="البحث عن الحلقة" ref={ episodeSearchInput } onInput={ (e: React.ChangeEvent<HTMLInputElement>) => updateEpisodeSearch(e.target.value) } type="text" name="episode" className="episode-popup-search" />
                            </div>
                            <div id="episodes-list" className="popup-list">
                                { ascending ?
                                    episodesList.map((episode,index) => {
                                        return episode.Episode.includes(episodeSearch) || ( episode.ExtraEpisodes && episode.ExtraEpisodes.includes(episodeSearch) ) ?
                                                    <div key={ index } onClick={ () => setEpisodeNumber(index + 1) } className="episode-link">{ `الحلقة ${episode.Episode}${episode.ExtraEpisodes.length ? `-${episode.ExtraEpisodes}` : ""}` }{ getEpisodeTags(episode) }</div>
                                                : <React.Fragment key={ index }></React.Fragment>
                                    })
                                :
                                    episodesList.map((episode,index) => {
                                        return episode.Episode.includes(episodeSearch) || ( episode.ExtraEpisodes && episode.ExtraEpisodes.includes(episodeSearch) ) ?
                                                    <div key={ index } onClick={ () => setEpisodeNumber(index + 1) } className="episode-link">{ `الحلقة ${episode.Episode}${episode.ExtraEpisodes.length ? `-${episode.ExtraEpisodes}` : ""}` }{ getEpisodeTags(episode) }</div>
                                                    : <React.Fragment key={ index }></React.Fragment>
                                        }).reverse()
                                }
                            </div>
                        </>
                    </Popup>
                }
            </div>
        </>
    )
}

export default React.memo(WatchTopBar)