import React, { useEffect, useRef, useState } from "react"
import VideoPlayer from './VideoPlayer'
import axios, { AxiosResponse, Method } from "axios"
import { decodeHTML, decodeJSON } from '../utils/ServerDecoder'
import Popup from "./Popup"
import SourceSelector from "./SourceSelector"
import { serverKeys, nativeServers, supportedServers, shouldDecodeJSON, getFetchMethod, getFormattedEndpoint, getQualityLabel, quality } from '../utils/Servers'
import VideoPlyr from "./VideoPlyr"

interface TEpisodePlayer {
    episode: Record<string,any>,
    episodeDetails: Record<string,any>,
    introInterval: [number, number],
    changeEpisodeNumber: (increment: boolean) => void,
    firstEpisode: boolean,
    lastEpisode: boolean,
    openingsInfo?: string[]
}

const EpisodePlayer = ({ episode, episodeDetails, introInterval, changeEpisodeNumber, firstEpisode, lastEpisode, openingsInfo }: TEpisodePlayer) => {

    const [ openingTheme, updateOpening ] = useState<string>("")
    const [ openingLifeSpan, updateOpeningLifeSpan ] = useState<[number,number]>([NaN,NaN])
    const [ episodeSources, updateSources ] = useState<Record<string, quality | string>>({})
    const [ currentSource, updateCurrent ] = useState<string>("")
    const [ switchCooldown, updateSwitchCooldown ] = useState<boolean>(true)
    const [ status, updateStatus ] = useState<string[]>([])
    const tokens = useRef([])
    const downloadListTrigger = useRef()

    /**
     * This sets the status of fetching for the episode source URLs
     * @param status status of fetching (pending | failed | parsed)
     * @param index index of updated element
     */
    const setStatus = (status: string, index: number): void => {
        updateStatus(oldStatus => {
            oldStatus.splice(index, 1, status)
            return [...oldStatus]
        })
    }

    /**
     * Cancels all fetch operations
     */
    const cancelFetches = () => {
        tokens.current.forEach(token => {
            token.cancel()
        })
    }

    /**
     * This function splits the different sources and decodes them
     * @param sources An object of available sources
     */
    const getServers = (sources: Record<string, string>): void => {
        const sourcesKeys = Object.keys(sources)
        updateStatus(Array(sourcesKeys.length).fill("pending"))
        tokens.current = Array(sourcesKeys.length).fill(axios.CancelToken.source())
        updateSwitchCooldown(true)
        const setUnsupportedServer = (server: string, result: string, index: number) => {
            updateSources(oldEpisodeSources => ({
                ...oldEpisodeSources,
                [server]: result
            }))
            setStatus("parsed", index)
        }

        sourcesKeys.forEach((key, index) => {
            const item = sources[key].replace("http://", "https://") // Force HTTPS
            const serverKey = key.substr(0,2) // Slice key to get server
            if (!supportedServers.includes(serverKey)) {
                setStatus('failed', index)
                return // Cancel if server is not supported
            }
            const useJSON = shouldDecodeJSON(serverKey)
            const formattedEndpoint = getFormattedEndpoint(serverKey, item)
            if (!nativeServers.includes(serverKey)) {
                // Use iframe instead of DPlayer
                setUnsupportedServer(key, formattedEndpoint, index)
                return
            }
            axios({
                url: formattedEndpoint,
                method: getFetchMethod(serverKey),
                headers: { 'User-Agent': navigator.userAgent },
                cancelToken: tokens.current[index].token
            })
            .then(response => {
                const data = response.data
                const ds = useJSON ? decodeJSON(key, data) : decodeHTML(key, data, key.substr(-3,3))
                if (ds[0].length && ds[1].length) {
                    updateSources(oldEpisodeSources => {
                        const oldLinks = oldEpisodeSources[ds[0]]
                        if (oldLinks) {
                            return {
                                ...oldEpisodeSources,
                                [ds[0]]: (oldEpisodeSources[ds[0]] as quality).concat(ds[1])
                            }
                        } else {
                            return {
                                ...oldEpisodeSources,
                                [ds[0]]: ds[1]
                            }
                        }
                    })
                    setStatus("parsed", index)
                } else {
                    setStatus("failed", index)
                }
            })
            .catch(_ => {
                setStatus('failed', index)
            })
        })
    }

    useEffect(() => {
        if (Object.keys(episodeSources) && !status.includes('pending')) {
            let selected = Object.keys(episodeSources)[0]
            for (var key in episodeSources) {
                if (key == "FR" ||
                ( key == "OU" && selected != "FR" ) ||
                ( key == "FD" && selected != "FR" )) {
                    selected = key
                    if (key == "FR") break
                }
            }
            updateCurrent(selected)
        }
    }, [status])

    useEffect(() => {
        let sources: Record<string, string> = {}
        Object.keys(episode).map(key => {
            if (episode[key].length > 0 && (key.endsWith("LowQ") || key.endsWith("Link") || key.endsWith("hdQ"))) {
                sources[key] = episode[key]
            }
        })
        getServers(sources)
        return () => {
            cancelFetches()
            updateSources({})
            updateCurrent("")    
        }
    }, [episode])

    useEffect(() => {
        /**
         * Process opening themes data
         * Openings are (generally) listed as :
         *     "#01: <opening_title> (eps 1-10)"
         *     "#02: <opening_title> (eps 11-99)"
         */
        const episodeNameNumber = parseInt(episode.Episode)
        if (openingsInfo && !((episodeNameNumber <= openingLifeSpan[1] || isNaN(openingLifeSpan[1]) && episodeNameNumber >= openingLifeSpan[0])) ) {
            if (openingsInfo.length > 1) {
                var theOpening = openingsInfo.find(opening => {
                    // Detect intro valid episodes' interval
                    const episodesInterval = opening.match(/\(eps\s(.+?)\)/)
                    if (episodesInterval) {
                        const episodesIntervalLimits = episodesInterval[1].split('-')
                        // Update lifespan where current opening will still be valid
                        updateOpeningLifeSpan([parseInt(episodesIntervalLimits[0]), parseInt(episodesIntervalLimits[1])])
                        return (episodeNameNumber <= parseInt(episodesIntervalLimits[1]) || isNaN(parseInt(episodesIntervalLimits[1]))) && episodeNameNumber >= parseInt(episodesIntervalLimits[0])
                    }
                })
            } else if (openingsInfo.length) {
                // If list contains only one opening, select it as the valid opening
                var theOpening = openingsInfo[0]
            }
            theOpening !== undefined ? updateOpening(theOpening.replace(/#\d{1,4}: /, "").replace(/\(eps\s(.+?)\)/, "")) : updateOpening("")
        }
    }, [episode, openingsInfo])

    return (
        <section className="anime-watch">
            { currentSource && nativeServers.includes(currentSource.slice(0, 2)) && !status.includes("pending") ?
                <VideoPlayer
                    openingName={ openingTheme }
                    introInterval={ introInterval }
                    sources={ currentSource != "" ? (episodeSources[currentSource] as Record<string, string>[]).sort((a, b) => parseInt(b.name.slice(0, -1)) - parseInt(a.name.slice(0, -1))) : [] }
                    episode={ episode }
                    episodeDetails={ episodeDetails } />
                :
                <div className={ Object.keys(episodeSources).length && !status.includes("pending") ? "iframe-video-player" : "iframe-video-player loading" }>
                    { !status.includes("pending") &&
                        <iframe allowFullScreen={ true } className="iframe-video" src={ episodeSources[currentSource] as string } />
                    }
                </div>
            }
            <div className="player-settings">
                { !firstEpisode && switchCooldown ?
                    <div onClick={ () => { updateSwitchCooldown(false); changeEpisodeNumber(false) } } id="previous" className="player-episode-skip">
                            <span className="mdi mdi-chevron-right"></span>
                            الحلقة السابقة
                    </div>
                    :
                    <a id="previous" className="player-episode-skip disabled"><span className="mdi mdi-chevron-right"></span>الحلقة السابقة</a>
                }
                <div className="server-settings">
                    { Object.keys(episodeSources).length && !status.includes("pending") ?
                        <>
                            <span ref={ downloadListTrigger } id="download-button" className="mdi mdi-download mdi-nm"></span>
                            { currentSource ?
                                <SourceSelector 
                                    value={ currentSource }
                                    sources={ episodeSources }
                                    onSelectSource={ sourceKey => updateCurrent(sourceKey) } />
                            : null }
                        </>
                        : <div className="servers-loading-message">
                            <div className="spinner"></div>
                            <span>جاري العمل على الخوادم</span>
                        </div>
                    }
                </div>
                { !lastEpisode && switchCooldown ?
                    <div onClick={ () => { updateSwitchCooldown(false); changeEpisodeNumber(true) } } id="next" className="player-episode-skip"> 
                            الحلقة القادمة
                            <span className="mdi mdi-chevron-left mdi-left"></span>
                    </div>
                    :
                    <a id="next" className="player-episode-skip disabled">الحلقة القادمة<span className="mdi mdi-chevron-left mdi-left"></span></a>
                }
            </div>
            { !status.includes("pending") &&
                <Popup id="download-popup" trigger={ downloadListTrigger } title="تحميل">
                    <div id="downloads-list" className="popup-list">
                        {Object.keys(episodeSources).map((sourceKey, index) => {
                            if (nativeServers.includes(sourceKey.slice(0,2))) {
                                return (
                                    <div key={ index } id={sourceKey} className="download-section">
                                        <h2>{serverKeys[sourceKey.slice(0,2)]}</h2>
                                        {(episodeSources[sourceKey] as quality).map((source, index) => {
                                            return (
                                                <div key={ index } id={ source.name } className="download-link">
                                                    <p className="download-link-quality">{ source.name }</p>
                                                    <a className="link" href={ source.url }>تحميل</a>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )
                            }
                        })}
                    </div>
                </Popup> }
        </section>
    )
}
export default React.memo(EpisodePlayer)