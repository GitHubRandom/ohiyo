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

export const getServerSideProps: GetServerSideProps = async (context) => {
    console.log(context)
    const animeId = context.query.params[0]
    const headers = new Headers({
        "Client-Id": "web-app",
        "Client-Secret": "90b63e11b9b4634f124df024516id495ab749c6b"
    })
    const detailsFetch = await fetch(`https://anslayer.com/anime/public/anime/get-anime-details?anime_id=${animeId}&fetch_episodes=No&more_info=Yes`, { headers })
    const detailsData = await detailsFetch.json()

    const episodesFetch = await fetch(`https://anslayer.com/anime/public/episodes/get-episodes?json={"more_info": "Yes","anime_id":${animeId}}`, { headers })
    const episodesData = await episodesFetch.json()

    let props: Record<string,any> = {}

    if ( detailsFetch.ok ) {
        props = {
            details: detailsData.response,
            soon: detailsData.response.anime_status && detailsData.response.anime_status == "Not Yet Aired"
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
    if ( props.episodes.length && context.query.params.length == 1 && context.query["from-episode"] ) {
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
    } else if ( props.episodes.length && context.query.params.length == 2) {
        const eNum = context.query.params[1]
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