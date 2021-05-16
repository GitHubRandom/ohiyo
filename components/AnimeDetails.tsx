import React, { useCallback, useState } from "react"
import ExpandableText from "./ExpandableText"
import { getEpisodeTags } from '../components/WatchTopBar'
import Link from 'next/link'
import Popup from "./Popup"

export const animeGenres: Record<string,any> = {
    Action: "أكشن",
    Adventure: "مغامرة",
    Cars: "سيارات",
    Comedy: "كوميدي",
    Dementia: "جنون",
    Demons: "شياطين",
    Mystery: "غموض",
    Drama: "دراما",
    Ecchi: "إيتشي",
    Fantasy: "خيال",
    Game: "لعبة",
    Historical: "تاريخي",
    Horror: "رعب",
    Kids: "أطفال",
    Magic: "سحر",
    "Martial Arts": "فنون قتالية",
    Mecha: "ميكا",
    Music: "موسيقى",
    Parody: "محاكاة ساخرة",
    Samurai: "ساموراي",
    Romance: "رومانسي",
    Sports: "رياضي",
    School: "مدرسي",
    Shoujou: "شوجو",
    Shounen: "شونين",
    Space: "فضاء",
    "Super Power": "قوة خارقة",
    "Vampire": "مصاص دماء",
    Harem: "حريم",
    "Slice of life": "شريحة من الحياة",
    Supernatural: "خارق للطبيعة",
    Military: "عسكري",
    Police: "شرطة",
    Psychological: "نفسي",
    Thriller: "إثارة",
    Seinen: "سينين",
    Josei: "جوسي",
    "Sci-Fi": "خيال علمي"
}

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
    animeDetails: Record<string,any>,
}

const AnimeDetails = ({ episodesList, animeDetails }: TAnimeDetails) => {

    const [ ascending, updateEpisodesOrder ] = useState<boolean>(true)

    function getRate(rate:string) {
        switch (true) {
            case rate.includes("PG-13"):
                return "13+"
            case rate.includes("PG"):
                return "للأطفال"
            case rate.includes("17"):
                return "17+"
            case rate.includes("G"):
                return "للجميع"
            default:
                return "غير معروف"
        }
    }

    const reverseList = useCallback(() => {
        updateEpisodesOrder(!ascending)
    }, [ascending])

    function dismissPopup() {
        (document.getElementsByClassName("popup")[0] as HTMLElement).style.display = "none"
    }

    function render() {
        var ready = Object.keys(animeDetails).length != 0
        return (
            <section className="anime-details">
                <div className="anime-details-info">
                    <div className="anime-details-side">
                        <div { ... ready ? {
                            style: {
                                backgroundImage: `url(${animeDetails["image_url"]})`
                            },
                            className: "anime-details-cover"
                        } : {
                            className: "anime-details-cover loading"
                        } }>
                        <span id="mal-rating" data-tippy-content="تقييم MAL" className="anime-details-score">
                            <span className="mdi mdi-star"></span>
                            { animeDetails["score"] }
                        </span>
                        </div>
                        { ready ? 
                        <button id="trailer-button" className="anime-details-trailer"><span className="mdi mdi-play"></span>العرض الدعائي</button> : null }
                    </div>
                    { ready ? 
                    <div className="anime-meta">
                        <ExpandableText expandText="معرفة المزيد" hideText="اخفاء" text={ animeDetails["synopsis"] } className="anime-details-synopsis" />
                        <p className="anime-details-misc">

                            { animeDetails.type ?
                                <><strong>النوع : </strong>{ animeDetails.type in animeTypes ? animeTypes[animeDetails.type] : "غير معروف" }<br /></> 
                            : null }

                            { animeDetails.status ?
                                <><strong>الحالة : </strong>{ animeDetails.status != "Currently Airing" ? "مكتمل" : "غير مكتمل" }<br /></>
                            : null }

                            { animeDetails.studios.length ?
                                <><strong>الاستوديو : </strong>
                                { animeDetails.studios.map((studio:Record<string,any>,index:number,studios:Record<string,any>[]) => {
                                    return <React.Fragment key={ index }><Link href={ `/all?studio=${studio.name}` }><a dir="ltr" className="stealth-link">{ studio.name }</a></Link>{ index != studios.length - 1 ? "، " : null }</React.Fragment>
                                }) }
                                <br /></>
                            : null }
                            
                            { animeDetails.rating ?
                            <><strong>الفئة العمرية : </strong><span dir="ltr">{ getRate(animeDetails.rating) }</span><br /></>
                            : null }

                            { animeDetails["source"] ?
                            <><strong>المصدر : </strong>{ animeDetails["source"] in source ? source[animeDetails["source"]] : "غير معروف" }<br /></>
                            : null }

                            { animeDetails["genres"].length ?
                                <><strong>الصنف : </strong>{ animeDetails["genres"].map((genre: string, index:number, genres: string[]) => {
                                    if (genre["name"] in animeGenres) {
                                        return <React.Fragment key={ index }><Link href={ `/all?genre=${encodeURI(animeGenres[genre["name"]])}` } key={ index }><a className="stealth-link">{ animeGenres[genre["name"]] }</a></Link>{ index != genres.length - 1 ? "، " : null }</React.Fragment>
                                    } else {
                                        <React.Fragment key={ index }></React.Fragment>
                                    }
                                })} <br /></> : null
                            }

                            { animeDetails["episodes"] ?
                                <><strong>عدد الحلقات : </strong> { animeDetails["episodes"] }</>
                            : null }

                        </p> 
                    </div> : null }
                </div>
                { ready && episodesList.length > 1 ?
                <Popup id="episodes-popup" trigger="#episodes-button" title="الحلقات">
                    { ascending ? <>
                        <div onClick={ () => reverseList() } style={{ display: "inline" }} className="dark-button episodes-popup-order">
                            <span className="mdi mdi-sort-ascending"></span>تصاعدي
                        </div>
                        <div className="popup-list">
                            { episodesList.map((episode,index) => {
                                return <Link scroll={ false } href={ "/watch/" + animeDetails.anime_id + '-' + animeDetails.mal_id + "/" + (index + 1) } key={ index }><a onClick={ () => dismissPopup() } className="episode-link">{ `الحلقة ${episode.Episode}${episode.ExtraEpisodes.length ? `-${episode.ExtraEpisodes}` : ""}` }{ getEpisodeTags(episode) }</a></Link>
                            })}
                        </div>
                        </>
                    : <>
                        <div onClick={ () => reverseList() } style={{ display: "inline" }} className="dark-button episodes-popup-order">
                            <span className="mdi mdi-sort-descending"></span>تنازلي
                        </div>
                        <div className="popup-list">
                            { episodesList.map((episode,index) => {
                                return <Link scroll={ false } href={ "/watch/" + animeDetails.anime_id + '-' + animeDetails.mal_id + "/" + (index + 1) } key={ index }><a onClick={ () => dismissPopup() } className="episode-link">{ `الحلقة ${episode.Episode}${episode.ExtraEpisodes.length ? `-${episode.ExtraEpisodes}` : ""}` }{ getEpisodeTags(episode) }</a></Link>
                            }).reverse()}
                        </div>
                        </>
                    }
                </Popup> : null }
                { ready && animeDetails.trailer_url ? 
                <Popup id="trailer-popup" trigger="#trailer-button" title="العرض الدعائي">
                    <iframe allowFullScreen={ true } src={ animeDetails.trailer_url } frameBorder="0"></iframe>
                </Popup> : null }
            </section>
        )
    }

    return render()
}

export default React.memo(AnimeDetails)