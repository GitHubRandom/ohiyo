const Episode = (props) => {
    return (
        <a href={ props.url } className="content">
             
            <div style={{ backgroundImage: 'url(' + props.cover + ')' }} className="anime-cover">
                { props.showEpisodeName ?
                <p className="anime-episode-name">{ props.episodeName }</p> : null}
            </div>
            <h4 dir="ltr" className="anime-title">{ props.animeName }</h4>
        </a>
    )
}

export default Episode