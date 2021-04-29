export default async function handler(req, res) {
    const resource = await fetch(req.query.link)
    const data = await resource.text()
    res.status(200).send(data)
}