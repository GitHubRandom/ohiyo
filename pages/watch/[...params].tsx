import { GetServerSideProps } from 'next'
import AnimeDetails from '../../components/AnimeDetails'
import RelatedContent from '../../components/RelatedContent'
import WatchTopBar from '../../components/WatchTopBar'
import EpisodePlayer from '../../components/EpisodePlayer'
import Navigation from '../../components/Navigation'
import WatchNavigation from '../../components/WatchNavigation'
import Head from 'next/head'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import tippy from 'tippy.js'

// From all of this I learned how shit is the Anime Slayer API. Just sayin'. @ritzy

export const getServerSideProps: GetServerSideProps = async (context) => {

    const queryParams = context.query.params
    const animeId = queryParams[0].slice(0,queryParams[0].indexOf("-"))

    /**
     * Make sure there is a from-episode query parameter if only animeId is specified
     * Redirect to first episode otherwise
     */
    if (queryParams.length < 2 && !context.query["from-episode"]) {
        context.res.writeHead(301, {
            Location: `/watch/${queryParams[0]}/1`
        })
        context.res.end()
        return
    }

    // Check if both parameters are strings & parameters do not exceed three
    if (queryParams.length >= 3 ||
        !Number.isNaN(parseInt(queryParams[0]))
    ) {
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
    } else if ( detailsFetch.status == 404 ) {
        return {
            notFound: true
        }
    }

    const plotFetch = await fetch("https://animeify.net/animeify/apis_v2/anime/series_desc.php", {
        method: "POST",
        headers,
        body: `AnimeID=x${animeId}&Language=AR`
    })
    
    if ( plotFetch.ok ) {
        const plotData = await plotFetch.json()
        if (plotData.Plot) props.details.synopsis = plotData.Plot
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
                return {
                    notFound: true
                }
            }
            props.episodeNumber = parseInt(queryParams[1])
        }
        if (props.details.type != "Movie" && props.details.type != "Special") {
            props.episodeName = `الحلقة ${episodesData[props.episodeNumber - 1].Episode}`
        } else {
            props.episodeName = "الفلم"
        }
    }


    return { props }
}

const Watch = ({ details, episodes, episodeNumber, episodeName }) => {

    const router = useRouter()

    useEffect(() => {
        window.scrollTo(0, 60)
    }, [episodeName])

    useEffect(() => {
        // Replace the current URL with "/anime_id/episode_number" if it's from episode_id
        console.log(episodeNumber)
        if (router.query.params[1] == "latest") {
            router.replace(`/watch/${details.anime_id}-${details.mal_id}/${episodeNumber}`, undefined, { shallow: true, scroll: false })
        }
    }, [episodeNumber])

    useEffect(() => {
        tippy("[data-tippy-content]")
    })

    return (
        <>
            <Head>
                <title>{ `${details.title} - ${episodeName}` }</title>
                <meta name="description" content={ `شاهد ${details.title} - ${episodeName} على Animayhem بجودة عالية` }/>
                <meta property="og:title" content={ `${details.title} على Animayhem` }/>
                <meta property="og:site_name" content="Animayhem"/>
                <meta property="og:url" content={ router.pathname } />
                <meta property="og:description" content={ details.anime_description } />
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
                <WatchNavigation />
                <Navigation trigger="#hamburger-menu" secondary={ true } selected="none" shown={false} />
                <div className="watch-page">
                    <WatchTopBar showEpisodeButton={ episodes.length > 1 } episodeName={ episodeName } animeTitle={ details.title } />
                    <EpisodePlayer mal={ details.mal_id } episodesList={ episodes } animeId={ details.anime_id } episodeNumber={ episodeNumber } />   
                    <AnimeDetails episodesList={ episodes } animeDetails={ details } />
                    {/*<RelatedContent related={ details.related_animes.data } />*/}
                </div>
            </div>
        </>
    )
}

export default Watch