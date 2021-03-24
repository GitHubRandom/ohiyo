import AnimeList from "../components/AnimeList"
import { useEffect } from "react"

const Home = () => {

    useEffect(() => {
        document.title = "الرئيسة"
    })

    return (
        <div className="home-page">
            <h2 className="section-title"><span id="hamburger-menu" className="mdi mdi-menu"></span>حلقات جديدة</h2>
            <AnimeList className="content-list" showEpisodeName={ true } searchMode={ false } />
        </div>
    )
}

export default Home