export default async function handler(req, res) {
    context.log(req.headers)
    const resource = await fetch(req.query.link, {
        headers: new Headers({
            'User-Agent': req.headers["user-agent"]
        }),
        referrer: "https://ohiyo-git-theftify-githubrandom.vercel.app/"
    })
    console.log(resource.headers)
    const data = await resource.text()
    res.status(200).send(data)
}