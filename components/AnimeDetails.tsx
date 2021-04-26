import { useEffect, useState } from "react"
import ExpandableText from "./ExpandableText"
import Link from 'next/link'
import Popup from "./Popup"

const ENDPOINT = "/api/details"

// Expected data response values scrapped from AnimeSlayer.apk :)
const animeTypes: Record<string,string> = {
    "OVA": "اوفا",
    "ONA": "اونا",
    "TV": "مسلسل",
    "Special": "خاصة",
    "Movie": "فلم"
}

const source: Record<string,string> = {
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

interface TAnimeDetails {
    episodesList: Array<Record<string,any>>,
    animeDetails: Record<string,any>
}

const AnimeDetails = ({ episodesList, animeDetails }: TAnimeDetails) => {

    const [ ratingSource, updateRateSource ] = useState<"mal" | "arabic">("mal")

    function dismissPopup() {
        (document.getElementsByClassName("popup")[0] as HTMLElement).style.display = "none"
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
                        { ready && mal && mal["score"] ?
                            <><span onClick={ () => toggleRatingSource() } id="mal-rating" data-tippy-content="تقييم MAL" className={ ratingSource == "mal" ? "anime-details-score" : "anime-details-score hidden" }>
                                <span className="mdi mdi-star"></span>
                                { mal["score"] }
                            </span>
                            <span onClick={ () => toggleRatingSource() } id="arabic-rating" data-tippy-content="التقييم العربي" className={ ratingSource == "arabic" ? "anime-details-score" : "anime-details-score hidden" }>
                                    <span className="mdi mdi-star"></span>
                                    { animeDetails["anime_rating"] }
                            </span></> : null
                        }
                        </div>
                        { ready && mal && mal["trailer_url"] ? 
                        <button id="trailer-button" className="anime-details-trailer"><span className="mdi mdi-play"></span>العرض الدعائي</button> : null }
                    </div>
                    { ready ? 
                    <div className="anime-meta">
                        <ExpandableText expandText="معرفة المزيد" hideText="اخفاء" text={ animeDetails["anime_description"] } className="anime-details-synopsis" />
                        <p className="anime-details-misc">

                            { animeDetails["anime_type"] ?
                                <><strong>النوع : </strong>{ animeDetails["anime_type"] in animeTypes ? animeTypes[animeDetails["anime_type"]] : "غير معروف" }<br /></> 
                            : null }

                            { animeDetails["anime_status"] ?
                                <><strong>الحالة : </strong>{ animeDetails["anime_status"] != "Currently Airing" ? "مكتمل" : "غير مكتمل" }<br /></>
                            : null }
                            { mal ?
                                <><strong>الاستوديو : </strong><Link href={ `/all?anime_studio_ids=${mal["anime_studio_ids"]}` }><a className="stealth-link">{ mal["anime_studios"] }</a></Link><br /></>
                            : null }
                            
                            { animeDetails["anime_age_rating"] ?
                            <><strong>الفئة العمرية : </strong>{ animeDetails["anime_age_rating"] != "All" ? animeDetails["anime_age_rating"] : "للجميع" }<br /></>
                            : null }

                            { mal && mal["source"] ?
                            <><strong>المصدر : </strong>{ mal["source"] in source ? source[mal["source"]] : "غير معروف" }<br /></>
                            : null }

                            { animeDetails["anime_genres"] ?
                                <><strong>الصنف : </strong>{ animeDetails["anime_genres"].split(",").map((genre: string, index:number, genres: string[]) => {
                                    return <><Link href={ `/all?anime_genres=${animeDetails["anime_genre_ids"].split(",")[index].trim()}` } key={ index }><a className="stealth-link">{ genre.trim() }</a></Link>{ index != genres.length - 1 ? "، " : null }</>
                                })} <br /></> : null
                            }

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
                            return <Link href={ "/" + animeDetails.anime_id + "/" + (index + 1) } key={ index }><a onClick={ () => dismissPopup() } className="episode-link">{ episode["episode_name"] }</a></Link>
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