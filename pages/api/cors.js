var https = require('follow-redirects').https
var requestIp = require('request-ip')

export default async function handler(req, res) {
    const url = new URL(req.query.link)

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
    https.request(options, response => {
        let data = ""
        response.on("data", chunk => {
            data += chunk.toString()
        })
        response.on("end", () => {
            res.status(200).send(data)
        })
    }).end()
}