const qualitiesMap = {
    hdQ: "1080p",
    owQ: "480p",
    ink: "720p"
}

/**
 * This function decodes HTML to extract video sources
 * @param s Server URL (string)
 * @param data HTML response (string)
 * @returns An array with server code & an array of objects of different qualities URLs
 */
const decodeHTML = (key: string, data: string, qual: string): [string, Record<string, string>[]] => {
    if (key.startsWith("FR")) {
        // Search for the download button href
        const regex = /href="(https?:\/\/download\d{1,6}\.mediafire\.com.*?\.mp4)"/
        const matches = data.match(regex)
        if (matches) {
            return [key, [{ type: "normal", url: "https://quiet-cove-27971.herokuapp.com/" + matches[1], name: qualitiesMap[qual] }]]
        }
    } else if (key.startsWith("SF")) {
        const regex = /"downloadUrl":"(.+solidfilesusercontent.com.+?)"/
        const matches = data.match(regex)
        if (matches) {
            return [key, [{ type: "normal", url: matches[1], name: qualitiesMap[qual] }]]
        }
    } else if (key.startsWith("SV")) {
        const regex = /<source src="(.*?)"/
        const matches = data.match(regex)
        if (matches) {
            return [key, [{ type: "hls", url: "https://quiet-cove-27971.herokuapp.com/" + matches[1], name: qualitiesMap[qual] }]]
        }
    }
    return ["", []]
}

/**
 * This function decodes JSON to extract video sources
 * @param s Server URL (string)
 * @param data Response of the request (JSON Object)
 * @returns An array with server code & object of different qualities URLs
 */
const decodeJSON = (key: string, data: Record<string, any>): [string, Array<Record<string, string>>] => {
    if (key.startsWith("OK")) {
        let q: Record<string, string> = { mobile: "144p", lowest: "240p", low: "360p", sd: "480p", hd: "720p" }
        let qualities: Array<Record<string, string>> = []
        // Videos links are in "videos" array of the JSON response
        if ("videos" in data) {
            data["videos"].forEach((quality: Record<string, string>) => {
                if (quality["name"] in q) qualities.push({ type: "normal", url: quality.url, name: q[quality.name] })
            })
            return [key, qualities]
        }
        return ["", []]
    } else if (key.startsWith("FD")) {
        let qualities: Array<Record<string, string>> = []
        if ("data" in data) {
            data.data.forEach((quality: Record<string, string>) => {
                qualities.push({ type: "normal", url: "https://quiet-cove-27971.herokuapp.com/" + quality.file, name: quality.label })
            })
            return [key, qualities]
        }
        return ["", []]
    }
    return ["", []]
}

/**
 * This function extracts the video sources hidden in an obfuscated JS code (Uptostream for example)
 * @param source The code to be "evaled"
 * @returns The sources after evaluating the code
 */
const evalSources = (source: string) => {
    var sources = new Function(source + "return sources;")
    return sources()
}

/**
 * This is an object utility for p,a,c,k,e,d JS code
 */
var P_A_C_K_E_R = {
    detect: (str: string) => {
        return P_A_C_K_E_R._starts_with(str.toLowerCase().replace(/ +/g, ''), 'eval(function(') ||
            P_A_C_K_E_R._starts_with(str.toLowerCase().replace(/ +/g, ''), 'eval((function(');
    },
    unpack: (str: string) => {
        var unpacked_source = '';
        if (P_A_C_K_E_R.detect(str)) {
            try {
                eval('unpacked_source = ' + str.substring(4) + ';')
                if (typeof unpacked_source == 'string' && unpacked_source) {
                    str = unpacked_source;
                }
            } catch (error) { }
        }
        return str;
    },
    _starts_with: (str: string, what: string) => {
        return str.substr(0, what.length) === what;
    }
}

export { decodeHTML, decodeJSON }