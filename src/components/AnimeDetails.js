import { useEffect, useState } from "react"
import ExpandableText from "./ExpandableText"

const ANIME_DETAILS_URL = "https://cors.bridged.cc/https://anslayer.com/anime/public/anime/get-anime-details?anime_id={id}&fetch_episodes=No&more_info=Yes"
const CLIENT_ID = "web-app"
const CLIENT_SECRET = "90b63e11b9b4634f124df024516id495ab749c6b"

const AnimeDetails = ({ setRelated, setTitle, animeId }) => {

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
    }, [])

    return (
        <section className="anime-details">
            <div style={{ backgroundImage: 'url(' + animeDetails["anime_cover_image_url"] + ')' }} className="anime-details-cover"></div>
            <button className="anime-details-trailer"><span className="mdi mdi-play"></span>العرض الدعائي</button>
            <div className="anime-meta">
                {/**<div className="anime-details-categories">
                    <span className="anime-details-rating"><span className="mdi mdi-star"></span>{ animeDetails["anime_rating"] }</span>
                    { animeDetails["anime_genres"] ? animeDetails["anime_genres"].split(',').map((genre, index) => <span key={ index } className="anime-details-category">{ genre }</span>) : <></> }
                </div>**/}
                <p className="anime-details-synopsis">{ animeDetails["anime_description"] }</p>
                {/*<ExpandableText expandText="معرفة المزيد" hideText="اخفاء" text={ animeDetails["anime_description"] } className="anime-details-synopsis" />*/}
                <p className="anime-details-misc">
                    <b>النوع : </b>{ animeDetails["anime_type"] }<br />
                    <b>الحالة : </b>{ animeDetails["anime_status"] != "Currently Airing" ? "مكتمل" : "غير مكتمل" }<br />
                    <b>الاستوديو : </b>{ animeDetails["more_info_result"] ? animeDetails["more_info_result"]["anime_studios"] : null }<br />
                    <b>الفئة العمرية : </b>{ animeDetails["anime_age_rating"] }<br />
                    <b>المصدر : </b>{ animeDetails["more_info_result"] ? (animeDetails["more_info_result"]["source"] == "Manga" ? "من مانجا" : "ليس له مانجا") : null }<br />
                </p> 
            </div>
        </section>
    )
}

export default AnimeDetails