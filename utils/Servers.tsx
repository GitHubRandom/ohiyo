import { Method } from "axios"

export type quality = Record<string, any>[]

export const nativeServers = ["OK", "FR", "SF", "FD"]

 // Native player servers + iframe servers
export const supportedServers = nativeServers.concat(["MS", "MA", "GD", "SV"])

export const getQualityLabel = (key: string, episodeSource: quality | string ) => {
    if (Array.isArray(episodeSource)) {
        if (episodeSource.some(src => src.name == "1080p")) {
            return "1080p"
        }
        if (episodeSource.some(src => src.name == "720p")) {
            return "720p"
        }
        if (episodeSource.some(src => src.name == "480p")) {
            return "480p"
        }
        return "?"
    } else {
        if (key.endsWith("hdQ")) {
            return "1080p"
        }
        if (key.endsWith("LowQ")) {
            return "480p"
        }
        return "?"
    }
}

export const serverKeys = {
    OK: "Ok.ru",
    FR: "Mediafire",
    MS: "MyStream",
    SF: "SolidFiles",
    FD: "Fembed",
    MA: "Mega",
    GD: "G.Drive",
    SV: "SendVid"
}

export const getFetchMethod = (serverKey: string): Method => {
    return ["OK", "FD"].includes(serverKey) ? "POST" : "GET"
}

export const getFormattedEndpoint = (serverKey:string, item: string): string => {
    const prefixes = {
        MA: "https://mega.nz/embed/",
        GD: "https://drive.google.com/file/d/",
        MS: "https://embed.mystream.to/",
        FD: "https://quiet-cove-27971.herokuapp.com/www.fembed.com/api/source/",
        FR: "https://quiet-cove-27971.herokuapp.com/www.mediafire.com/?",
        SF: "/api/cors?link=http://www.solidfiles.com/v/",
        OK: "https://cors.bridged.cc/https://ok.ru/dk?cmd=videoPlayerMetadata&mid=",
        SV: "https://quiet-cove-27971.herokuapp.com/sendvid.com/embed/"
    }
    const prefix = prefixes.hasOwnProperty(serverKey) ? prefixes[serverKey] : ""
    const suffix = serverKey == "GD" ? "/preview" : ""
    return prefix + item + suffix
}

export const shouldDecodeJSON = (serverKey:string):boolean => serverKey == "OK" || serverKey == "FD"
