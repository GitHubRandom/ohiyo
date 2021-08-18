const axios = require('axios')

/**
 * Opening themes fetcher via Jikan API
 */
export default async function handler(req, res) {
    const { mal } = req.query // MyAnimeList ID
    // Specify that response is JSON
    res.setHeader("Content-Type", "application/json")
    try {
        const jikanRequest = await axios({
            url: `https://api.jikan.moe/v3/anime/${mal}`
        })
        const { opening_themes } = await jikanRequest.data
        if (opening_themes) {
            // Send opening themes
            res.status(200).send(JSON.stringify({
                status: "success",
                openings: opening_themes
            }))    
        } else {
            res.status(404).send(JSON.stringify({
                status: "not-found",
                message: "The requested anime does not have opening info !"
            }))
        }
    } catch (err) {
        // Send server error if fetch failed
        res.status(500).send(JSON.stringify({
            status: "error",
            message: "Could not fetch opening themes !"
        }))
    }
}