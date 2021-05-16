import Link from "next/link"
import React from "react"

interface TEpisode {
    url: string,
    cover: string,
    showEpisodeName: boolean,
    episodeName?: string,
    animeName: string
}

const Episode = (props: TEpisode) => {
    return (
        <Link prefetch={ false } href={ props.url }>
            <a title={ props.animeName } className="content">
                <div style={{ backgroundImage: 'url(' + props.cover + ')' }} className="anime-cover">
                    { props.showEpisodeName ?
                    <p className="anime-episode-name">{ props.episodeName }</p> : null}
                </div>
                <h4 dir="ltr" className="anime-title">{ props.animeName }</h4>
            </a>
        </Link>
    )
}

export default Episode