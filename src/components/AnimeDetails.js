import { useEffect, useState } from "react"
import { Link } from "react-router-dom/cjs/react-router-dom.min"
import ExpandableText from "./ExpandableText"

const ANIME_DETAILS_URL = "https://cors.bridged.cc/https://anslayer.com/anime/public/anime/get-anime-details?anime_id={id}&fetch_episodes=No&more_info=Yes"
const CLIENT_ID = "web-app"
const CLIENT_SECRET = "90b63e11b9b4634f124df024516id495ab749c6b"

const AnimeDetails = ({ setRelated, episodesList, setTitle, animeId }) => {

    const [ animeDetails, updateDetails ] = useState({})

    useEffect(() => {
        var url = new URL(ANIME_DETAILS_URL)
        var params = { anime_id: animeId.toString(), fetch_episodes: "No", more_info: "Yes" }
        url.search = new URLSearchParams(params).toString()
        fetch(url, {headers: new Headers({
            "Client-Id": CLIENT_ID,
            "Client-Secret": CLIENT_SECRET,
        })})
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            updateDetails(data["response"])
            setTitle(data["response"]["anime_name"])
            setRelated(data["response"]["related_animes"]["data"])
        })
        return () => {
            updateDetails({})
        }
    }, [animeId])

    function showPopup() {
        document.getElementById("episodes-popup").style.display = "flex"
    }

    function dismissPopup() {
        document.getElementById("episodes-popup").style.display = "none"
    }

    function render() {
        var ready = Object.keys(animeDetails).length != 0
        return (
            <section className="anime-details">
                <div className="anime-details-info">
                    <div className="anime-details-side">
                        <div { ... ready ? {
                            style: {
                                backgroundImage: `url(${animeDetails["anime_cover_image_url"]})`
                            },
                            className: "anime-details-cover"
                        } : {
                            className: "anime-details-cover loading"
                        } }></div>
                        { ready ? <button className="anime-details-trailer"><span className="mdi mdi-play"></span>العرض الدعائي</button> : null }
                    </div>
                    { ready ? 
                    <div className="anime-meta">
                        {/**<div className="anime-details-categories">
                            <span className="anime-details-rating"><span className="mdi mdi-star"></span>{ animeDetails["anime_rating"] }</span>
                            { animeDetails["anime_genres"] ? animeDetails["anime_genres"].split(',').map((genre, index) => <span key={ index } className="anime-details-category">{ genre }</span>) : <></> }
                        </div>**/}
                        <ExpandableText expandText="معرفة المزيد" hideText="اخفاء" text={ animeDetails["anime_description"] } className="anime-details-synopsis" />
                        <p className="anime-details-misc">
                            <strong>النوع : </strong>{ animeDetails["anime_type"] }<br />
                            <strong>الحالة : </strong>{ animeDetails["anime_status"] != "Currently Airing" ? "مكتمل" : "غير مكتمل" }<br />
                            <strong>الاستوديو : </strong>{ animeDetails["more_info_result"] ? animeDetails["more_info_result"]["anime_studios"] : null }<br />
                            <strong>الفئة العمرية : </strong>{ animeDetails["anime_age_rating"] }<br />
                            <strong>المصدر : </strong>{ animeDetails["more_info_result"] ? (animeDetails["more_info_result"]["source"] == "Manga" ? "من مانجا" : "ليس له مانجا") : null }<br />
                        </p> 
                    </div> : null }
                </div>
                <div id="episodes-popup">
                    <div className="episodes-popup-container">
                        <div className="episodes-popup-header">
                            <h2 className="episodes-popup-title">الحلقات</h2>
                            <div className="episodes-popup-close" onClick={ () => dismissPopup() }>إغلاق</div>
                        </div>
                        <div className="episodes-popup-list">
                            { episodesList.map((episode,index) => {
                                return <Link onClick={ () => dismissPopup() } to={ "/" + animeId + "/" + (index + 1) } className="episode-link" key={ index }>{ episode["episode_name"] }</Link>
                            }) }
                        </div>
                    </div>
                </div>
    
            </section>
        )
    }

    return render()
}

export default AnimeDetails