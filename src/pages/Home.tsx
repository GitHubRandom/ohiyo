import AnimeSearchList from "../components/AnimeSearchList"
import { useEffect } from "react"

const Home = () => {

    useEffect(() => {
        document.title = "الرئيسة"
    })

    return (
        <div id="home" className="menu-content">
            <div id="home-page" className="content-page">
                <h2 className="section-title"><span id="hamburger-menu" className="mdi mdi-menu"></span>حلقات جديدة</h2>
                <AnimeSearchList className="content-list" showEpisodeName={ true } searchMode={ false } />
            </div>
        </div>
    )
}

export default Home