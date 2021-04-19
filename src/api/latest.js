exports.handler = async (event, context) => { 
    try {
        var request = await fetch("https://cors.bridged.cc/https://anslayer.com/anime/public/animes/get-published-animes?json=" + JSON.stringify({
                _limit: 30,
                _order_by: "latest_first",
                just_info: "Yes"
            }), { 
            headers: new Headers({
                "Client-Id": process.env.REACT_APP_CLIENT_ID,
                "Client-Secret": process.env.REACT_APP_CLIENT_SECRET,
            })
        })
        var data = await request.json()
        return {
            status: 200,
            body: JSON.stringify(data)
        }
    } catch (error) {
        return {
            status: 500,
            body: error
        }
    }
}