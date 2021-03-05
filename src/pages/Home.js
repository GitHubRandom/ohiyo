import { useEffect, useState } from "react"
import Episode from "../components/Episode"

const NEW_CONTENT_URL = "https://cors.bridged.cc/https://anslayer.com/anime/public/animes/get-published-animes?json=%7B%22_order_by%22%3A%22latest_first%22%2C%22list_type%22%3A%22latest_updated_episode_new%22%2C%22_limit%22%3A30%2C%22_offset%22%3A0%7D"
const CLIENT_ID = "web-app"
const CLIENT_SECRET = "90b63e11b9b4634f124df024516id495ab749c6b"

const Home = () => {
    const [ content, updateContent ] = useState([])

    useEffect(() => {
        fetch(NEW_CONTENT_URL, { headers: new Headers({
            "Client-Id": CLIENT_ID,
            "Client-Secret": CLIENT_SECRET,
        }) })
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            var content = data["response"]["data"]
            updateContent(content)
        })    
    }, [])

    return (
        <div className="home-page">
            <h2 className="section-title">حلقات جديدة</h2>
            <div className="content-list">
                {content != [] ? content.map((episode) => 
                    <Episode key = {episode["latest_episode_id"]}
                        showEpisodeName = { true }
                        animeName = {episode["anime_name"]}
                        url = {'/' + episode["anime_id"] + '/1'}
                        cover = {episode["anime_cover_image_url"]}
                        episodeName = {episode["latest_episode_name"]}
                    />) : <p>Loading...</p>}
            </div>
        </div>
    )
}

export default Home