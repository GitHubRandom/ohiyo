var http = require('follow-redirects').https
var requestIp = require('request-ip')

export default async function handler(req, res) {
    let finished = false
    var url = new URL(req.query.link)

    console.log(requestIp.getClientIp(req))

    const options = {
        method: "GET",
        host: url.hostname,
        path: url.pathname + `${url.search ? url.search : ""}`,
        headers: {
            'X-Real-IP': requestIp.getClientIp(req),
            'X-Forwarded-For': requestIp.getClientIp(req),
            'True-Client-IP' : requestIp.getClientIp(req),
            'User-Agent': req.headers['user-agent']
        }
    }
    http.request(options, response => {
        let data = ""
        response.on("data", chunk => {
            data += chunk.toString()
        })
        response.on("end", () => {
            res.status(200).send(data)
        })
        response.on('error', error => {
            finished = true
        })
    }).end()
    /*
    const resource = await fetch(req.query.link, {
        headers: new Headers({
            "X-Forwarded-For": req.headers["x-real-ip"],
            "X-Real-IP": req.headers["x-real-ip"]
        })
    })
    const data = await resource.text()*/
}