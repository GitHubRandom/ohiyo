const fetch = require("node-fetch")

const FETCH_ANIME_ENDPOINT = "https://anslayer.com/anime/public/animes/get-published-animes"
const EPISODES_ENDPOINT = "https://anslayer.com/anime/public/episodes/get-episodes"

exports.handler = async (event, context) => { 
    console.log(event)
    if (!event.headers["x-from"] ||
        event.headers["x-from"] != "Netlify-Redirect" ||
        ( event.headers['referer'] && event.headers['referer'].includes("bridged.cc") ) ||
        ( event.headers['sec-fetch-site'] && event.headers['sec-fetch-site'] == "cross-site" )) {
        return {
            statusCode: 401,
            body: "401 Unauthorized"
        }
    }
    let data
    try {
        let endpoint = FETCH_ANIME_ENDPOINT
        if (event.queryStringParameters.mode && event.queryStringParameters.mode == "episodes") {
            endpoint = EPISODES_ENDPOINT
        }
        let request = await fetch(endpoint + "?json=" + event.queryStringParameters.json, { 
            headers: {
                "Client-Id": process.env.REACT_APP_CLIENT_ID,
                "Client-Secret": process.env.REACT_APP_CLIENT_SECRET,
            }
        })
        data = await request.json()
    } catch (error) {
        return {
            statusCode: 500,
            body: error.toString()
        }
    }
    return {
        statusCode: 200,
        body: JSON.stringify(data)
    }
}