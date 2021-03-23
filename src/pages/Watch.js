import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import AnimeDetails from "../components/AnimeDetails"
import EpisodePlayer from "../components/EpisodePlayer"
import WatchTopBar from "../components/WatchTopBar"
import tippy from 'tippy.js'
import RelatedContent from "../components/RelatedContent"

const ANIME_DETAILS_URL = "https://cors.bridged.cc/https://anslayer.com/anime/public/anime/get-anime-details?anime_id={id}&fetch_episodes=No&more_info=Yes"
const CLIENT_ID = "web-app"
const CLIENT_SECRET = "90b63e11b9b4634f124df024516id495ab749c6b"

const Watch = ({ fromEpisode }) => {
    const { aId, eNum } = useParams()
    const [ episode, updateEpisode ] = useState({})
    const [ animeTitle, updateTitle ] = useState("")
    const [ episodeName, updateName ] = useState("")
    const [ episodesList, updateList ] = useState([])
    const [ relatedContent, updateRelated ] = useState([])

    useEffect(() => {
        window.scrollTo(0,0)
        tippy("[data-tippy-content]")    
    })
    
    useEffect(() => {
        if (fromEpisode) {
            var params = {
                more_info: "Yes",
                anime_id: aId,
                episode_id: fromEpisode
            }
            fetch(encodeURI(`https://cors.bridged.cc/https://anslayer.com/anime/public/episodes/get-episodes?json=${JSON.stringify(params)}`), {
                headers: new Headers({
                    "Client-Id": process.env.REACT_APP_CLIENT_ID,
                    "Client-Secret": process.env.REACT_APP_CLIENT_SECRET
                })
            })
            .then((response) => { return response.json() })
            .then((data) => {
                console.log(data)
                if (data && data["response"] && data["response"]["data"]) {
                    var response = data["response"]["data"]
                    var episode = response[0]
                    updateEpisode(episode)
                    window.history.replaceState(null, "", window.location.protocol + "//" + window.location.host + "/" + aId + "/" + episode["episode_number"])
                }
            })
        }
        const controller = new AbortController()
        const signal = controller.signal        
        fetch('https://cors.bridged.cc/https://anslayer.com/anime/public/episodes/get-episodes?json=%7B"more_info":"Yes","anime_id":' + aId + '%7D', {headers: new Headers({
            "Client-Id": process.env.REACT_APP_CLIENT_ID,
            "Client-Secret": process.env.REACT_APP_CLIENT_SECRET
        }), signal: signal})
        .then((response) => { return response.json() })
        .then((data) => {
            updateList(data["response"]["data"])
        })
        return () => {
            try { controller.abort() } catch (error) {}
            updateTitle("")
            updateName("")
            updateRelated([])
            updateList([])
        }
    }, [aId])

    return (
        <div className="watch-page">
            <WatchTopBar showEpisodeButton={ episodesList.length > 1 } episodeName={ episodeName } animeTitle={ animeTitle } />
            <EpisodePlayer fromEpisodeId={ fromEpisode ? true : false } episode={ episode } episodesList={ episodesList } setEpisodeName={ (episodeName) => updateName(episodeName) } animeId={ aId } episodeNumber={ eNum ? eNum : episode["episode_number"] } />
            <AnimeDetails episodeNumber={ eNum } episodesList={ episodesList } setRelated={ (related) => updateRelated(related) } setTitle={ (animeTitle) => updateTitle(animeTitle) } animeId={ aId } />
            <RelatedContent related={ relatedContent } />
        </div>
    )
}

export default Watch