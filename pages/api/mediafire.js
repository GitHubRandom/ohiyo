export default async function handler(req, res) {
    const resource = await fetch(req.query.link, {
        headers: new Headers({
            'Referer': "https://ohiyo-9ysesuawh-githubrandom.vercel.app/"
        }),
        referrer: "https://ohiyo-9ysesuawh-githubrandom.vercel.app/"
    })
    console.log(resource)
    const data = await resource.text()
    res.status(200).send(data)
}