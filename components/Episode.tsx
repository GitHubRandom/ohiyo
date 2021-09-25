import Link from "next/link"
import React from "react"

interface TEpisode {
    url: string,
    cover: string,
    showEpisodeName: boolean,
    episodeName?: string,
    animeName: string
}

const Episode = ({ url, cover, showEpisodeName, episodeName, animeName }: TEpisode) => {
    return (
        <Link prefetch={ false } href={ url }>
            <a title={ animeName } className="content">
                <div style={{ backgroundImage: 'url(' + cover + ')' }} className="anime-cover">
                    { showEpisodeName &&
                    <p className="anime-episode-name">{ episodeName }</p> }
                </div>
                <h4 dir="ltr" className="anime-title">{ animeName }</h4>
            </a>
        </Link>
    )
}

export default Episode