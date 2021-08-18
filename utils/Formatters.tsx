export const getTrailerEmbed = ({ id, site }) => {
    if (id && site) {
        return site == "youtube" ? `https://www.youtube.com/embed/${id}` : `https://www.dailymotion.com/embed/video/${id}`
    }
    return ""
}