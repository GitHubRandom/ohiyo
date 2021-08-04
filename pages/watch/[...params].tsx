import { GetServerSideProps } from 'next'
import AnimeDetails from '../../components/AnimeDetails'
import WatchTopBar from '../../components/WatchTopBar'
import EpisodePlayer from '../../components/EpisodePlayer'
import Navigation from '../../components/Navigation'
import WatchNavigation from '../../components/WatchNavigation'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useRef } from 'react'
import WatchFooter from '../../components/WatchFooter'
import axios, { CancelTokenSource } from 'axios'

// From all of this I learned how shit is the Anime Slayer's & Animeify's APIs. Just sayin'. @ritzy

export const getServerSideProps: GetServerSideProps = async context => {

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

    /**
     * Make sure that the path is valid : 
     *      /watch/<anime_id>-<mal>/<episode_number>
     *  or  /watch/<anime_id>-<mal>/latest
     */
    if ((!parseInt(queryParams[1]) && queryParams[1] != "latest") || queryParams.length >= 3) {
        return {
            notFound: true
        }
    }

    let props: Record<string,any> = {}
    const headers = new Headers({
        "Content-Type": "application/x-www-form-urlencoded"
    })

    // Get details from MyAnimeList via Jikan
    const detailsFetch = await fetch(`https://api.jikan.moe/v3/anime/${queryParams[0].slice(queryParams[0].indexOf('-') + 1)}`)
    if (detailsFetch.ok) {
        const detailsData = await detailsFetch.json()
        detailsData.anime_id = animeId
        props.details = detailsData
        console.log("Details found !")
    } else if (detailsFetch.status == 404) {
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

    const plotEndpoint = movie ?
        "https://animeify.net/animeify/apis_v2/movies/movies_desc.php"
        : "https://animeify.net/animeify/apis_v2/anime/series_desc.php"
    const plotFetch = await fetch(plotEndpoint, {
        method: "POST",
        headers,
        body: `AnimeID=x${animeId}&Language=AR`
    })
    
    if (plotFetch.ok) {
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
    const skipFetchController = useRef<CancelTokenSource>()
    const hamburgerButton = useRef()

    function handleBack(url: string) {
        // Router handler to fix the back stack
        let splittedPath = url.split("/")
        if (splittedPath[3] == "latest") {
            router.back()
            return
        }
        updateCurrentEpisodeNumber(oldEpisodeNumber => {
            if (parseInt(splittedPath[3]) != oldEpisodeNumber) {
                return parseInt(splittedPath[3])
            } else {
                return oldEpisodeNumber
            }
        })
    }

    useEffect(() => {
        router.events.on("routeChangeComplete", handleBack)
        return () => {
            router.events.off("routeChangeComplete", handleBack)
        } 
    },[])

    useEffect(() => {
        window.scrollTo(0,60) // Scroll to video
        // Update link (shallow) and episode object
        router.push(`/watch/${details.anime_id}-${details.mal_id}/${currentEpisodeNumber}`, undefined, { shallow: true, scroll: false })
        // Update current epsiode from episode list
        updateCurrentEpisode(episodes[currentEpisodeNumber - 1])
        // Cancel intro interval fetch if any
        try {
            if (skipFetchController.current) {
                skipFetchController.current.cancel()
            }    
        } catch (err) {}
        return () => {
            updateCurrentEpisode({})
        }
    }, [currentEpisodeNumber])

    useEffect(() => {
        // Replace the current URL with "/anime_id/episode_number"
        if (router.query.params[1] == "latest") {
            router.replace(`/watch/${details.anime_id}-${details.mal_id}/${episodeNumber}`, undefined, { shallow: true, scroll: false })
        }
    }, [])

    useEffect(() => {
        // Fetching intro timestamps
        skipFetchController.current = axios.CancelToken.source()
        axios({
            url: encodeURI(`/api/skip?anime=${details.title}&num=${currentEpisodeNumber}&detail=${currentEpisode.Episode}`),
            cancelToken: skipFetchController.current.token
        })
        .then(response => {
            const { skip_from, skip_to } = response.data
            updateCurrentIntroInterval([parseInt(skip_from) / 1000, parseInt(skip_to) / 1000])
        })
        .catch(_ => {
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
                        openingsInfo={ details.opening_themes }
                        changeEpisodeNumber={ (increment: boolean) => updateCurrentEpisodeNumber(oldEpisodeNumber => increment ? oldEpisodeNumber + 1 : oldEpisodeNumber - 1) }
                        episode={ currentEpisode }
                        introInterval={ currentIntroInterval }
                        firstEpisode={ currentEpisodeNumber == 1 }
                        lastEpisode={ currentEpisodeNumber == episodes.length } />   

                    <AnimeDetails animeDetails={ details } />
                </div>
                <WatchFooter />
            </div>
        </>
    )    

}

export default React.memo(Watch)