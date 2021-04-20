const fetch = require("node-fetch")

const ANIME_DETAILS_ENDPOINT = "https://anslayer.com/anime/public/anime/get-anime-details"

exports.handler = async (event,_) => { 
    console.log(event)
    if (!event.headers["x-from"] || event.headers["x-from"] != "Netlify-Redirect" || ( event.headers['referer'] && event.headers['referer'].includes("bridged.cc") )) {
        return {
            statusCode: 401,
            body: "401 Unauthorized"
        }
    }
    let data
    try {
        let endpoint = ANIME_DETAILS_ENDPOINT
        if (event.queryStringParameters) {
            endpoint += "?" + new URLSearchParams(event.queryStringParameters).toString()
        }
        console.log(endpoint)
        let request = await fetch(endpoint, { 
            headers: {
                "Client-Id": process.env.REACT_APP_CLIENT_ID,
                "Client-Secret": process.env.REACT_APP_CLIENT_SECRET,
            }
        })
        data = await request.json()
        console.log(data)
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