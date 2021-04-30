export default async function handler(req, res) {
    const resource = await fetch(req.query.link, {
        headers: new Headers({
            "Connection": "keep-alive",
            "Host": "www.mediafire.com"
        })
    })
    const data = await resource.text()
    res.status(200).send(data)
}