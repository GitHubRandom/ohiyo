import { useEffect, useState } from "react"
import VideoPlayer from './VideoPlayer'
import { Link } from "react-router-dom/cjs/react-router-dom.min"

// Possible API key from tune.pk : 777750fea4d3bd585bf47dc1873619fc

const supportedServers = [ "OU", "MF", "UP" ]

const EpisodePlayer = ({ fromEpisodeId, episode, setEpisodeName, episodesList, animeId, episodeNumber }) => {

    const [ episodeSources, updateSources ] = useState({})
    const [ currentSource, updateCurrent ] = useState([])
    const [ introInterval, updateIntroInterval ] = useState([])
    const [ fetchStatus, updateStatus ] = useState([])

    function getServers(sources) {
        // Remove backslashes in sources list
        var s = sources.replace(/\\/g, "").slice(2,-2).split("\",\"")
        var currentUpdated = false
        s.forEach((item,index) => {
            var headers = { 'User-Agent': navigator.userAgent }
            var method = 'GET'
            item = item.replace("http://", "https://")
            if (item.includes("tune.pk")) {
                var sliced = item.slice(item.indexOf("video/") + 6)
                item = "https://embed.tune.pk/play/" + sliced.substring(0, sliced.indexOf("/"))
                updateSources(oldEpisodeSources => ({
                    ...oldEpisodeSources,
                    TP: item
                }))
                if (!currentUpdated) {
                    updateCurrent(["TP", item])
                    currentUpdated = true
                }
                return
            }
            if (item.includes("vidlox")) {
                updateSources(oldEpisodeSources => ({
                    ...oldEpisodeSources,
                    VL: item
                }))
                if (!currentUpdated) {
                    updateCurrent(["VL", item])
                    currentUpdated = true
                }
                return
            }
            if (item.includes("fembed")) {
                item = item.replace("api/source", "v")
                updateSources(oldEpisodeSources => ({
                    ...oldEpisodeSources,
                    FD: item
                }))
                if (!currentUpdated) {
                    updateCurrent(["FD", item])
                    currentUpdated = true
                }
                return
            }
            if (item.includes("mixdrop")) {
                updateSources(oldEpisodeSources => ({
                    ...oldEpisodeSources,
                    MP: item
                }))
                if (!currentUpdated) {
                    updateCurrent(["MP", item])
                    currentUpdated = true
                }
                return
            }
            if (item.includes("jawcloud")) {
                updateSources(oldEpisodeSources => ({
                    ...oldEpisodeSources,
                    JC: item
                }))
                if (!currentUpdated) {
                    updateCurrent(["JC", item])
                    currentUpdated = true
                }
                return
            }
            if (item.includes("ok.ru") || item.includes("fembed")) {
                method = 'POST'
            }
            if (item.includes("ok.ru")) {
                item = "https://ok.ru/dk?cmd=videoPlayerMetadata&mid=" + item.slice(item.indexOf("video") + 6)
            } else if (item.includes("uptostream")) {
                item = "https://uptostream.com/api/streaming/source/get?token=&file_code=" + item.slice(item.indexOf(".com/") + 5)
            }
            if (!item.includes("uptostream")) {
                item = "https://cors.bridged.cc/" + item
            }
            fetch(item, {
                method: method,
                headers: new Headers(headers),
            })
            .then((response) => {
                if (item.includes("ok.ru") || item.includes("uptostream")) {
                    return response.json()
                } else {
                    return response.text()
                }
            })
            .then((data) => {
                var ds = decodeServers(item,data)
                if (ds.length !== 0 && ds !== [undefined,undefined]) {
                    if (!currentUpdated || !supportedServers.includes(currentUpdated[0]) || ds[0] == "OU") {
                        updateCurrent(ds);
                        currentUpdated = true
                    }
                    updateSources(oldEpisodeSources => ({
                        ...oldEpisodeSources,
                        [ds[0]]: ds[1]
                    }))
                }
            })
        })
    }

    useEffect(() => {
        const controller = new AbortController()
        if (fromEpisodeId && Object.keys(episode).length) {
            var ep = episode
            setEpisodeName(ep["episode_name"])
            updateIntroInterval([ep["skip_from"], ep["skip_to"]])
            fetch("https://cors.bridged.cc/" + encodeURI(ep["episode_urls"][1]["episode_url"]), { signal: controller.signal })
            .then((response) => { 
                response.text().then((sources) => {
                    getServers(sources)
                })
            })    
        } else if (!fromEpisodeId && episodesList.length) {
            console.log(episodesList)
            var ep = episodesList[episodeNumber - 1]
            setEpisodeName(ep["episode_name"])
            updateIntroInterval([ep["skip_from"], ep["skip_to"]])
            fetch("https://cors.bridged.cc/" + encodeURI(ep["episode_urls"][1]["episode_url"]), { signal: controller.signal })
            .then((response) => { 
                response.text().then((sources) => {
                    getServers(sources)
                })
            })
        }
        return () => {
            if (controller) {
                try { controller.abort() } catch (error) {}
            }
            updateCurrent([])
            updateSources({})    
        }
    }, [episodeNumber,episodesList])

    return (
        <section className="anime-watch">
            { supportedServers.includes(currentSource[0]) ? 
            <VideoPlayer 
                introInterval = { introInterval }
                sources = {{ 
                    type: 'video',
                    sources: currentSource != [] ? currentSource[1] : {}
                }} />
            : <div className={ Object.keys(episodeSources).length ? "iframe-video-player" : "iframe-video-player loading" }><iframe allowFullScreen={ true } className="iframe-video" src={ currentSource[1] } /></div> }
                
            <div className="player-settings">
                { episodeNumber > 1 && episodesList.length != 0 ? 
                    <Link data-tippy-content={ episodesList[(parseInt(episodeNumber) - 2)]["episode_name"] } id="previous" to={ "/" + animeId + "/" + (parseInt(episodeNumber) - 1).toString() }
                        className="player-episode-skip"><span className="mdi mdi-chevron-right"></span>الحلقة السابقة</Link>
                    : 
                    <a id="previous" className="player-episode-skip disabled"><span className="mdi mdi-chevron-right"></span>الحلقة السابقة</a> 
                }
                <div className="server-settings">
                    { Object.keys(episodeSources).length != 0 ?
                        <select name="server" className="selection" id="server-select" onChange={ (e) => updateCurrent([ e.target.value, episodeSources[e.target.value] ]) } value={ currentSource[0] }>
                            {
                                Object.keys(episodeSources).map((key) => {
                                    return <option key={ key } value={ key } id={ key }>{ key }{ supportedServers.includes(key) ? " - المشغل السريع" : " - مشغل خارجي"}</option>
                                })
                            }
                        </select>
                        : <span className="servers-loading-message"><span className="mdi mdi-loading mdi-spin"></span>جاري العمل على الخوادم</span>
                    }
                </div>
                { episodeNumber < episodesList.length ? 
                    <Link data-tippy-content={ episodesList[parseInt(episodeNumber)]["episode_name"] } id="next" to={ "/" + animeId + "/" + (parseInt(episodeNumber) + 1).toString() }
                        className="player-episode-skip">الحلقة القادمة<span className="mdi mdi-chevron-left mdi-left"></span></Link>
                    : 
                    <a id="next" className="player-episode-skip disabled">الحلقة القادمة<span className="mdi mdi-chevron-left mdi-left"></span></a> 
                }
            </div>
        </section>
    )

    function decodeServers(s,data) {
        if (s.includes("uptostream")) {
            var source = data["data"]["sources"]
            source = source.replace("\\/=+$\\/", "/=+$/")
            source = source.split("window").join("this")
            var regexReturn = /return\n/g;
            source = source.replace(regexReturn, "return ");
            var sources = evalSources(source)
            return ["UP", sources.map((quality) => {
                return {
                    src: quality["src"],
                    size: quality["label"].slice(0,-1)   
                }
            })]    
        }
        if (s.includes("ok.ru")) {
            var q = { mobile: "144", lowest: "240", low: "360", sd: "480", hd: "720" }
            var qualities = []
            // Videos links are in "videos" array of the JSON response
            if ("videos" in data) {
                data["videos"].forEach((quality) => {
                    qualities.push({ src: quality["url"], size: q[quality["name"]] })
                })
                return ["OU", qualities]    
            }    
        }
        if (s.includes("mediafire")) {
            // Search for the download button href (yeah i know too simple)
            var regex = /href="(https?:\/\/download(?:\d{0,9}){4}\.mediafire\.com.*?\.mp4)/
            var matches = data.match(regex)
            if (matches) {
                return ["MF", [{ src: matches[1], size: "720" }]]
            }
        }
        return []
    }
    
}

/**
 * 
 * Fembed: Redirector are tricky
 * Mixdrop: 403 Forbidden due to Referer missing and IP lock
 * Jawcloud: 403 Forbidden IP lock
 */

function evalSources(source) {
    var sources = new Function(source + "return sources;")
    return sources()
}

// Code to decode packed JS code 
var P_A_C_K_E_R = {
    detect: function (str) {
        return P_A_C_K_E_R._starts_with(str.toLowerCase().replace(/ +/g, ''), 'eval(function(') ||
                P_A_C_K_E_R._starts_with(str.toLowerCase().replace(/ +/g, ''), 'eval((function(') ;
    },
    unpack: function (str) {
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
    _starts_with: function (str, what) {
        return str.substr(0, what.length) === what;
    }
}

export default EpisodePlayer