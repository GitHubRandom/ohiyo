import AnimeList from '../components/AnimeList'
import { useState } from 'react'

const All = ({ toggleMenu }) => {

    const [ searchTerm, updateSearch ] = useState("")

    return (
        <div className="home-page">
            <div className="anime-list-header">
                <h2 className="section-title"><span onClick={ () => toggleMenu() } id="hamburger-menu" className="mdi mdi-menu"></span>قائمة الأنمي</h2>
                <input onInput={ (e) => updateSearch(() => e.target.value) } placeholder="البحث عن الأنمي" type="text" name="anime-search" id="anime-search"/>
            </div>
            <AnimeList showEpisodeName={ false } searchTerm={ searchTerm } className="content-list" searchMode={ true } />
        </div>
    )
}

export default All