import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import NavigationWrapper from '../containers/NavigationWrapper'
import ContentList from '../components/ContentList'
import Head from 'next/head'
import AdScripts from "../components/AdScripts"

export const getServerSideProps: GetServerSideProps = async (context) => {

    const params = {
        _offset: 0,
        _limit: 30,
        list_type: "top_anime_mal",
        just_info: "Yes"
    }

    let props: Record<string,any> = {}

    const page = context.query.page ? parseInt(context.query.page.toString()) : 1
    if ( page > 1 ) {
        params._offset = 30 * (page - 1)
    }
    props.page = page

    const res = await fetch(`https://anslayer.com/anime/public/animes/get-published-animes?json=${JSON.stringify(params)}`, {
        headers: new Headers({
            "Client-Id": process.env.CLIENT_ID,
            "Client-Secret": process.env.CLIENT_SECRET
        })
    })
    if (res.ok) {
        const data = await res.json()
        if (data && data.response && !Array.isArray(data.response)) {
            props.ranking = data.response.data
        } else {
            props.ranking = []
        }
    } else {
        props.ranking = []
    }
    
    return {
        props
    }
}

const Ranked = ({ ranking, page }) => {

    const [ data, updateData ] = useState<Record<string,any>[]>([])
    const [ refreshed, updateRefreshed ] = useState<boolean>(false)
    const router = useRouter()
    
    useEffect(() => {
        if (ranking.length) {
            updateData( oldData => oldData.concat(ranking) )
            updateRefreshed(true)
        }
    }, [ranking])

    useEffect(() => {
        let observer = new IntersectionObserver((entries) => {
            if (refreshed && entries[0] && entries[0].isIntersecting) {
                updateRefreshed(false)
                router.push({
                    pathname: "/ranked",
                    query: { page: page + 1 }
                }, undefined, { scroll: false })
            }
        })
        if (document.querySelector(".bottom-detector")) {
            observer.observe(document.querySelector(".bottom-detector") as Element)
        }

        return () => {
            observer.disconnect()
        }
    })

    return (
        <>
            <Head>
                <title>تصنيف الأنمي</title>
                <meta name="keywords" content="anime,animayhem,all,list,anime list,anime slayer,translated,arabic,slayer,أنمي,مترجم,أنمي سلاير,لائحة الأنمي,أنمايهم"/>
                <meta name="description" content="تصنيف الأنمي حسب التقييم العام على MyAnimeList"/>
                <meta property="og:title" content="Animayhem - تصنيف الأنمي"/>
                <meta property="og:site_name" content="Animayhem"/>
                <meta property="og:url" content="https://animayhem.ga/ranked" />
                <meta property="og:description" content="تصنيف الأنمي حسب التقييم العام على MyAnimeList" />
                <meta property="og:type" content="website" />
            </Head>
            <NavigationWrapper navTrigger="#hamburger-menu" contentId="ranked" selected="ranked">
                <div id="ranked-page" className="content-page">
                    <h2 className="section-title"><span id="hamburger-menu" className="mdi mdi-menu"></span>تصنيف الأنمي (MAL)</h2>
                    <ContentList latest={ false } className="content-list" contentList={ page == 1 ? ranking : data } />
                    <div className="bottom-detector"></div>
                </div>
            </NavigationWrapper>
        </>
    )
}

export default Ranked