var mixdrop = ""

self.addEventListener("fetch", event => {
    if (event.request.url.includes("mixdrop")) {
        mixdrop = event.request.url.slice(event.request.url.indexOf("bridged.cc/") + 11)
    }
    if (event.request.url.includes("mxdcontent")) { //only add header to the endpoint i want
        const modifiedHeaders = new Headers(event.request.headers)
        modifiedHeaders.append("API-KEY", "00000000000000000000")
        modifiedHeaders.append("origin", mixdrop)

        const requestInit = { headers: modifiedHeaders, mode: 'cors' }
        event.request.url = "https://cors.bridged.cc/" + event.request.url
        const modifiedRequest = new Request("https://cors.bridged.cc/" + event.request.url, requestInit)

        event.respondWith((async () => fetch(modifiedRequest))())
    }
});

// Fix the service worker
function customHeaderRequestFetch(event) {
    console.log(event.request.headers)
    const newRequest = new Request(event.request, {
        mode: "cors",
        headers: new Headers({ ...event.request.headers, 
            'User-Agent': navigator.userAgent,
            'Origin': "https://mixdrop.co",
            'Referer': mixdrop
        }),
        referrer: mixdrop
    });
    return fetch(newRequest);
}