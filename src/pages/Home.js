import AnimeList from "../components/AnimeList"

const NEW_CONTENT_URL = "https://cors.bridged.cc/https://anslayer.com/anime/public/animes/get-published-animes?json=%7B%22_order_by%22%3A%22latest_first%22%2C%22list_type%22%3A%22latest_updated_episode_new%22%2C%22_limit%22%3A30%2C%22_offset%22%3A0%7D"

const Home = () => {
    return (
        <div className="home-page">
            <h2 className="section-title">حلقات جديدة</h2>
            <AnimeList className="content-list" showEpisodeName={ true } endpoint={ NEW_CONTENT_URL } />
        </div>
    )
}

export default Home