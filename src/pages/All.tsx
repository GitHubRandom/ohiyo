import AnimeList from '../components/AnimeList'
import React, { useEffect, useState } from 'react'

const All = () => {

    const [ searchTerm, updateSearch ] = useState("")

    useEffect(() => {
        document.title = "قائمة الأنمي"
    })

    return (
        <div className="home-page">
            <div className="anime-list-header">
                <h2 className="section-title"><span id="hamburger-menu" className="mdi mdi-menu"></span>قائمة الأنمي</h2>
                <input onInput={ (e: React.ChangeEvent<HTMLInputElement>) => updateSearch(() => e.target.value) } placeholder="البحث عن الأنمي" type="text" name="anime-search" id="anime-search"/>
            </div>
            <AnimeList showEpisodeName={ false } searchTerm={ searchTerm } className="content-list" searchMode={ true } />
        </div>
    )
}

export default All