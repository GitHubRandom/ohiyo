import { useEffect } from "react"
import Episode from "./Episode"

interface IContentList { 
    className: string,
    contentList: Record<string,any>[],
    latest: boolean
}

const ContentList = ({ className, contentList, latest }: IContentList) => {
    return (
        <div className={ className }>
            { contentList.map((episode,index) => {
                let episodeName = ""
                if (episode.AnimeData) {
                    episodeName = episode.EpisodeData.Episode
                    episode = episode.AnimeData
                }
                return <Episode key = { index }
                    animeName={ episode.Title }
                    showEpisodeName={ latest }
                    url={ latest ? `/watch/${episode.MainId.slice(1)}-${episode.JicanKey}/latest` : `/watch/${episode.MainId.slice(1)}-${episode.JicanKey}/1` }
                    cover={ episode.Type == "Movie" ? `https://animeify.net/animeify/files/thumbnails/movies/${episode.Thumbnail}` : `https://animeify.net/animeify/files/thumbnails/series/${episode.Thumbnail}` }
                    episodeName={ `الحلقة ${episodeName}` } />
            }) }
        </div>
    )
}

export default ContentList