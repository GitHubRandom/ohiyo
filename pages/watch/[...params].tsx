import { GetServerSideProps } from 'next'
import AnimeDetails from '../../components/AnimeDetails'
import WatchTopBar from '../../components/WatchTopBar'
import EpisodePlayer from '../../components/EpisodePlayer'
import Navigation from '../../components/Navigation'
import WatchNavigation from '../../components/WatchNavigation'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import tippy from 'tippy.js'
import { useRef } from 'react'
import WatchFooter from '../../components/WatchFooter'

// From all of this I learned how shit is the Anime Slayer API. Just sayin'. @ritzy

export const getServerSideProps: GetServerSideProps = async (context) => {

    const queryParams = context.query.params
    const animeId = queryParams[0].slice(0,queryParams[0].indexOf("-"))

    /**
     * Make sure there is a from-episode query parameter if only animeId is specified
     * Redirect to first episode otherwise
     */
    if (queryParams.length < 2) {
        context.res.writeHead(301, {
            Location: `/watch/${queryParams[0]}/1`
        })
        context.res.end()
        return
    }

    // Check if both parameters are strings & parameters do not exceed three
    if (queryParams.length >= 3) {
        return {
            notFound: true
        }
    }

    if (isNaN(parseInt(queryParams[1])) && queryParams[1] != "latest") {
        return {
            notFound: true
        }
    }

    let props: Record<string,any> = {}
    const headers = new Headers({
        "Content-Type": "application/x-www-form-urlencoded"
    })

    const detailsFetch = await fetch(`https://api.jikan.moe/v3/anime/${queryParams[0].slice(queryParams[0].indexOf('-') + 1)}`)

    if ( detailsFetch.ok ) {
        const detailsData = await detailsFetch.json()
        detailsData.anime_id = animeId
        props.details = detailsData
        console.log("Details found !")
    } else if ( detailsFetch.status == 404 ) {
        console.log("Details not found !")
        return {
            notFound: true
        }
    }

    let movie = false
    let episodesFetch: Response
    episodesFetch = await fetch("https://animeify.net/animeify/apis_v2/episodes/episodes_loader.php", {
        method: "POST",
        headers,
        body: `AnimeID=x${animeId}`
    })

    let episodesData
    if (episodesFetch.ok) {
        episodesData = await episodesFetch.json()
    }

    // Check if it's not a movie. Fetch the other endpoint if it's the case
    if (!Array.isArray(episodesData) || !episodesData.length) {
        movie = true
        episodesFetch = await fetch("https://animeify.net/animeify/apis_v2/servers/movie_links.php", {
            method: "POST",
            headers,
            body: `MovieId=x${animeId}&Part=0`
        })    
    }

    let plotEndpoint = "https://animeify.net/animeify/apis_v2/anime/series_desc.php"
    if (movie) plotEndpoint = "https://animeify.net/animeify/apis_v2/movies/movies_desc.php"
    const plotFetch = await fetch(plotEndpoint, {
        method: "POST",
        headers,
        body: `AnimeID=x${animeId}&Language=AR`
    })
    
    if ( plotFetch.ok ) {
        const plotData = await plotFetch.json()
        if (plotData.Plot) props.details.synopsis = plotData.Plot
    }

    if (episodesFetch.ok) {
        if (movie) {
            episodesData = await episodesFetch.json()
        }
        if (!Array.isArray(episodesData)) {
            episodesData = [episodesData]
        }
        props.episodes = episodesData
        if (queryParams[1] == "latest") {
            props.episodeNumber = episodesData.length 
        } else {
            if (parseInt(queryParams[1]) > episodesData.length) {
                console.log("Episode not found !")
                return {
                    notFound: true
                }
            }
            props.episodeNumber = parseInt(queryParams[1])
        }
    }

    return { props }
}

const Watch = ({ details, episodes, episodeNumber }) => {

    const router = useRouter()
    const [ currentEpisodeNumber, updateCurrentEpisodeNumber ] = useState<number>(episodeNumber)
    const [ currentEpisode, updateCurrentEpisode ] = useState<Record<string,any>>(episodes[episodeNumber - 1])
    const [ currentIntroInterval, updateCurrentIntroInterval ] = useState<[number,number]>([0,0])
    const skipFetchController = useRef<AbortController>()
    const titleFetchController = useRef<AbortController>()
    const hamburgerButton = useRef()

    function handleBack(url:string) {
        // Router handler to fix the back stack
        updateCurrentEpisodeNumber(oldEpisodeNumber => {
            let splittedPath = url.split("/")
            if (splittedPath[3] == "latest") {
                router.back()
                return oldEpisodeNumber
            }
            if (parseInt(splittedPath[3]) != oldEpisodeNumber) {
                return parseInt(splittedPath[3])
            } else {
                return oldEpisodeNumber
            }
        })
    }

    useEffect(() => {
        tippy("[data-tippy-content]")
        router.events.on("routeChangeComplete", handleBack)
        return () => {
            router.events.off("routeChangeComplete", handleBack)
        } 
    },[])

    useEffect(() => {
        // Update link (shallow) and episode object
        window.scrollTo(0, 60) // Return to video
        router.push(`/watch/${details.anime_id}-${details.mal_id}/${currentEpisodeNumber}`, undefined, { shallow: true, scroll: false })
        let newCurrentEpisode = episodes[currentEpisodeNumber - 1]
        updateCurrentEpisode(newCurrentEpisode)
        try {
            if (skipFetchController.current) {
                skipFetchController.current.abort()
            }    
        } catch (err) {}
        try {
            if (titleFetchController.current) {
                titleFetchController.current.abort()
            }
        } catch (err) {}
    }, [currentEpisodeNumber])

    useEffect(() => {
        // Replace the current URL with "/anime_id/episode_number"
        if (router.query.params[1] == "latest") {
            router.replace(`/watch/${details.anime_id}-${details.mal_id}/${episodeNumber}`, undefined, { shallow: true, scroll: false })
        }
    }, [episodeNumber])

    useEffect(() => {
        // Fetching intro timestamps
        const introController = new AbortController()
        skipFetchController.current = introController
        fetch(encodeURI(`/api/skip?anime=${details.title}&num=${currentEpisodeNumber}&detail=${currentEpisode.Episode}`), { signal: introController.signal })
            .then(res => {
                if (res.ok) {
                    return res.json()
                } else {
                    throw new Error("Timestamps not found")
                }
            })
            .then(data => {
                updateCurrentIntroInterval([parseInt(data.skip_from) / 1000, parseInt(data.skip_to) / 1000])
            })
            .catch(err => {
                console.info("Timestamps not found !")
            })
        return () => {
            updateCurrentIntroInterval([0,0])
        }
    }, [currentEpisode])

    return (
        <>
            <Head>
                <meta name="description" content={ `شاهد ${details.title} على Animayhem بجودة عالية` }/>
                <meta property="og:title" content={ `${details.title} على Animayhem` }/>
                <meta property="og:site_name" content="Animayhem"/>
                <meta property="og:url" content={ "https://animayhem.ga" + router.asPath } />
                <meta property="og:description" content={ details.synopsis } />
                <meta property="og:type" content={ details.type == "Movie" ? "video.movie" : "video.episode" } />
                <meta property="og:image" content={ details.image_url } />
                { details.trailer_url ? <meta property="og:video" content={ details.trailer_url } /> : null }
                <style jsx>{`
                    html {
                        scroll-behavior: smooth;
                    }
                `}</style>
            </Head>
            <div id="watch" className="menu-content">
                <WatchNavigation hamburgerButtonRef={ hamburgerButton } />
                <Navigation trigger={ hamburgerButton } secondary={ true } selected="none" shown={ false } />
                <div className="watch-page">
                    <WatchTopBar
                        type={ details.type }
                        setEpisodeNumber={ updateCurrentEpisodeNumber }
                        mal={ details.mal_id }
                        episodesList={ episodes }
                        episodeNumber={ currentEpisodeNumber }
                        animeTitle={ details.title }
                        // Use english title as altTitle. Check if title_english is present in API response, and use title_synonyms if not.
                        altTitle={ details.title_english ? details.title_english : ( details.title_synonyms && details.title_synonyms[0] ? details.title_synonyms[0] : "" ) } />

                    <EpisodePlayer 
                        changeEpisodeNumber={ (increment: boolean) => updateCurrentEpisodeNumber(oldEpisodeNumber => increment ? oldEpisodeNumber + 1 : oldEpisodeNumber - 1) }
                        episode={ currentEpisode }
                        introInterval={ currentIntroInterval }
                        firstEpisode={ currentEpisodeNumber == 1 }
                        lastEpisode={ currentEpisodeNumber == episodes.length } />   

                    <AnimeDetails animeDetails={ details } />
                    {/*<RelatedContent related={ details.related_animes.data } />*/}
                </div>
                <WatchFooter />
            </div>
        </>
    )    

}

export default React.memo(Watch)