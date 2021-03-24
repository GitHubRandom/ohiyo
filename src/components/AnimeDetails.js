import { useEffect, useState } from "react"
import { Link } from "react-router-dom/cjs/react-router-dom.min"
import tippy from "tippy.js"
import ExpandableText from "./ExpandableText"
import Popup from "./Popup"

const ANIME_DETAILS_URL = "https://cors.bridged.cc/https://anslayer.com/anime/public/anime/get-anime-details"
const CLIENT_ID = "web-app"
const CLIENT_SECRET = "90b63e11b9b4634f124df024516id495ab749c6b"

const type = {
    "OVA": "اوفا",
    "ONA": "اونا",
    "TV": "مسلسل",
    "Special": "خاصة",
    "Movie": "فلم"
}

const source = {
    // TODO: An object with all possible values of anime source
    "4-koma manga": "مانجا 4-كوما",
    "Digital manga": "مانجا رقمية",
    "Picture book": "كتاب مصور",
    "Web manga": "مانجا ويب",
    "Book": "كتاب",
    "Game": "لعبة",
    "Manga": "مانجا",
    "Music": "موسيقى",
    "Novel": "رواية",
    "Radio": "راديو",
    "Visual novel": "رواية مرئية",
    "Original": "نص اصلي",
    "Card game": "اوراق لعب",
    "Light novel": "رواية خفيفة"
}

const AnimeDetails = ({ setRelated, episodesList, setTitle, animeId }) => {

    const [ animeDetails, updateDetails ] = useState({})
    const [ ratingSource, updateRateSource ] = useState("mal")

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

    useEffect(() => {
        tippy(".anime-details-score", {
            //trigger: "mouseenter focus click",
            content: (ref) => {
                return ref.dataset.tippy
            },
            onTrigger(instance) {
                instance.setContent(instance.reference.dataset.tippy)
            }
        })
    })

    function dismissPopup() {
        document.getElementsByClassName("popup")[0].style.display = "none"
    }

    function toggleRatingSource() {
        if (ratingSource == "mal") {
            updateRateSource("arabic")
        } else {
            updateRateSource("mal")
        }
    }

    function render() {
        var ready = Object.keys(animeDetails).length != 0
        var mal = null
        if (ready && animeDetails["more_info_result"]) mal = animeDetails["more_info_result"]
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
                        } }>
                        { ready && ratingSource == "mal" && mal && mal["score"] ?
                            <span onClick={ () => toggleRatingSource() } id="mal-rating" data-tippy="تقييم MAL" className="anime-details-score">
                                <span className="mdi mdi-star"></span>
                                { mal["score"] }
                            </span> : 
                            <>
                            { ready && ratingSource == "arabic" && animeDetails["anime_rating"] ? 
                                <span onClick={ () => toggleRatingSource() } id="arabic-rating" data-tippy="التقييم العربي" className="anime-details-score">
                                    <span className="mdi mdi-star"></span>
                                    { animeDetails["anime_rating"] }
                                </span> : null
                            }</>
                        }
                        </div>
                        { ready && mal && mal["trailer_url"] ? 
                        <button id="trailer-button" className="anime-details-trailer"><span className="mdi mdi-play"></span>العرض الدعائي</button> : null }
                    </div>
                    { ready ? 
                    <div className="anime-meta">
                        {/**<div className="anime-details-categories">
                            <span className="anime-details-rating"><span className="mdi mdi-star"></span>{ animeDetails["anime_rating"] }</span>
                            { animeDetails["anime_genres"] ? animeDetails["anime_genres"].split(',').map((genre, index) => <span key={ index } className="anime-details-category">{ genre }</span>) : <></> }
                        </div>**/}
                        <ExpandableText expandText="معرفة المزيد" hideText="اخفاء" text={ animeDetails["anime_description"] } className="anime-details-synopsis" />
                        <p className="anime-details-misc">

                            { animeDetails["anime_type"] ?
                                <><strong>النوع : </strong>{ animeDetails["anime_type"] in type ? type[animeDetails["anime_type"]] : "غير معروف" }<br /></> 
                            : null }

                            { animeDetails["anime_status"] ?
                                <><strong>الحالة : </strong>{ animeDetails["anime_status"] != "Currently Airing" ? "مكتمل" : "غير مكتمل" }<br /></>
                            : null }

                            <strong>الاستوديو : </strong>{ mal ? mal["anime_studios"] : null }<br />
                            
                            { animeDetails["anime_age_rating"] ?
                            <><strong>الفئة العمرية : </strong>{ animeDetails["anime_age_rating"] != "All" ? animeDetails["anime_age_rating"] : "للجميع" }<br /></>
                            : null }

                            { mal && mal["source"] ?
                            <><strong>المصدر : </strong>{ mal["source"] in source ? source[mal["source"]] : "غير معروف" }<br /></>
                            : null }

                            { mal && mal["episodes"] ?
                                <><strong>عدد الحلقات : </strong> { mal["episodes"] }</>
                            : null }
                        </p> 
                    </div> : null }
                </div>
                { ready && episodesList.length > 1 ?
                <Popup id="episodes-popup" trigger="#episodes-button" title="الحلقات">
                    <div className="popup-list">
                        { episodesList.map((episode,index) => {
                            return <Link onClick={ () => dismissPopup() } to={ "/" + animeId + "/" + (index + 1) } className="episode-link" key={ index }>{ episode["episode_name"] }</Link>
                        }) }
                    </div>
                </Popup> : null }
                { ready && animeDetails && mal && mal["trailer_url"] ? 
                <Popup id="trailer-popup" trigger="#trailer-button" title="العرض الدعائي">
                    <iframe allowFullScreen={ true } src={ mal["trailer_url"] } frameBorder="0"></iframe>
                </Popup> : null }
            </section>
        )
    }

    return render()
}

export default AnimeDetails