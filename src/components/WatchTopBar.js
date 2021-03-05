const WatchTopBar = ({ episodeName, animeTitle }) => {
    return (
        <div className="top-bar">
            <h1 className="top-bar-anime-title">{ animeTitle }</h1>
            <p className="top-bar-episode-name">{ episodeName }</p>
        </div>
    )
}

export default WatchTopBar