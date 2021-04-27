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

    console.log(context)
    const queryParams = context.query.params
    const animeId = queryParams[0]

    /**
     * Make sure there is a from-episode query parameter if only animeId is specified
     * Redirect to first episode otherwise
     */
    if (queryParams.length < 2 && !context.query["from-episode"]) {
        context.res.writeHead(301, {
            Location: `/watch/${animeId}/1`
        })
        context.res.end()
        return
    }

    // Check if both parameters are strings & parameters do not exceed three
    if (queryParams.length >= 3 ||
        Number.isNaN(parseInt(queryParams[0])) ||
        ( queryParams.length == 2 && Number.isNaN(parseInt(queryParams[1])) )
    ) {
        return {
            notFound: true
        }
    }

    const headers = new Headers({
        "Client-Id": process.env.CLIENT_ID,
        "Client-Secret": process.env.CLIENT_SECRET
    })
    const detailsFetch = await fetch(`https://anslayer.com/anime/public/anime/get-anime-details?anime_id=${animeId}&fetch_episodes=No&more_info=Yes`, { headers })

    const episodesFetch = await fetch(`https://anslayer.com/anime/public/episodes/get-episodes?json={"more_info": "Yes","anime_id":${animeId}}`, { headers })
    const episodesData = await episodesFetch.json()

    let props: Record<string,any> = {}

    if ( detailsFetch.ok ) {
        const detailsData = await detailsFetch.json()
        props = {
            details: detailsData.response,
            soon: detailsData.response.anime_status && detailsData.response.anime_status == "Not Yet Aired"
        }
    } else if ( detailsFetch.status == 404 ) {
        return {
            notFound: true
        }
    }

    // Check the response if there is any episodes available
    if ( episodesFetch.ok ) {
        props["episodes"] = episodesData.response.data
    } else {
        props["episodes"] = [] // Set to empty list if no episodes
        if (props.soon) {
            props["episodeName"] = "قريبا" // If the anime is not yet aired
        }
    }

    // Check if the request contains episode ID
    if ( props.episodes.length && queryParams.length == 1 && context.query["from-episode"] ) {
        const from = context.query["from-episode"]
        const episodeFetch = await fetch(`https://anslayer.com/anime/public/episodes/get-episodes?json={"more_info": "Yes","anime_id":${animeId},"episode_id":${from}}`, { headers })
        const episodeData = await episodeFetch.json()
        const episode = episodeData.response.data[0]
        if ( !(episodeData.status) ) { // Check if it's a valid response
            props = {
                ...props, 
                episode,
                episodeNumber: episode.episode_number,
                episodeName: episode.episode_name
            }    
        }
    } else if ( props.episodes.length && queryParams.length == 2) {
        const eNum = queryParams[1]
        props = {
            ...props,
            episodeNumber: eNum,
            episodeName: props.episodes[parseInt(eNum) - 1].episode_name
        }
    }

    return { props }
}

const Watch = ({ details, episodes, episode, soon, episodeNumber, episodeName }) => {

    const router = useRouter()

    useEffect(() => {
        window.scrollTo(0, 60)
    }, [episodeName])

    useEffect(() => {
        // Replace the current URL with "/anime_id/episode_number" if it's from episode_id
        if (episode) {
            router.replace(`/watch/${details.anime_id}/${episode.episode_number}`, undefined, { shallow: true, scroll: false })
        }
    }, [episode])

    useEffect(() => {
        tippy("[data-tippy-content]")
    })

    return (
        <>
            <Head>
                <title>{ `${details.anime_name} - ${episodeName}` }</title>
                <meta name="description" content={ `شاهد ${details.anime_name} - ${episodeName} على Animayhem بجودة عالية` }/>
                <meta property="og:title" content={ `${details.anime_name} على Animayhem` }/>
                <meta property="og:site_name" content="Animayhem"/>
                <meta property="og:url" content={ router.pathname } />
                <meta property="og:description" content={ details.anime_description } />
                <meta property="og:type" content={ details.anime_type == "Movie" ? "video.movie" : "video.episode" } />
                <meta property="og:image" content={ details.anime_cover_image_url } />
                { details.more_info_result && details.more_info_result.trailer_url ? <meta property="og:video" content={ details.more_info_result.trailer_url } /> : null }
            </Head>
            <div id="watch" className="menu-content">
                <WatchNavigation />
                <Navigation trigger="#hamburger-menu" secondary={ true } selected="none" shown={false} />
                <div className="watch-page">
                    <WatchTopBar showEpisodeButton={ episodes.length > 1 } episodeName={ episodeName } animeTitle={ details.anime_name } />
                    <EpisodePlayer soon={ soon } fromEpisode={ episode ? true : false } episode={ episode } episodesList={ episodes } animeId={ details.anime_id } episodeNumber={ episodeNumber } />
                    <AnimeDetails episodesList={ episodes } animeDetails={ details } />
                    <RelatedContent related={ details.related_animes.data } />
                </div>
            </div>
        </>
    )
}

export default Watch