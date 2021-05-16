import Episode from "./Episode"
import React from "react"

interface IContentList { 
    className: string,
    contentList: Record<string,any>[],
    latest: boolean,
    overrideMovie?: boolean
}

const ContentList = ({ overrideMovie, className, contentList, latest }: IContentList) => {
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
                    cover={ episode.Type != "Movie" && !overrideMovie ? `https://animeify.net/animeify/files/thumbnails/series/${episode.Thumbnail}` : `https://animeify.net/animeify/files/thumbnails/movies/${episode.Thumbnail}` }
                    episodeName={ `الحلقة ${episodeName}` } />
            }) }
        </div>
    )
}

export default React.memo(ContentList)