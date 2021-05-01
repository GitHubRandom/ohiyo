export default async function handler(req, res) {
    const resource = await fetch(req.query.link, {
        headers: new Headers({
            "X-Forwarded-For": req.headers["x-real-ip"]
        })
    })
    const data = await resource.text()
    res.status(200).send(data)
}