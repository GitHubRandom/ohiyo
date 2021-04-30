export default async function handler(req, res) {
    const resource = await fetch(req.query.link, {
        headers: new Headers({
            'User-Agent': req.headers["user-agent"]
        })
    })
    const data = await resource.text()
    res.status(200).send(data)
}