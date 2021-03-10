import AnimeList from '../components/AnimeList'
import { useState } from 'react'

const SEARCH_ENDPOINT = "https://cors.bridged.cc/https://anslayer.com/anime/public/animes/get-published-animes"
const defaultParams = {
    _offset: 0,
    _limit: 30,
    _order_by: "latest_first",
    list_type: "anime_list",
    just_info: "Yes"
}


const All = () => {

    const [ searchTerm, updateSearch ] = useState("")

    return (
        <div className="home-page">
            <div className="anime-list-header">
                <h2 className="section-title">قائمة الأنمي</h2>
                <input onInput={ (e) => updateSearch(oldSearchTerm => e.target.value) } placeholder="البحث عن الأنمي" type="text" name="anime-search" id="anime-search"/>
            </div>
            <AnimeList showEpisodeName={ false } searchTerm={ searchTerm } className="content-list" params={ defaultParams } endpoint={ SEARCH_ENDPOINT } />
        </div>
    )
}

export default All