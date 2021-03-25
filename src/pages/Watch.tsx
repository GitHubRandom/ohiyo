import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import AnimeDetails from "../components/AnimeDetails"
import EpisodePlayer from "../components/EpisodePlayer"
import WatchTopBar from "../components/WatchTopBar"
import tippy from 'tippy.js'
import RelatedContent from "../components/RelatedContent"
import WatchNavigation from "../components/WatchNavigation"
import Navigation from "../components/Navigation"

const Watch = ({ fromEpisode }: { fromEpisode: string | null }) => {
    const { aId, eNum } = useParams<{ aId: string, eNum: string | undefined }>()
    const [ episode, updateEpisode ] = useState<Record<string,any>>({})
    const [ animeTitle, updateTitle ] = useState<string>("")
    const [ episodeName, updateName ] = useState<string>("")
    const [ episodesList, updateList ] = useState<Record<string,any>[]>([])
    const [ relatedContent, updateRelated ] = useState<Record<string,any>[]>([])
    const [ sideMenu, updateSideMenu ] = useState<boolean>(false)

    useEffect(() => {
        window.scrollTo(0,60)
    }, [aId,eNum])
    
    useEffect(() => {
        if (fromEpisode) {
            var params = {
                more_info: "Yes",
                anime_id: aId,
                episode_id: fromEpisode
            }
            fetch(encodeURI(`https://cors.bridged.cc/https://anslayer.com/anime/public/episodes/get-episodes?json=${JSON.stringify(params)}`), {
                headers: new Headers({
                    "Client-Id": process.env.REACT_APP_CLIENT_ID,
                    "Client-Secret": process.env.REACT_APP_CLIENT_SECRET
                } as HeadersInit)
            })
            .then((response) => { return response.json() })
            .then((data) => {
                if (data && data["response"] && data["response"]["data"]) {
                    var response = data["response"]["data"]
                    var episode = response[0]
                    updateEpisode(episode)
                    window.history.replaceState(null, "", window.location.protocol + "//" + window.location.host + "/" + aId + "/" + episode["episode_number"])
                }
            })
        }
        const controller = new AbortController()
        const signal = controller.signal        
        fetch('https://cors.bridged.cc/https://anslayer.com/anime/public/episodes/get-episodes?json=%7B"more_info":"Yes","anime_id":' + aId + '%7D', {headers: new Headers({
            "Client-Id": process.env.REACT_APP_CLIENT_ID,
            "Client-Secret": process.env.REACT_APP_CLIENT_SECRET
        } as HeadersInit), signal: signal})
        .then((response) => { return response.json() })
        .then((data) => {
            updateList(data["response"]["data"])
        })
        return () => {
            try { controller.abort() } catch (error) {}
            updateTitle("")
            updateName("")
            updateRelated([])
            updateList([])
        }
    }, [aId])

    const setMenus = () => {
        if (window.innerWidth <= 1065) {
            updateSideMenu(true)    
        } else {
            updateSideMenu(false)
        }
    }

    useEffect(() => {
        setMenus()
        window.onresize = () => setMenus()
    },[])

    return (
        <>
        <WatchNavigation shrink={ sideMenu } />
        { sideMenu ? 
        <Navigation trigger="#hamburger-menu" selected="none" shown={ false } /> : null }
        <div className="watch-page">
            <WatchTopBar showEpisodeButton={ episodesList.length > 1 } episodeName={ episodeName } animeTitle={ animeTitle } />
            <EpisodePlayer fromEpisode={ fromEpisode ? true : false } episode={ episode } episodesList={ episodesList } setEpisodeName={ (episodeName) => updateName(episodeName) } animeId={ aId } episodeNumber={ eNum ? eNum : episode["episode_number"] } />
            <AnimeDetails episodesList={ episodesList } setRelated={ (related: Record<string,any>[]) => updateRelated(related) } setTitle={ (animeTitle) => updateTitle(animeTitle) } animeId={ aId } />
            <RelatedContent related={ relatedContent } />
        </div>
        </>
    )
}

export default Watch