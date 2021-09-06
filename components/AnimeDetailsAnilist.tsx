import React, { useCallback, useRef, useState } from "react"
import ExpandableText from "./ExpandableText"
import Link from 'next/link'
import Popup from "./Popup"
import tippy from "tippy.js"
import { motion } from "framer-motion"
import { useEffect } from "react"
import { getTrailerEmbed } from "../utils/Formatters"
import Head from "next/head"
import { useRouter } from "next/router"

export const animeGenres: Record<string,any> = {
    "Action": "أكشن",
    "Adventure": "مغامرة",
    "Cars": "سيارات",
    "Comedy": "كوميدي",
    "Dementia": "جنون",
    "Demons": "شياطين",
    "Mystery": "غموض",
    "Drama": "دراما",
    "Ecchi": "إيتشي",
    "Fantasy": "خيال",
    "Game": "لعبة",
    "Historical": "تاريخي",
    "Horror": "رعب",
    "Kids": "أطفال",
    "Magic": "سحر",
    "Martial Arts": "فنون قتالية",
    "Mecha": "ميكا",
    "Music": "موسيقى",
    "Parody": "محاكاة ساخرة",
    "Samurai": "ساموراي",
    "Romance": "رومانسي",
    "Sports": "رياضي",
    "School": "مدرسي",
    "Shoujou": "شوجو",
    "Shounen": "شونين",
    "Space": "فضاء",
    "Super Power": "قوة خارقة",
    "Vampire": "مصاص دماء",
    "Harem": "حريم",
    "Slice of life": "شريحة من الحياة",
    "Supernatural": "خارق للطبيعة",
    "Military": "عسكري",
    "Police": "شرطة",
    "Psychological": "نفسي",
    "Thriller": "إثارة",
    "Seinen": "سينين",
    "Josei": "جوسي",
    "Sci-Fi": "خيال علمي"
}

// Expected data response values scrapped from AnimeSlayer.apk :)
const animeTypes: Record<string,string> = {
    "OVA": "اوفا",
    "ONA": "اونا",
    "TV": "مسلسل",
    "TV_SHORT": "مسلسل (حلقات قصيرة)",
    "SPECIAL": "خاصة",
    "MUSIC": "موسيقى",
    "MOVIE": "فلم"
}

const animeSources: Record<string,string> = {
    "VIDEO_GAME": "لعبة",
    "MANGA": "مانجا",
    "NOVEL": "رواية",
    "VISUAL_NOVEL": "رواية مرئية",
    "ORIGINAL": "نص اصلي",
    "LIGHT_NOVEL": "رواية خفيفة",
    "DOUJINSHI": "مطبوع ذاتي النشر (Doujinshi)",
    "OTHER": "أخرى"
}

const animeStatuses: Record<string,string> = {
    "RELEASING": "غير مكتمل",
    "FINISHED": "مكتمل",
    "NOT_YET_RELEASED": "لم يبث بعد",
    "CANCELLED": "تم إلغاؤه",
    "HIATUS": "موقوف"
}

interface TAnimeDetails {
    animeDetails: Record<string,any>
}

const AnimeDetailsAnilist = ({ animeDetails }: TAnimeDetails) => {

    const trailerPopupTrigger = useRef()
    const router = useRouter()

    useEffect(() => {
        // Reinit tippy every re-render
        tippy("[data-tippy-content]")
    })

    const getRate = (rate:string) => {
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

    const render = () => {
        var ready = Object.keys(animeDetails).length != 0
        return (
            <>
                { ready ?
                    <Head>
                        <meta name="description" content={ `شاهد ${animeDetails.title.romaji || animeDetails.title.english} على Animayhem بجودة عالية` }/>
                        <meta property="og:title" content={ `${animeDetails.title.romaji || animeDetails.title.english} على Animayhem` }/>
                        <meta property="og:site_name" content="Animayhem"/>
                        <meta property="og:url" content={ "https://animayhem.ga" + router.asPath } />
                        <meta property="og:description" content={ animeDetails.synopsis } />
                        <meta property="og:type" content={ animeDetails.format == "MOVIE" ? "video.movie" : "video.episode" } />
                        <meta property="og:image" content={ animeDetails.coverImage.large } />
                        { animeDetails.trailer ? <meta property="og:video" content={ getTrailerEmbed(animeDetails.trailer) } /> : null }
                    </Head>
                : null }
                <motion.section animate={{ translateX: 0, opacity: 1 }} initial={{ translateX: 20, opacity: 0 }} transition={{ delay: 0.5 }} className="anime-details">
                    <div className="anime-details-info">
                        <div className="anime-details-side">
                            <div { ... ready ? {
                                style: {
                                    backgroundImage: `url(${animeDetails.coverImage.large})`
                                },
                                className: "anime-details-cover"
                            } : {
                                className: "anime-details-cover loading"
                            } }>
                            { animeDetails.averageScore ?
                                <span id="mal-rating" data-tippy-content="تقييم Anilist" className="anime-details-score">
                                    <span className="mdi mdi-star"></span>
                                    { animeDetails.averageScore / 10 }
                                </span>
                            : null }
                            </div>
                            { ready ? 
                            <button ref={ trailerPopupTrigger } id="trailer-button" className={ animeDetails.trailer ? "anime-details-trailer" : "anime-details-trailer disabled" }><span className="mdi mdi-play"></span>العرض الدعائي</button> : null }
                        </div>
                        { ready ? 
                        <div className="anime-meta">
                            <ExpandableText expandText="معرفة المزيد" hideText="اخفاء" text={ animeDetails.synopsis } className="anime-details-synopsis" />
                            <p className="anime-details-misc">

                                { animeDetails.format ?
                                    <><strong>النوع : </strong>{ animeDetails.format in animeTypes ? animeTypes[animeDetails.format] : "غير معروف" }<br /></> 
                                : null }

                                { animeDetails.status ?
                                    <><strong>الحالة : </strong>{ animeDetails.status in animeStatuses ? animeStatuses[animeDetails.status] : "غير معروف" }<br /></>
                                : null }

                                { animeDetails.studios && animeDetails.studios.nodes ?
                                    <><strong>الاستوديو : </strong>
                                    { animeDetails.studios.nodes.map((studio:Record<string,any>, index:number, studios:Record<string,any>[]) => {
                                        return <React.Fragment key={ index }><Link href={ `/all?studio=${studio.name}` }><a dir="ltr" className="stealth-link">{ studio.name }</a></Link>{ index != studios.length - 1 ? "، " : null }</React.Fragment>
                                    }) }
                                    <br /></>
                                : null }
                                
                                {/* animeDetails.rating ?
                                <><strong>الفئة العمرية : </strong><span dir="ltr">{ getRate(animeDetails.rating) }</span><br /></>
                                : null */}

                                { animeDetails.source ?
                                <><strong>المصدر : </strong>{ animeDetails.source in animeSources ? animeSources[animeDetails.source] : "غير معروف" }<br /></>
                                : null }

                                { animeDetails.genres.length ?
                                    <><strong>الصنف : </strong>{ animeDetails.genres.map((genre: string, index:number, genres: string[]) => {
                                        if (genre in animeGenres) {
                                            return <React.Fragment key={ index }><Link href={ `/all?genre=${encodeURI(animeGenres[genre])}` } key={ index }><a className="stealth-link">{ animeGenres[genre] }</a></Link>{ index != genres.length - 1 ? "، " : null }</React.Fragment>
                                        } else {
                                            <React.Fragment key={ index }></React.Fragment>
                                        }
                                    })} <br /></> : null
                                }

                                { animeDetails.format && animeDetails.format != "MOVIE" && animeDetails.episodes ?
                                    <><strong>عدد الحلقات : </strong> { animeDetails.episodes }</>
                                : null }

                            </p> 
                        </div> : null }
                    </div>
                    { ready && animeDetails.trailer ? 
                    <Popup id="trailer-popup" trigger={ trailerPopupTrigger } title="العرض الدعائي">
                        <div className="trailer-container">
                            <iframe allowFullScreen={ true } src={ getTrailerEmbed(animeDetails.trailer) } frameBorder="0"></iframe>
                        </div>
                    </Popup> : null }
                </motion.section>
            </>
        )
    }

    return render()
}

export default React.memo(AnimeDetailsAnilist)