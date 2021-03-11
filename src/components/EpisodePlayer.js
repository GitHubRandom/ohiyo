import { useEffect, useState } from "react"
import Episode from "./Episode"
import VideoPlayer from './VideoPlayer'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'

// Possible API key from tune.pk : 777750fea4d3bd585bf47dc1873619fc

const supportedServers = [ "OU", "MF", "UP" ]

const EpisodePlayer = ({ relatedContent, setEpisodeName, animeId, episodeNumber }) => {

    const [ episodesList, updateList ] = useState([])
    const [ episodeSources, updateSources ] = useState({})
    const [ currentSource, updateCurrent ] = useState([])
    const [ introInterval, updateIntroInterval ] = useState([])

    function getServers(sources) {
        // Remove backslashes in sources list
        var s = sources.replace(/\\/g, "").slice(2,-2).split("\",\"")
        var currentUpdated = false
        s.forEach((item) => {
            var headers = { 'User-Agent': navigator.userAgent }
            var method = 'GET'
            if (item.includes("tune.pk")) {
                var sliced = item.slice(item.indexOf("video/") + 6)
                item = "https://embed.tune.pk/play/" + sliced.substring(0, sliced.indexOf("/"))
                updateSources(oldEpisodeSources => ({
                    ...oldEpisodeSources,
                    TP: item
                }))
                return
            }
            if (item.includes("vidlox")) {
                updateSources(oldEpisodeSources => ({
                    ...oldEpisodeSources,
                    VL: item
                }))
                return
            }
            if (item.includes("fembed")) {
                item = item.replace("api/source", "v")
                updateSources(oldEpisodeSources => ({
                    ...oldEpisodeSources,
                    FD: item
                }))
                return
            }
            if (item.includes("mixdrop")) {
                updateSources(oldEpisodeSources => ({
                    ...oldEpisodeSources,
                    MP: item
                }))
                return
            }
            if (item.includes("jawcloud")) {
                updateSources(oldEpisodeSources => ({
                    ...oldEpisodeSources,
                    JC: item
                }))
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
                if (item.includes("ok.ru") || item.includes("uptostream") || item.includes("tune.pk")) {
                    return response.json()
                } else {
                    return response.text()
                }
            })
            .then((data) => {
                var ds = decodeServers(item,data)
                if (ds.length !== 0 && ds !== [undefined,undefined]) {
                    if (!currentUpdated) {
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
        fetch('https://cors.bridged.cc/https://anslayer.com/anime/public/episodes/get-episodes?json=%7B"more_info":"Yes","anime_id":' + animeId + '%7D', {headers: new Headers({
            "Client-Id": process.env.REACT_APP_CLIENT_ID,
            "Client-Secret": process.env.REACT_APP_CLIENT_SECRET
        })})
        .then((response) => { return response.json() })
        .then((data) => {
            updateList(data["response"]["data"])
            var episode = data["response"]["data"][episodeNumber - 1]
            setEpisodeName(episode["episode_name"])
            updateIntroInterval([episode["skip_from"], episode["skip_to"]])
            fetch("https://cors.bridged.cc/" + encodeURI(episode["episode_urls"][1]["episode_url"]))
            .then((response) => { 
                response.text().then((sources) => {
                    getServers(sources)
                })
            })
        })
    }, [])

    useEffect(() => {
        tippy("[data-tippy-content]")
    })

    return (
        <section className="anime-watch">
            { supportedServers.includes(currentSource[0]) ? 
            <VideoPlayer 
                title = { currentSource.length != 0 ? episodesList[episodeNumber - 1]["episode_name"] : "" }
                introInterval = { introInterval }
                sources = {{ 
                    type: 'video',
                    sources: currentSource != [] ? currentSource[1] : {}
                }}
                episodesList = { episodesList } 
                animeId = { animeId } 
                episodeNumber = { episodeNumber } />
            : <div className="anime-video-player"><iframe allowFullScreen={ true } className = "plyr--video" src = { currentSource[1] } /></div> }
                
            <div className="player-settings">
                <a id="previous" {... episodeNumber > 1 && episodesList.length != 0 ? { 
                    href: "/" + animeId + "/" + (parseInt(episodeNumber) - 1).toString(),
                    className: "player-episode-skip"
                } : {
                    className: "player-episode-skip disabled"
                } } ><span className="mdi mdi-chevron-right"></span>الحلقة السابقة</a>
                <div className="server-settings">
                    { Object.keys(episodeSources).length != 0 ? 
                        <>
                        <div id="supported" className="servers-category">
                            {
                                Object.keys(episodeSources).map((key) => {
                                    if (supportedServers.includes(key)) {
                                        return <div key={ key } id={ key } onClick={() => updateCurrent([ key, episodeSources[key] ]) } className={ currentSource[0] == key ? "server selected" : "server" }><span className="mdi mdi-play"></span>{ key }</div>
                                    } return
                                })
                            }
                        </div>
                        <div id="external" className="servers-category">
                            {
                                Object.keys(episodeSources).map((key) => {
                                    if (!supportedServers.includes(key)) {
                                        return <div key={ key } data-tippy-content="هذا الخادم لا يدعم المشغل السريع" id={ key } onClick={() => updateCurrent([ key, episodeSources[key] ]) } className={ currentSource[0] == key ? "server selected" : "server" }><span className="mdi mdi-server"></span>{ key }</div>
                                    } return
                                })
                            }
                        </div>
                        </>
                        : <span className="servers-loading-message"><span className="mdi mdi-loading mdi-spin"></span>جاري العمل على الخوادم</span> }
                </div>
                <a id="next" {... episodeNumber < episodesList.length ? { 
                    href: "/" + animeId + "/" + (parseInt(episodeNumber) + 1).toString(),
                    className: "player-episode-skip"
                } : {
                    className: "player-episode-skip disabled"
                }}>الحلقة القادمة<span className="mdi mdi-left mdi-chevron-left"></span></a>
            </div>
            { relatedContent ?
            <div className="related-content">
                <h2>ذات صلة</h2>
                <div className="content-list">
                    { relatedContent.slice(0,5).map((content) => {
                        return <Episode key={ content["anime_id"] } showEpisodeName={ false }
                                    animeName = {content["anime_name"]}
                                    url = {'/' + content["anime_id"] + '/1'}
                                    cover = {content["anime_cover_image_url"]} />
                    }) }
                </div>
            </div> : null }
        </section>
    )

    function decodeServers(s,data) {
        if (s.includes("uptostream")) {
            console.log(data)
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