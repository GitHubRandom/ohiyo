import { useEffect, useState } from "react"
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
    const [ relatedContent, updateRelated ] = useState([])

    return (
        <div className="watch-page">
            <WatchTopBar episodeName={ episodeName } animeTitle={ animeTitle } />
            <EpisodePlayer setEpisodeName={ (episodeName) => updateName(episodeName) } animeId={ aId } episodeNumber={ eNum } />
            <AnimeDetails setRelated={ (related) => updateRelated(related) } setTitle={ (animeTitle) => updateTitle(animeTitle) } animeId={ aId } />
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
        </div>
    )
}

export default Watch