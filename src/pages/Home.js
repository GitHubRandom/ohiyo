import AnimeList from "../components/AnimeList"

const Home = ({ toggleMenu }) => {
    return (
        <div className="home-page">
            <h2 className="section-title"><span onClick={ () => toggleMenu() } id="hamburger-menu" className="mdi mdi-menu"></span>حلقات جديدة</h2>
            <AnimeList className="content-list" showEpisodeName={ true } searchMode={ false } />
        </div>
    )
}

export default Home