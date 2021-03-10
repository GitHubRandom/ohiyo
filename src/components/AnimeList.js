import { useEffect,useState } from 'react'
import Episode from '../components/Episode'

const AnimeList = ({ endpoint, showEpisodeName, params, className, searchTerm }) => {

    const [ content, updateContent ] = useState([])

    /**
     * searching: still searching
     * error: if any error occured
     * no-results: no result found
     * success: search finished with positive results
     */
    const [ status, updateStatus ] = useState("searching")
    const [ page, updatePage ] = useState(1)

    useEffect(() => {
        var paramaters = params ? params : {}
        if (params && searchTerm.length != 0) {
            params["anime_name"] = searchTerm
        }
        if (params) endpoint = endpoint + "?json=" + encodeURI(JSON.stringify(paramaters))
        updateStatus("searching")

        const controller = new AbortController()
        const signal = controller.signal    
        fetch(endpoint, { 
            headers: new Headers({
                "Client-Id": process.env.REACT_APP_CLIENT_ID,
                "Client-Secret": process.env.REACT_APP_CLIENT_SECRET,
            }), signal: signal
        })
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            if (data && data["response"] && !Array.isArray(data["response"])) {
                updateContent(data["response"]["data"])
                updateStatus("success")
            } else {
                updateContent([])
                updateStatus("no-results")
            }
        })
        .catch((error) => {
            if (error.name === "AbortError") return
            updateContent([])
            updateStatus("error")
        })
        return () => controller.abort()
    }, [searchTerm])

    function NoResults() {
        if (status == "searching") {
            return <div className="error-message"><span className="mdi mdi-loading mdi-spin"></span><p>جاري العمل</p></div>
        } else if (status == "no-results") {
            return <div className="error-message"><span className="mdi mdi-close"></span><p>لا توجد نتائج</p></div>
        } else {
            return <div className="error-message"><span className="mdi mdi-exclamation-thick"></span><p>حصل خطأ ما</p></div>
        }
    }

    //TODO: Fix searching crashing app
    return (
        <>
        { status == "success" ?
            <div className={ className }>
                { content.map((episode) => 
                    <Episode key = { showEpisodeName ? episode["latest_episode_id"] : episode["anime_id"] }
                        showEpisodeName = { showEpisodeName }
                        animeName = {episode["anime_name"]}
                        url = {'/' + episode["anime_id"] + '/1'}
                        cover = {episode["anime_cover_image_url"]}
                        episodeName = {episode["latest_episode_name"]}
                    />
                ) }
            </div>
        : <NoResults /> }
        </>
    )
}

export default AnimeList