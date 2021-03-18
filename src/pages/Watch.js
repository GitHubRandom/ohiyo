import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import AnimeDetails from "../components/AnimeDetails"
import EpisodePlayer from "../components/EpisodePlayer"
import WatchTopBar from "../components/WatchTopBar"
import Episode from "../components/Episode"

const ANIME_DETAILS_URL = "https://cors.bridged.cc/https://anslayer.com/anime/public/anime/get-anime-details?anime_id={id}&fetch_episodes=No&more_info=Yes"
const CLIENT_ID = "web-app"
const CLIENT_SECRET = "90b63e11b9b4634f124df024516id495ab749c6b"

const Watch = () => {
    const { aId, eNum } = useParams()
    const [ animeTitle, updateTitle ] = useState("")
    const [ episodeName, updateName ] = useState("")
    const [ episodesList, updateList ] = useState([])
    const [ relatedContent, updateRelated ] = useState([])

    useEffect(() => {
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
            <EpisodePlayer episodesList={ episodesList } setEpisodeName={ (episodeName) => updateName(episodeName) } animeId={ aId } episodeNumber={ eNum } />
            <AnimeDetails episodeNumber={ eNum } episodesList={ episodesList } setRelated={ (related) => updateRelated(related) } setTitle={ (animeTitle) => updateTitle(animeTitle) } animeId={ aId } />
            { relatedContent ?
            <div style={{ marginBottom: "55px" }} className="related-content">
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
        </div>
    )
}

export default Watch