import React, { useEffect, useRef, useState } from "react"
import VideoPlayer from './VideoPlayer'
import axios, { AxiosResponse, Method } from "axios"
import { decodeHTML, decodeJSON } from '../utils/ServerDecoder'
import Popup from "./Popup"

const nativeServers = ["OK", "FR", "SF", "FD"]

 // Native player servers + iframe servers
const supportedServers = nativeServers.concat(["MS", "MA", "GD"])

const serverKeys = {
    OK: "Ok.ru",
    FR: "Mediafire",
    MS: "MyStream",
    SF: "SolidFiles",
    FD: "Fembed",
    MA: "Mega",
    GD: "G.Drive"
}

const getFetchMethod = (serverKey: string): Method => {
    const postMethod = ["OK", "FD"]
    return postMethod.includes(serverKey) ? "POST" : "GET"
}

const getFormattedEndpoint = (serverKey:string, item: string): string => {
    const prefixes = {
        MA: "https://mega.nz/embed/",
        GD: "https://drive.google.com/file/d/",
        MS: "https://embed.mystream.to/",
        FD: "https://quiet-cove-27971.herokuapp.com/www.fembed.com/api/source/",
        FR: "https://quiet-cove-27971.herokuapp.com/www.mediafire.com/?",
        SF: "/api/cors?link=http://www.solidfiles.com/v/",
        OK: "https://cors.bridged.cc/https://ok.ru/dk?cmd=videoPlayerMetadata&mid="
    }
    const prefix = prefixes.hasOwnProperty(serverKey) ? prefixes[serverKey] : ""
    const suffix = serverKey == "GD" ? "/preview" : ""
    return prefix + item + suffix
}

const shouldDecodeJSON = (serverKey:string):boolean => serverKey == "OK" || serverKey == "FD"

interface TEpisodePlayer {
    episode: Record<string,any>,
    episodeTitle: string,
    introInterval: [number, number],
    changeEpisodeNumber: (increment: boolean) => void,
    firstEpisode: boolean,
    lastEpisode: boolean,
    openingsInfo?: string[]
}

const EpisodePlayer = ({ episode, episodeTitle, introInterval, changeEpisodeNumber, firstEpisode, lastEpisode, openingsInfo }: TEpisodePlayer) => {

    type quality = Record<string, string>[]

    const [ openingTheme, updateOpening ] = useState<string>("")
    const [ openingLifeSpan, updateOpeningLifeSpan ] = useState<[number,number]>([NaN,NaN])
    const [ episodeSources, updateSources ] = useState<Record<string, quality | string>>({})
    // const [ currentSource, updateCurrent ] = useState<[string, string | Record<string, string>[]]>(["", ""])
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

    const getBestQuality = (key: string) => {
        const sources = episodeSources[key]
        if (Array.isArray(sources)) {
            if ((sources as quality).some(src => src.name == "1080p")) {
                return " - Full HD"
            }
            if ((sources as quality).some(src => src.name == "720p")) {
                return " - HD"
            }
            if ((sources as quality).some(src => src.name == "480p")) {
                return " - SD"
            }
            return ""
        } else {
            if (key.endsWith("hdQ")) {
                return " - Full HD"
            }
            if (key.endsWith("Link")) {
                return ""
            }
            if (key.endsWith("LowQ")) {
                return " - SD"
            }
            return ""
        }
    }

    useEffect(() => {
        if (Object.keys(episodeSources) && !status.includes('pending')) {
            let selected = Object.keys(episodeSources)[0]
            for (var key in episodeSources) {
                if (key == "FRFhdQ" || key == "FRLink" || key == "SFLink" ||
                ( key.startsWith("OU") && selected != "FRLink" ) ||
                ( key.startsWith("FD") && selected != "FRLink" )) {
                    selected = key
                    if (key == "FRFhdQ") break
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
        let episodeNameNumber = parseInt(episode.Episode)
        if (openingsInfo && !((episodeNameNumber <= openingLifeSpan[1] || isNaN(openingLifeSpan[1]) && episodeNameNumber >= openingLifeSpan[0])) ) {
            if (openingsInfo.length > 1) {
                var theOpening = openingsInfo.find(opening => {
                    const episodesInterval = opening.match(/\(eps\s(.+?)\)/)
                    if (episodesInterval) {
                        const episodesIntervalLimits = episodesInterval[1].split('-')
                        updateOpeningLifeSpan([parseInt(episodesIntervalLimits[0]), parseInt(episodesIntervalLimits[1])])
                        return (episodeNameNumber <= parseInt(episodesIntervalLimits[1]) || isNaN(parseInt(episodesIntervalLimits[1]))) && episodeNameNumber >= parseInt(episodesIntervalLimits[0])
                    }
                })
            } else if (openingsInfo.length) {
                var theOpening = openingsInfo[0]
            }
            theOpening !== undefined ? updateOpening(theOpening.replace(/#\d{1,4}: /, "").replace(/\(eps\s(.+?)\)/, "")) : updateOpening("")
        }
        return () => {
            cancelFetches()
            updateSources({})
            updateCurrent("")    
        }
    }, [episode])

    return (
        <section className="anime-watch">
            { currentSource && nativeServers.includes(currentSource.slice(0, 2)) && !status.includes("pending") ?
                <VideoPlayer
                    openingName={ openingTheme }
                    introInterval={ introInterval }
                    sources={ currentSource != "" ? (episodeSources[currentSource] as Record<string, string>[]).sort((a, b) => parseInt(b.name.slice(0, -1)) - parseInt(a.name.slice(0, -1))) : [] }
                    episode={ episode }
                    episodeTitle={ episodeTitle }
                />
                :
                <div className={ Object.keys(episodeSources).length && !status.includes("pending") ? "iframe-video-player" : "iframe-video-player loading" }>
                    { !status.includes("pending") ?
                        <iframe allowFullScreen={ true } className="iframe-video" src={ episodeSources[currentSource] as string } />
                    : null}
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
                            <select name="server" className="selection" id="server-select" onChange={ e => updateCurrent(e.target.value) } value={ currentSource }>
                                { Object.keys(episodeSources).map(key => {
                                    return <option key={ key } value={ key } id={ key }>{nativeServers.includes(key.slice(0, 2)) ? "م. المحلي" : "م. خارجي"}{` - ${serverKeys[key.slice(0, 2)]}${getBestQuality(key)}`}</option>
                                })}
                            </select></>
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
            { !status.includes("pending") ?
            <Popup id="download-popup" trigger={ downloadListTrigger } title="تحميل">
                <div id="downloads-list" className="popup-list">
                    {Object.keys(episodeSources).map(sourceKey => {
                        if (nativeServers.includes(sourceKey.slice(0,2))) {
                            return (
                                <div key={ sourceKey } id={sourceKey} className="download-section">
                                    <h2>{serverKeys[sourceKey.slice(0,2)]}</h2>
                                    {(episodeSources[sourceKey] as quality).map(source => {
                                        return (
                                            <div key={ sourceKey } id={ source.name } className="download-link">
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
            </Popup> : null }
        </section>
    )
}
export default React.memo(EpisodePlayer)