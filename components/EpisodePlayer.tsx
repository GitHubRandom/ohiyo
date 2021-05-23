import React, { useEffect, useMemo, useRef, useState } from "react"
import VideoPlayer from './VideoPlayer'
import Link from 'next/link'
import Popup from "./Popup"

const supportedServers = ["OK", "FR", "SF", "FD"]
const serverKeys = {
    OK: "Ok.ru",
    FR: "Mediafire",
    MS: "MyStream",
    SF: "SolidFiles",
    FD: "Fembed",
    MA: "Mega",
    GD: "G.Drive"
}
const qualitiesMap = {
    hdQ: "1080p",
    owQ: "480p",
    ink: "720p"
}

interface TEpisodePlayer {
    episodesList: Record<string, any>[],
    animeName: string,
    animeId: string,
    episodeNumber: number,
    mal: string,
    episodeName: string,
    setEpisodeTitle: (title: string) => void
}

const EpisodePlayer = ({ episodeName, setEpisodeTitle, animeName, episodesList, animeId, episodeNumber, mal }: TEpisodePlayer) => {

    type quality = Record<string, string>[]

    const [episodeSources, updateSources] = useState<Record<string, quality | string>>({})
    const [currentSource, updateCurrent] = useState<[string, string | Record<string, string>[]]>(["", ""])
    const [introInterval, updateIntroInterval] = useState<[number, number]>([0, 0])
    const [status, updateStatus] = useState<string[]>([])
    const [episodeTitle, updateTitle] = useState<string>("")
    const downloadListTrigger = useRef()

    /**
     * This sets the status of fetching for the episode source URLs
     * @param status status of fetching (pending | failed | parsed)
     * @param index index of updated element
     */
    function setStatus(status: string, index: number) {
        updateStatus(oldStatus => {
            oldStatus.splice(index, 1, status)
            return [...oldStatus]
        })
    }

    /**
     * This function splits the different sources and decodes them
     * @param sources An stringified array of the different sources (object)
     */
    function getServers(sources: Record<string, string>) {
        let sourcesKeys = Object.keys(sources)
        updateStatus(Array(sourcesKeys.length).fill("pending"))

        function setUnsupportedServer(server: string, result: string, index: number) {
            updateSources(oldEpisodeSources => ({
                ...oldEpisodeSources,
                [server]: result
            }))
            setStatus("parsed", index)
        }

        sourcesKeys.forEach(async (key, index) => {
            let item = sources[key]
            item = item.replace("http://", "https://")
            switch (true) {
                //case key.startsWith("FD"):
                    //setUnsupportedServer(key, "https://fembed.com/v/" + item, index); return
                case key.startsWith("MA"):
                    setUnsupportedServer(key, "https://mega.nz/embed/" + item, index); return
                case key.startsWith("MS"):
                    setUnsupportedServer(key, "https://embed.mystream.to/" + item, index); return
                case key.startsWith("GD"):
                    setUnsupportedServer(key, "https://drive.google.com/file/d/" + item + "/preview", index); return
                default:
                    break;
            }
            let isOk = key.startsWith("OK")
            let isFd = key.startsWith("FD")
            let headers = { 'User-Agent': navigator.userAgent }
            let method = 'GET'
            switch (true) {
                case isFd:
                    item = "https://quiet-cove-27971.herokuapp.com/www.fembed.com/api/source/" + item
                    method = 'POST'
                    break
                case key.startsWith("FR"):
                    item = "https://quiet-cove-27971.herokuapp.com/www.mediafire.com/?" + item
                    break
                case key.startsWith("SF"):
                    item = "/api/cors?link=https://www.solidfiles.com/v/" + item
                    break
                case isOk:
                    method = 'POST'
                    item = "https://cors.bridged.cc/https://ok.ru/dk?cmd=videoPlayerMetadata&mid=" + item
                    break
                default:
                    break
            }
            fetch(encodeURI(item), {
                method: method,
                headers: new Headers(headers)
            })
                .then((response) => {
                    if (isOk || isFd) {
                        return response.json()
                    } else {
                        return response.text()
                    }
                })
                .then((data) => {
                    let ds = isOk || isFd ? decodeServers(key, data) : decodeHTML(key, data, key.substr(-3, 3))
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
                }).catch(err => {
                    console.log(err)
                    setStatus("failed", index)
                })
        })
    }

    const getBestQuality = (key: string) => {
        let sources = episodeSources[key]
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
                if (key == "FR") {
                    selected = key
                    break
                } else if (key.startsWith("OU")) {
                    selected = key
                }
            }
            updateCurrent([selected, episodeSources[selected]])
        }
    }, [status])

    useEffect(() => {
        let episode = episodesList[episodeNumber - 1]
        let sources: Record<string, string> = {}
        Object.keys(episode).map(key => {
            if (episode[key].length > 0 && (key.endsWith("LowQ") || key.endsWith("Link") || key.endsWith("hdQ"))) {
                sources[key] = episode[key]
            }
        })
        getServers(sources)
        // Fetching episode title from MyAnimeList (via Jikan)
        fetch("https://api.jikan.moe/v3/anime/" + mal + "/episodes/" + Math.ceil(parseInt(episode.Episode) / 100))
            .then(res => res.json())
            .then(data => {
                try {
                    let epData = data.episodes[(parseInt(episode.Episode) - 1) % 100]
                    setEpisodeTitle(epData.title)
                    updateTitle(epData.title)
                } catch (err) { } // Fail silently
            })
            .catch(err => console.error(err))
        // Fetching intro timestamps
        fetch(encodeURI(`/api/skip?anime=${animeName}&num=${episodeNumber}&detail=${episode.Episode}`))
            .then(res => {
                if (res.ok) {
                    return res.json()
                } else {
                    throw new Error("Timestamps not found")
                }
            })
            .then(data => {
                updateIntroInterval([parseInt(data.skip_from) / 1000, parseInt(data.skip_to) / 1000])
            })
            .catch(err => {
                console.info("Timestamps not found !")
            })
        return () => {
            updateSources({})
            updateCurrent(["", ""])
            setEpisodeTitle("")
            updateTitle("")
        }
    }, [episodeNumber])

    return (
        <section className="anime-watch">
            { currentSource[0] && supportedServers.includes(currentSource[0].slice(0, 2)) && !status.includes("pending") ?
                <VideoPlayer
                    introInterval={introInterval}
                    sources={currentSource[0] != "" ? (currentSource[1] as Record<string, string>[]).sort((a, b) => parseInt(b.name.slice(0, -1)) - parseInt(a.name.slice(0, -1))) : []}
                />
                : <div className={Object.keys(episodeSources).length && !status.includes("pending") ? "iframe-video-player" : "iframe-video-player loading"}>
                    {!status.includes("pending") ?
                        <iframe allowFullScreen={true} className="iframe-video" src={currentSource[1] as string} />
                        : null}
                </div>}
            <div className="player-settings">
                {episodeNumber > 1 && episodesList.length != 0 ?
                    <Link scroll={false} href={"/watch/" + animeId + "-" + mal + "/" + (episodeNumber - 1).toString()}>
                        <a data-tippy-content={episodesList[episodeNumber - 2]["episode_name"]} id="previous" className="player-episode-skip">
                            <span className="mdi mdi-chevron-right"></span>
                            الحلقة السابقة
                        </a>
                    </Link>
                    :
                    <a id="previous" className="player-episode-skip disabled"><span className="mdi mdi-chevron-right"></span>الحلقة السابقة</a>
                }
                <div className="server-settings">
                    {Object.keys(episodeSources).length && !status.includes("pending") ?
                        <>
                            <span ref={ downloadListTrigger } id="download-button" className="mdi mdi-download mdi-nm"></span>
                            <select name="server" className="selection" id="server-select" onChange={(e) => updateCurrent([e.target.value, episodeSources[e.target.value]])} value={currentSource[0]}>
                                {
                                    Object.keys(episodeSources).map((key, index) => {
                                        return <option key={key} value={key} id={key}>{supportedServers.includes(key.slice(0, 2)) ? "م. المحلي" : "م. خارجي"}{` - ${serverKeys[key.slice(0, 2)]}${getBestQuality(key)}`}</option>
                                    })
                                }
                            </select></>
                        : <span className="servers-loading-message"><span className="mdi mdi-loading mdi-spin"></span>جاري العمل على الخوادم</span>
                    }
                </div>
                {episodeNumber < episodesList.length ?
                    <Link scroll={false} href={"/watch/" + animeId + "-" + mal + "/" + (episodeNumber + 1).toString()}>
                        <a data-tippy-content={episodesList[episodeNumber]["episode_name"]} id="next" className="player-episode-skip">
                            الحلقة القادمة
                            <span className="mdi mdi-chevron-left mdi-left"></span>
                        </a>
                    </Link>
                    :
                    <a id="next" className="player-episode-skip disabled">الحلقة القادمة<span className="mdi mdi-chevron-left mdi-left"></span></a>
                }
            </div>
            { !status.includes("pending") ?
            <Popup id="download-popup" trigger={ downloadListTrigger } title="تحميل">
                <div id="downloads-list" className="popup-list">
                    {Object.keys(episodeSources).map(sourceKey => {
                        if (supportedServers.includes(sourceKey.slice(0,2))) {
                            return (
                                <div key={ sourceKey } id={sourceKey} className="download-section">
                                    <h2>{serverKeys[sourceKey.slice(0,2)]}</h2>
                                    {(episodeSources[sourceKey] as quality).map(source => {
                                        return (
                                            <div key={ sourceKey } id={ source.name } className="download-link">
                                                <p className="download-link-quality">{ source.name }</p>
                                                <a className="link" href={ source.url } download={ animeName + "-" + episodeName + ".mp4" }>تحميل</a>
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

    /**
     * This function decodes HTML to extract video sources
     * @param s Server URL (string)
     * @param data HTML response (string)
     * @returns An array with server code & object of different qualities URLs
     */
    function decodeHTML(key: string, data: string, qual: string): [string, Record<string, string>[]] {
        if (key.startsWith("FR")) {
            // Search for the download button href (yeah i know too simple)
            var regex = /href="(https?:\/\/download\d{1,6}\.mediafire\.com.*?\.mp4)"/
            var matches = data.match(regex)
            if (matches) {
                return ["FR", [{ type: "normal", url: "https://quiet-cove-27971.herokuapp.com/" + matches[1], name: qualitiesMap[qual] }]]
            }
        } else if (key.startsWith("SF")) {
            var regex = /"downloadUrl":"(.+solidfilesusercontent.com.+?)"/
            var matches = data.match(regex)
            if (matches) {
                return [key, [{ type: "normal", url: matches[1], name: qualitiesMap[qual] }]]
            }
        }
        return ["", []]
    }

    /**
     * This function decodes JSON to extract video sources
     * @param s Server URL (string)
     * @param data Response of the request (JSON Object)
     * @returns An array with server code & object of different qualities URLs
     */
    function decodeServers(key: string, data: Record<string, any>): [string, Array<Record<string, string>>] {
        if (key.startsWith("OK")) {
            let q: Record<string, string> = { mobile: "144p", lowest: "240p", low: "360p", sd: "480p", hd: "720p" }
            let qualities: Array<Record<string, string>> = []
            // Videos links are in "videos" array of the JSON response
            if ("videos" in data) {
                data["videos"].forEach((quality: Record<string, string>) => {
                    if (quality["name"] in q) qualities.push({ type: "normal", url: quality.url, name: q[quality.name] })
                })
                return [key, qualities]
            }
            return ["", []]
        } else if (key.startsWith("FD")) {
            let qualities: Array<Record<string, string>> = []
            if ("data" in data) {
                data.data.forEach((quality: Record<string,string>) => {
                    qualities.push({ type: "normal", url: "https://quiet-cove-27971.herokuapp.com/" + quality.file, name: quality.label })
                })
                return [ key, qualities ]
            }
            return ["", []]
        }
        return ["", []]
    }

}

/**
 * This function extracts the video sources hidden in an obfuscated JS code (Uptostream for example)
 * @param source The code to be "evaled"
 * @returns The sources after evaluating the code
 */
function evalSources(source: string) {
    var sources = new Function(source + "return sources;")
    return sources()
}

/**
 * This is an object utility for p,a,c,k,e,d JS code
 */
var P_A_C_K_E_R = {
    detect: function (str: string) {
        return P_A_C_K_E_R._starts_with(str.toLowerCase().replace(/ +/g, ''), 'eval(function(') ||
            P_A_C_K_E_R._starts_with(str.toLowerCase().replace(/ +/g, ''), 'eval((function(');
    },
    unpack: function (str: string) {
        var unpacked_source = '';
        if (P_A_C_K_E_R.detect(str)) {
            try {
                eval('unpacked_source = ' + str.substring(4) + ';')
                if (typeof unpacked_source == 'string' && unpacked_source) {
                    str = unpacked_source;
                }
            } catch (error) { }
        }
        return str;
    },
    _starts_with: function (str: string, what: string) {
        return str.substr(0, what.length) === what;
    }
}

export default React.memo(EpisodePlayer)