import { Link } from "react-router-dom"

interface TEpisode {
    url: string,
    cover: string,
    showEpisodeName: boolean,
    episodeName?: string,
    animeName: string
}

const Episode = (props: TEpisode) => {
    return (
        <Link to={ props.url } className="content">
            <div style={{ backgroundImage: 'url(' + props.cover + ')' }} className="anime-cover">
                { props.showEpisodeName ?
                <p className="anime-episode-name">{ props.episodeName }</p> : null}
            </div>
            <h4 dir="ltr" className="anime-title">{ props.animeName }</h4>
        </Link>
    )
}

export default Episode