var http = require('http')

export default async function handler(req, res) {
    let data = ""
    let finished = false

    const options = {
        host: req.query.link,
        localAddress: req.connection.remoteAddress
    }
    console.log(options)
    http.request(options, response => {
        response.on("data", chunk => {
            data += chunk
            console.log(chunk)
        })
        response.on("end", () => {
            res.status(200).send(data)
        })
        response.on('error', error => {
            console.log(error)
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