import Episode from "./Episode"

interface IContentList { 
    className: string,
    contentList: Record<string,any>[],
    showEpisodeName: boolean
}

const ContentList = ({ className, contentList, showEpisodeName }: IContentList) => {
    return (
        <div className={ className }>
            { contentList.map((episode,index) => {
                return <Episode key = { index }
                    showEpisodeName = { showEpisodeName }
                    animeName = {episode["anime_name"]}
                    url={ showEpisodeName ? `/${episode["anime_id"]}?from-episode=${episode["latest_episode_id"]}` : '/' + episode["anime_id"] + '/1' }
                    cover = {episode["anime_cover_image_url"]}
                    episodeName = {episode["latest_episode_name"]} />
            }) }
        </div>
    )
}

export default ContentList