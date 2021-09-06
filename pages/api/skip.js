const axios = require('axios')

export default async function handler(req, res) {
    const epNumber = parseInt(req.query.num)
    const epNameNumber = req.query.detail
    const malID = req.query.mal

    // Get anime name in MAL
    const jikanResponse = await axios({
        url: `https://api.jikan.moe/v3/anime/${malID}`,
        method: 'GET'
    })
    const animeName = jikanResponse.data.title
    if (!animeName) {
        return res.status(404).send("404 Anime Not Found")
    }

    const headers = {
        "Client-Id": "android-app2",
        "Client-Secret": "7befba6263cc14c90d2f1d6da2c5cf9b251bfbbd"
    }
    const searchJSON = {
        _offset: 0,
        _limit: 30,
        _order_by: "latest_first",
        list_type: "filter",
        anime_name: animeName,
        just_info: "Yes"
    }
    const animeIdFetch = await fetch('https://anslayer.com/anime/public/animes/get-published-animes?json=' + JSON.stringify(searchJSON), {
        headers
    })
    if (!animeIdFetch.ok) {
        return res.status(404).send("404 Anime Not Found")
    }
    const results = (await animeIdFetch.json()).response.data 
    const animeID = results?.find(item => item.anime_name == animeName)?.anime_id
    
    if (!animeID) {
        res.status(404).send("404 Anime Not Found")
        return
    }
    const episodesJSON = {
        more_info: "Yes",
        anime_id: animeID.toString()
    }
    const episodesFetch = await fetch('https://anslayer.com/anime/public/episodes/get-episodes?json=' + JSON.stringify(episodesJSON), {
        headers
    })
    if (!episodesFetch) {
        res.status(404).send("404 Episodes Not Found")
        return
    }
    try {
        let episodes = (await episodesFetch.json()).response?.data
        let sliceStart = epNumber < 20 ? 0 : epNumber - 20
        if (episodes.length > 20) {
            if (episodes.length < epNumber) {
                episodes = episodes.slice(sliceStart)
            } else {
                episodes = episodes.slice(sliceStart, epNumber + 20)
            }
        }
        const episode = episodes.find(ep => ep.episode_name.includes(epNameNumber))
        const { skip_from, skip_to } = episode
        res.status(200).send(JSON.stringify({ skip_from, skip_to }))   
        return 
    } catch (err) {
        console.error(err)
        res.status(404).send("404 Episode Not Found" )
        return
    }
}