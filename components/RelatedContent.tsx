import Episode from "./Episode"

const RelatedContent = ({ related }: { related: Record<string,any>[] }) => {
    return (
        <>
            { related && related.length ?
                <div style={{ marginBottom: "55px" }} className="related-content">
                    <h2>ذات صلة</h2>
                    <div className="content-list">
                        { related.slice(0,5).map((content: Record<string,any>) => {
                            return <Episode key={ content["anime_id"] } showEpisodeName={ false }
                                        animeName={content["anime_name"]}
                                        url={'/' + content["anime_id"] + '/1'}
                                        cover={content["anime_cover_image_url"]} />
                        }) }
                    </div>
                </div> : null }
        </>
    )
}

export default RelatedContent