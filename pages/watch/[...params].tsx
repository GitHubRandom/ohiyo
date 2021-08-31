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
import axios, { AxiosError, AxiosRequestConfig, CancelTokenSource } from 'axios'
import { getTrailerEmbed } from '../../utils/Formatters'

// From all of this I learned how shit is the Anime Slayer's & Animeify's APIs. Just sayin'. @ritzy

export const getServerSideProps: GetServerSideProps = async context => {

    const queryParams = context.query.params
    const animeID = queryParams[0].slice(0,queryParams[0].indexOf("-"))
    const malID = queryParams[0].slice(queryParams[0].indexOf('-') + 1)
    const eID = queryParams.length == 1 ? context.query.eId : undefined

    /**
     * Redirect to first episode if no episode is specified
     */
    if (queryParams.length < 2 && !eID) {
        context.res.writeHead(301,{
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
    if ((!parseInt(queryParams[1]) && !eID) || queryParams.length >= 3) {
        return {
            notFound: true
        }
    }

    const props: Record<string,any> = {}
    const headers = new Headers({
        "Content-Type": "application/x-www-form-urlencoded"
    })

    // Get details from Anilist.co API
    const query = `
        query ($id: Int) {
            Media (idMal: $id, type: ANIME) {
                idMal
                coverImage {
                    large
                }
                title {
                    romaji
                    english
                }
                format
                seasonYear
                episodes
                genres
                studios(isMain: true) {
                    nodes {
                        name
                    }
                }
                status
                source
                trailer {
                    id
                    site
                }
                averageScore
                isAdult
                streamingEpisodes {
                    title
                }
            }
        }
    `;

    const variables = {
        id: malID
    };

    const url = 'https://graphql.anilist.co',
        options: AxiosRequestConfig = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            data: JSON.stringify({
                query: query,
                variables: variables
            })
        };
        
    try {
        const detailsFetch = await axios({
            url,
            ...options
        })
        const detailsData = (await detailsFetch.data).data.Media
        detailsData.animeID = animeID
        props.details = detailsData
    } catch (error) {
        // Return 404 if info is not found
        if (error.response && error.response.status == 404) {
            console.log("Details not found !")
            return {
                notFound: true
            }
        } else {
            // Throw server error if 
            console.log(error.toJSON())
            throw Error("Couldn't fetch details of anime !")
        }
    }

    let movie = false
    let episodesFetch: Response
    episodesFetch = await fetch("https://animeify.net/animeify/apis_v2/episodes/episodes_loader.php", {
        method: "POST",
        headers,
        body: `AnimeID=x${animeID}`
    })

    let episodesData
    if (episodesFetch.ok) {
        episodesData = await episodesFetch.json()
        // Parse eId
        if (eID && episodesData.length) {
            const eNumByEId = episodesData.findIndex(episode => episode.eId == eID) + 1
            props.toReplace = eNumByEId
        }
    }

    // Check if it's not a movie. Fetch the other endpoint if it's the case
    if (!Array.isArray(episodesData) || !episodesData.length) {
        movie = true
        episodesFetch = await fetch("https://animeify.net/animeify/apis_v2/servers/movie_links.php", {
            method: "POST",
            headers,
            body: `MovieId=x${animeID}&Part=0` 
        })    
    }

    const plotEndpoint = movie ?
        "https://animeify.net/animeify/apis_v2/movies/movies_desc.php"
        : "https://animeify.net/animeify/apis_v2/anime/series_desc.php"
    const plotFetch = await fetch(plotEndpoint, {
        method: "POST",
        headers,
        body: `AnimeID=x${animeID}&Language=AR`
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
        if (queryParams[1] && queryParams[1] == "latest") {
            props.episodeNumber = episodesData.length 
        } else if (eID) {
            props.episodeNumber = props.toReplace
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
    const [ currentEpisodeTitle, updateCurrentEpisodeTitle ] = useState<string>("")
    const [ openingThemes, updateOpeningThemes ] = useState<string[]>([])
    const skipFetchToken = useRef<CancelTokenSource>()
    const titleFetchToken = useRef<CancelTokenSource>()
    const hamburgerButton = useRef()

    const handleBack = (url: string) => {
        // Router handler to fix the back stack
        const splittedPath = url.split("/")
        if (url.includes("?eId=")) {
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
        // Fetch opening themes
        axios({
            url: `/api/openings?mal=${details.idMal}`
        }).then(response => {
            updateOpeningThemes(response.data.openings)
        }).catch(_ => {
            console.error("Could not get openings info !")
        })
        // Fix for back action
        router.events.on("routeChangeComplete", handleBack)
        return () => {
            router.events.off("routeChangeComplete", handleBack)
        } 
    }, [])

    useEffect(() => {
        window.scrollTo(0,60) // Scroll to video
        // Update link (shallow) and episode object
        router.push(`/watch/${details.animeID}-${details.idMal}/${currentEpisodeNumber}`, undefined, { shallow: true, scroll: false })
        // Update current epsiode from episode list
        const newCurrentEpisode = episodes[currentEpisodeNumber - 1]
        newCurrentEpisode.Title = details.title.romaji
        updateCurrentEpisode(newCurrentEpisode)
        // Cancel intro interval fetch if any
        try {
            if (skipFetchToken.current) {
                skipFetchToken.current.cancel()
            }    
        } catch (err) {}
        // Cancel title fetch if any
        try {
            if (titleFetchToken.current) {
                titleFetchToken.current.cancel()
            }    
        } catch (err) {}

        // Clean effect
        return () => {
            updateCurrentEpisode({})
        }
    }, [currentEpisodeNumber])

    useEffect(() => {
        // Replace the current URL with "/<anime_id>/episode_number"
        if (router.query.params[1] == "latest") {
            router.replace(`/watch/${details.animeID}-${details.idMal}/${episodeNumber}`, undefined, { shallow: true, scroll: false })
        }
    }, [])

    useEffect(() => {

        // Fetching intro timestamps
        skipFetchToken.current = axios.CancelToken.source()
        axios({
            url: encodeURI(`/api/skip?mal=${details.idMal}&num=${currentEpisodeNumber}&detail=${currentEpisode.Episode}`),
            cancelToken: skipFetchToken.current.token
        })
        .then(response => {
            const { skip_from, skip_to } = response.data
            updateCurrentIntroInterval([parseInt(skip_from) / 1000, parseInt(skip_to) / 1000])
        })
        .catch(_ => {
            console.info("Timestamps not found !")
        })

        // Fetching episode title
        titleFetchToken.current = axios.CancelToken.source()
        axios({
            url: "https://api.jikan.moe/v3/anime/" + details.idMal + "/episodes/" + Math.ceil(parseInt(currentEpisode.Episode) / 100),
            cancelToken: titleFetchToken.current.token
        })
        .then(response => {
            let epData = response.data.episodes.find((ep: Record<string,any>) => ep.episode_id == parseInt(currentEpisode.Episode))
            updateCurrentEpisodeTitle(epData.title)
        }).catch(_ => {
            console.info("Couldn't fetch episode title !")
        })

        // Cleaning effect
        return () => {
            updateCurrentIntroInterval([0,0])
            updateCurrentEpisodeTitle("")
        }
    }, [currentEpisode])

    return (
        <>
            <Head>
                <meta name="description" content={ `شاهد ${details.title.romaji || details.title.english} على Animayhem بجودة عالية` }/>
                <meta property="og:title" content={ `${details.title.romaji || details.title.english} على Animayhem` }/>
                <meta property="og:site_name" content="Animayhem"/>
                <meta property="og:url" content={ "https://animayhem.ga" + router.asPath } />
                <meta property="og:description" content={ details.synopsis } />
                <meta property="og:type" content={ details.format == "MOVIE" ? "video.movie" : "video.episode" } />
                <meta property="og:image" content={ details.coverImage.large } />
                { details.trailer ? <meta property="og:video" content={ getTrailerEmbed(details.trailer) } /> : null }
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
                        type={ details.format }
                        setEpisodeNumber={ updateCurrentEpisodeNumber }
                        episodeTitle={ currentEpisodeTitle }
                        episodesList={ episodes }
                        episodeNumber={ currentEpisodeNumber }
                        animeTitle={ details.title.romaji || details.title.english }
                        // Anilist native version of title
                        altTitle={ details.title.english || "" } />

                    <EpisodePlayer
                        openingsInfo={ openingThemes } // TODO: Reimplement openings
                        changeEpisodeNumber={ (increment: boolean) => updateCurrentEpisodeNumber(oldEpisodeNumber => increment ? oldEpisodeNumber + 1 : oldEpisodeNumber - 1) }
                        episode={ currentEpisode }
                        introInterval={ currentIntroInterval }
                        episodeTitle={ currentEpisodeTitle }
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