import AnimeSearchList from '../components/AnimeSearchList'
import React, { useEffect, useState } from 'react'
import Popup from '../components/Popup'
import { stringify } from 'node:querystring'
import tippy from 'tippy.js'

const FILTER_OPTIONS_ENDPOINT = "https://cors.bridged.cc/anslayer.com/anime/public/animes/get-anime-dropdowns"

const All = ({ filter }: { filter: URLSearchParams }) => {

    const [ searchTerm, updateSearch ] = useState<string>("")
    const [ filterOptions, updateFilterOptions ] = useState<Record<string,any>>({})
    const [ filters, updateFilters ] = useState<Record<string,any>>({})

    useEffect(() => {
        document.title = "قائمة الأنمي"
        tippy("[data-tippy-content]")
    },[])

    useEffect(() => {
        fetch(FILTER_OPTIONS_ENDPOINT, {
            headers: new Headers({
                "Client-Id": process.env.REACT_APP_CLIENT_ID,
                "Client-Secret": process.env.REACT_APP_CLIENT_SECRET
            } as HeadersInit)
        }).then(response => response.json())
        .then(data => {
            if (data["response"]) {
                updateFilterOptions(data["response"])
                let emptyFilters = {}
                Object.keys(data["response"]).forEach(option => {
                    emptyFilters = {...emptyFilters, [option]: []}
                })
                updateFilters(oldFilters => {
                    /**
                     * Here we have to check if queried filters are supported
                     * then merge them if so
                     */
                    for (let [name, value] of filter.entries()) {
                        if (name in data["response"]) {
                            oldFilters = { ...oldFilters, [name]: value.split(",") }
                        }
                    }
                    return {...emptyFilters, ...oldFilters}
                })
            }
        })
    },[])

    /**
     * This function changes the search filters
     * @param filterOption the option to update (string)
     * @param value the value to insert or delete (string)
     * @param remove delete or insert the value (string)
     */
    const changeFilter = (filterOption: string, value: string, remove: boolean) => {
        updateFilters(oldFilterOptions => {
            if (!remove) {
                oldFilterOptions[filterOption].push(value)
            } else if (oldFilterOptions[filterOption].includes(value)) {
                let index = oldFilterOptions[filterOption].indexOf(value)
                oldFilterOptions[filterOption].splice(index, 1)
            }
            return {...oldFilterOptions}
        })
    }

    return (
        <div id="all" className="menu-content">
            <div id="all-page" className="content-page">
                <div className="anime-list-header">
                    <h2 className="section-title"><span id="hamburger-menu" className="mdi mdi-menu"></span>قائمة الأنمي</h2>
                    <div className="anime-search-container">
                        { Object.keys(filterOptions).length ? <span id="anime-filter-button" data-tippy-content="التصنيف" className="mdi mdi-filter"></span> : null }
                        <input onInput={ (e: React.ChangeEvent<HTMLInputElement>) => updateSearch(() => e.target.value) } placeholder="البحث عن الأنمي" type="text" name="anime-search" id="anime-search"/>
                    </div>
                </div>
                { Object.keys(filterOptions).length ?
                    <Popup title="تصنيف حسب" trigger="#anime-filter-button" id="anime-filter-popup">
                        <div className="anime-filters">
                            <div id="studio" className="anime-filter-section">
                                <h3 className="anime-filter-header">
                                    الاستوديو
                                </h3>
                                <div className="anime-filter-checkboxes">
                                    { filterOptions["anime_studio_ids"]["data"].map((filterOption: Record<string,string>) => {
                                        return (
                                            <div key={ "studio-" + filterOption.value } className="anime-filter-checkbox">
                                                <input checked={ filters.anime_studio_ids && filters.anime_studio_ids.includes(filterOption.value) } onChange={ (e) => changeFilter("anime_studio_ids", filterOption.value, !e.target.checked) }
                                                    type="checkbox"
                                                    name={ filterOption.option } 
                                                    id={ "studio-" + filterOption.value } />
                                                <label htmlFor={ "studio-" + filterOption.value }>{ filterOption.option }</label>
                                            </div>
                                        )
                                    }) }
                                </div>
                            </div>
                            <div id="genre" className="anime-filter-section">
                                <h3 className="anime-filter-header">
                                    النوع
                                </h3>
                                <div className="anime-filter-checkboxes">
                                    { filterOptions["anime_genres"]["data"].map((filterOption: Record<string,string>) => {
                                        return (
                                            <div key={ "genre-" + filterOption.value } className="anime-filter-checkbox">
                                                <input checked={ filters.anime_genres && filters.anime_genres.includes(filterOption.value) } onChange={ (e) => changeFilter("anime_genres", filterOption.value, !e.target.checked) }
                                                    type="checkbox"
                                                    name={ filterOption.option }
                                                    id={ "genre-" + filterOption.value } />
                                                <label htmlFor={ "genre-" + filterOption.value }>{ filterOption.option }</label>
                                            </div>
                                        )
                                    }) }
                                </div>
                            </div>
                            <div id="release-year" className="anime-filter-section">
                                <h3 className="anime-filter-header">
                                    تاريخ الصدور
                                </h3>
                                <div className="anime-filter-checkboxes">
                                    { filterOptions["anime_release_years"]["data"].map((filterOption: Record<string,string>) => {
                                        return (
                                            <div key={ "year-" + filterOption.value } className="anime-filter-checkbox">
                                                <input checked={ filters.anime_release_years && filters.anime_release_years.includes(filterOption.value) } onChange={ (e) => changeFilter("anime_release_years", filterOption.value, !e.target.checked) }
                                                    type="checkbox"
                                                    name={ filterOption.option }
                                                    id={ "year-" + filterOption.value } />
                                                <label htmlFor={ "year-" + filterOption.value }>{ filterOption.option }</label>
                                            </div>
                                        )
                                    }) }
                                </div>
                            </div>
                        </div>
                    </Popup> : null
                }
                <AnimeSearchList filters={ filters } showEpisodeName={ false } searchTerm={ searchTerm } className="content-list" searchMode={ true } />
            </div>
        </div>
    )
}

export default All