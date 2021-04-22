import AnimeSearchList from "../components/AnimeSearchList"

const Ranked = () => {
    return (
        <div id="all" className="menu-content">
            <div id="all-page" className="content-page">
                <h2 className="section-title"><span id="hamburger-menu" className="mdi mdi-menu"></span>تصنيف الأنمي (MAL)</h2>
                <AnimeSearchList topAnime={ true } showEpisodeName={ false } className="content-list" searchMode={ false } />
            </div>
        </div>

    )
}

export default Ranked