import React, { useEffect,useState } from 'react'
import Episode from './Episode'
import tippy, { followCursor } from 'tippy.js'
import ContentList from './ContentList'

const ENDPOINT = "/api/latest"
const PARAMS: Record<string,any> = {
    _limit: 30,
    _order_by: "latest_first",
    just_info: "Yes"
}

interface IAnimeList {
    showEpisodeName: boolean,
    searchMode: boolean,
    className: string,
    searchTerm?: string,
    filters?: Record<string,string[]>
    topAnime?: true
}

const AnimeSearchList = ({ showEpisodeName, searchMode, className, searchTerm, filters, topAnime }: IAnimeList) => {

    const [ content, updateContent ] = useState<Record<string,any>[]>([])

    /**
     * searching: still searching
     * error: if any error occured
     * no-results: no result found
     * success: search finished with positive results
     * @Ritzy
     */
    const [ status, updateStatus ] = useState<"searching" | "no-results" | "success" | "error">("searching")
    const [ page, updatePage ] = useState<number>(1)
    const [ lastHeight, updateLastHeight ] = useState<number>(0)

    function fetchData(resetPage: boolean) {
        var params = {...PARAMS}
        updateStatus("searching")
        const controller = new AbortController()
        if (resetPage) {
            // Reset the page to one & empties the list
            updateContent([])
            updatePage(1)
            updateLastHeight(0)
        }
        params["_offset"] = (page - 1) * 30

        // Filtering options
        let isFiltered = false
        if (filters) {
            for (var option in filters) {
                if (filters[option].length) {
                    option == "anime_genres" ? params["anime_genre_ids"] = filters[option].join(",") : params[option] = filters[option].join(",")
                    isFiltered = true
                }
            }
        }

        // Set to filtering mode if in serachMode or there is custom filters
        if (searchTerm && searchTerm.length || isFiltered) {
            params["list_type"] = "filter"
            if (searchTerm && searchTerm.length) {
                params["anime_name"] = searchTerm
            }
        } else {
            if (searchMode) {
                params["list_type"] = "anime_list"
            } else {
                if (topAnime) {
                    params["list_type"] = "top_anime_mal"
                } else {
                    params["list_type"] = "latest_updated_episode_new"
                }
            }
            if (params["anime_name"]) delete params["anime_name"]
        }    

        var endpoint = ENDPOINT + "?json=" + encodeURI(JSON.stringify(params))

        fetch(endpoint, { 
            signal: controller.signal
        })
        .then(response => {
            return response.json()
        })
        .then(data => {
            if (data && data["response"] && !Array.isArray(data["response"])) {
                updateContent((oldData) => oldData.concat(data["response"]["data"]))
                updateStatus("success")
            } else {
                if (page == 1) {
                    updateContent([])
                }
                updateStatus("no-results")
            }
        })
        .catch(error => {
            if (error.name === "AbortError") return
            updateContent([])
            updateStatus("error")
        })
        return () => { if (controller && !controller.signal.aborted) controller.abort() }
    }

    useEffect(() => {
        if (searchMode || filters) {
            return fetchData(true)
        }
    }, [searchTerm,filters])

    useEffect(() => {
        if (page > 1 || !searchMode) {
            return fetchData(false)
        }
    }, [page])

    useEffect(() => {
        /**
         * To prevent bottom event from recurring,
         * I set a state for latest scroll height so 
         * the function will only be triggered when
         * it's on the bottom and also higher than the
         * last height triggered height.
         * Also I added 200px offset for the loading
         * element. @Ritzy
         */
        
        let observer = new IntersectionObserver((entries) => {
            if (status == "success" && entries[0] && entries[0].isIntersecting && window.pageYOffset > lastHeight + 200) {
                updateLastHeight(window.pageYOffset)
                let oldPage = page
                oldPage++ 
                updatePage(oldPage)    
            }
        })
        if (document.querySelector(".bottom-detector")) {
            observer.observe(document.querySelector(".bottom-detector") as Element)
        }

        return () => {
            observer.disconnect()
        }
    })

    function NoResults({ noHeight }: { noHeight: boolean }) {
        var className = noHeight ? "error-message no-height" : "error-message"
        if (status == "searching") {
            return <div className={ className }><span className="mdi mdi-loading mdi-spin"></span><p>جاري العمل</p></div>
        } else if (status == "no-results") {
            return <div className={ className }><span className="mdi mdi-close"></span><p>لا توجد نتائج</p></div>
        } else {
            return <div className={ className }><span className="mdi mdi-exclamation-thick"></span><p>حصل خطأ ما</p></div>
        }
    }

    return (
        <>
        { status != "success" && (page == 1) ? <NoResults noHeight={ false } /> :  
            <ContentList showEpisodeName={ showEpisodeName } contentList={ content } className={ className } /> }
        { status == "searching" && page != 1 ? <NoResults noHeight={ true } /> : null }
        <div className="bottom-detector"></div>
        </>
    )
}

export default AnimeSearchList