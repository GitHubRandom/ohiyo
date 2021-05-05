import { useEffect, useMemo, useState } from "react"
import VideoPlayer from './VideoPlayer'
import Link from 'next/link'

const supportedServers = [ "OK", "FR", "SF" ]
const serverKeys = {
    OK: "Ok.ru",
    FR: "Mediafire",
    MS: "MyStream",
    SF: "SolidFiles",
    FD: "Fembed",
    MA: "Mega"
}
const qualitiesMap = {
    hdQ: "1080",
    owQ: "480",
    ink: "720"
}

interface TEpisodePlayer {
    episodesList: Record<string,any>[],
    animeId: string,
    episodeNumber: number,
    mal: string,
    setEpisodeTitle: (title:string) => void
}

const EpisodePlayer = ({ setEpisodeTitle, episodesList, animeId, episodeNumber, mal }: TEpisodePlayer) => {

    type quality = Record<string,string>[]

    const [ episodeSources, updateSources ] = useState<Record<string,quality | string>>({})
    const [ currentSource, updateCurrent ] = useState<[string,string | Record<string,string>[]]>(["",""])
    const [ introInterval, updateIntroInterval ] = useState<[string,string]>(["",""])
    const [ status, updateStatus ] = useState<string[]>([])

    const videoPlyr = useMemo(() => {
        return <VideoPlayer 
                    introInterval = { introInterval }
                    sources = {{
                        type: 'video',
                        sources: currentSource[0] != "" ? currentSource[1] : {}
                    }} />
    }, [currentSource, introInterval])

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
    function getServers(sources: Record<string,string>) {
        // Remove backslashes in sources list
        let currentUpdated = false // A boolean to know if there is current server selected or not

        let sourcesKeys = Object.keys(sources)
        updateStatus(Array(sourcesKeys.length).fill("pending"))

        function setUnsupportedServer(server: string, result: string, index: number) {
            updateSources(oldEpisodeSources => ({
                ...oldEpisodeSources,
                [server]: result
            }))
            setStatus("parsed", index)
        }

        sourcesKeys.forEach(async (key,index) => {
            let item = sources[key]
            item = item.replace("http://", "https://")
            switch (true) {
                case key.startsWith("FD"):
                    setUnsupportedServer(key, "https://fembed.com/v/" + item, index); return
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
            let headers = { 'User-Agent': navigator.userAgent }
            let method = 'GET'
            switch (true) {
                case key.startsWith("FR"):
                    item = "https://quiet-cove-27971.herokuapp.com/www.mediafire.com/?" + item
                    break
                case key.startsWith("SF"):
                    item = "/api/mediafire?link=https://www.solidfiles.com/v/" + item
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
                if (isOk) {
                    return response.json()
                } else {
                    return response.text()
                }
            })
            .then((data) => {
                let ds = isOk ? decodeServers(key,data) : decodeHTML(key,data,key.substr(-3,3))
                if (ds[0].length && ds[1].length) {
                    updateSources(oldEpisodeSources => {
                        const oldLinks = oldEpisodeSources[ds[0]]
                        if (oldLinks) {
                            return { ...oldEpisodeSources,
                                [ds[0]]: (oldEpisodeSources[ds[0]] as quality).concat(ds[1]) }
                        } else {
                            return { ...oldEpisodeSources,
                                [ds[0]]: ds[1] }
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

    const getBestQuality = (key:string) => {
        let sources = episodeSources[key]
        if (Array.isArray(sources)) {
            if ((sources as quality).some(src => src.size == "1080")) {
                return " - Full HD"
            }
            if ((sources as quality).some(src => src.size == "720")) {
                return " - HD"
            }
            if ((sources as quality).some(src => src.size == "480")) {
                return " - SD"
            }
            return ""
        } else {
            if (key.endsWith("hdQ")) {
                return " - Full HD"
            }
            if (key.endsWith("Link")) {
                return " - HD"
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
            updateCurrent([ key, episodeSources[key] ])
        }
    }, [status])

    useEffect(() => {
        let episode = episodesList[episodeNumber - 1]
        let sources: Record<string,string> = {}
        Object.keys(episode).map(key => {
            if (episode[key].length > 0 && (key.endsWith("LowQ") || key.endsWith("Link") || key.endsWith("hdQ"))) {
                sources[key] = episode[key]
            }
        })
        console.log("Changed sources !")
        getServers(sources)
        fetch("https://api.jikan.moe/v3/anime/" + mal + "/episodes/" + Math.ceil(parseInt(episode.Episode) / 100))
        .then(res => res.json())
        .then(data => {
            console.log(data.episodes)
            try {
                let epData = data.episodes[(parseInt(episode.Episode) - 1) % 100]
                setEpisodeTitle(epData.title)
                console.log(epData.title)
            } catch (err) {}
        })
        .catch(err => console.error(err)) 
        return () => {
            updateSources({})
            updateCurrent(["",""])
            setEpisodeTitle("")
        }
    }, [episodeNumber])

    return (
        <section className="anime-watch">
            { currentSource[0] && supportedServers.includes(currentSource[0].slice(0,2)) && !status.includes("pending") ? 
                videoPlyr
            : <div className={ Object.keys(episodeSources).length && !status.includes("pending") ? "iframe-video-player" : "iframe-video-player loading" }>
                { !status.includes("pending") ? <>
                    { currentSource[0] != "TP" ? // tune.pk requires a new code for embed player (very annoying)
                        <iframe allowFullScreen={ true } className="iframe-video" src={ currentSource[1] as string } />
                    : <><div className="open-stream-player" id={ `open-stream-player-${currentSource[1]}` }></div>
                        <script src={ `https://tune.pk/js/open/embed.js?vid=${currentSource[1]}` }></script></> }</>
                : null }
            </div> }
            <div className="player-settings">
                { episodeNumber > 1 && episodesList.length != 0 ? 
                    <Link scroll={ false } href={ "/watch/" + animeId + "-" + mal + "/" + (episodeNumber - 1).toString() }>
                        <a data-tippy-content={ episodesList[episodeNumber - 2]["episode_name"] } id="previous" className="player-episode-skip">
                            <span className="mdi mdi-chevron-right"></span>
                            الحلقة السابقة
                        </a>
                    </Link>
                    : 
                    <a id="previous" className="player-episode-skip disabled"><span className="mdi mdi-chevron-right"></span>الحلقة السابقة</a> 
                }
                <div className="server-settings">
                    { Object.keys(episodeSources).length && !status.includes("pending") ?
                        <select name="server" className="selection" id="server-select" onChange={ (e) => updateCurrent([ e.target.value, episodeSources[e.target.value] ]) } value={ currentSource[0] }>
                            {
                                Object.keys(episodeSources).map((key, index) => {
                                    return <option key={ key } value={ key } id={ key }>{ supportedServers.includes(key.slice(0,2)) ? "م. المحلي" : "م. خارجي"}{ ` - ${serverKeys[key.slice(0,2)]}${getBestQuality(key)}` }</option>
                                })
                            }
                        </select>
                        : <span className="servers-loading-message"><span className="mdi mdi-loading mdi-spin"></span>جاري العمل على الخوادم</span>
                    }
                </div>
                { episodeNumber < episodesList.length ? 
                    <Link scroll={ false } href={ "/watch/" + animeId + "-" + mal + "/" + (episodeNumber + 1).toString() }>
                        <a data-tippy-content={ episodesList[episodeNumber]["episode_name"] } id="next" className="player-episode-skip">
                            الحلقة القادمة
                            <span className="mdi mdi-chevron-left mdi-left"></span>
                        </a>
                    </Link>
                    : 
                    <a id="next" className="player-episode-skip disabled">الحلقة القادمة<span className="mdi mdi-chevron-left mdi-left"></span></a> 
                }
            </div>
        </section>
    )

    /**
     * This function decodes HTML to extract video sources
     * @param s Server URL (string)
     * @param data HTML response (string)
     * @returns An array with server code & object of different qualities URLs
     */
    function decodeHTML(key:string, data:string, qual:string): [string,Record<string,string>[]] {
        if (key.startsWith("FR")) {
            // Search for the download button href (yeah i know too simple)
            var regex = /href="(https?:\/\/download\d{1,6}\.mediafire\.com.*?\.mp4)"/
            var matches = data.match(regex)
            if (matches) {
                return ["FR", [{ src: "https://quiet-cove-27971.herokuapp.com/" + matches[1], size: qualitiesMap[qual] }]]
            }
        } else if (key.startsWith("SF")) {
            var regex = /"downloadUrl":"(.+solidfilesusercontent.com.+?)"/
            var matches = data.match(regex)
            if (matches) {
                return [key, [{ src: matches[1], size: "720" }]]
            }
        }
        return ["",[]]
    }

    /**
     * This function decodes JSON to extract video sources
     * @param s Server URL (string)
     * @param data Response of the request (JSON Object)
     * @returns An array with server code & object of different qualities URLs
     */
    function decodeServers(key:string, data:Record<string,any>): [string,Array<Record<string,string>>] {
        if (key.startsWith("OK")) {
            let q: Record<string,string> = { mobile: "144", lowest: "240", low: "360", sd: "480", hd: "720" }
            let qualities: Array<Record<string,string>> = []
            // Videos links are in "videos" array of the JSON response
            if ("videos" in data) {
                data["videos"].forEach((quality: Record<string,string>) => {
                    qualities.push({ src: quality["url"], size: q[quality["name"]] })
                })
                return [key, qualities]    
            }
            return ["",[]]
        }
        return ["",[]]
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
                P_A_C_K_E_R._starts_with(str.toLowerCase().replace(/ +/g, ''), 'eval((function(') ;
    },
    unpack: function (str: string) {
        var unpacked_source = '';
        if (P_A_C_K_E_R.detect(str)) {
            try {
                eval('unpacked_source = ' + str.substring(4) + ';')
                if (typeof unpacked_source == 'string' && unpacked_source) {
                    str = unpacked_source;
                }
            } catch (error) {}
        }
        return str;
    },
    _starts_with: function (str: string, what:string) {
        return str.substr(0, what.length) === what;
    }
}

export default EpisodePlayer