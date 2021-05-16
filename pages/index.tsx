import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import ContentList from '../components/ContentList'
import NavigationWrapper from '../containers/NavigationWrapper'
import { useRouter } from 'next/router'
import AdScripts from '../components/AdScripts'

export const getServerSideProps: GetServerSideProps = async (context) => {

    let props: Record<string, any> = {}

    const page = context.query.page ? parseInt(context.query.page.toString()) : 1
    props.page = page

    let offset: number = 25 * (page - 1)
    let res: Response
    res = await fetch("https://animeify.net/animeify/apis_v2/episodes/latest_episodes.php", {
        method: "POST",
        headers: new Headers({
            "Content-Type": "application/x-www-form-urlencoded"
        }),
        body: `UserID=0&Language=AR&From=${offset}`
    })
    if (res.ok) {
        const data = await res.json()
        if (data) {
            props.newEpisodes = data
        }
    } else {
        props.newEpisodes = []
    }

    return {
        props
    }
}

export default function Home({ newEpisodes, page }) {

    const [data, updateData] = useState<Record<string, any>[]>([])
    const [refreshed, updateRefreshed] = useState<boolean>(false)
    const router = useRouter()

    useEffect(() => {
        if (newEpisodes.length) {
            updateData(oldData => oldData.concat(newEpisodes))
            updateRefreshed(true)
        }
    }, [newEpisodes])

    useEffect(() => {
        let observer = new IntersectionObserver((entries) => {
            if (refreshed && entries[0] && entries[0].isIntersecting) {
                updateRefreshed(false)
                router.push({
                    pathname: "/",
                    query: { ...router.query, page: page + 1 }
                }, undefined, { scroll: false })
            }
        })
        if (document.querySelector(".bottom-detector")) {
            observer.observe(document.querySelector(".bottom-detector") as Element)
        }

        return () => {
            observer.disconnect()
        }
    }, [refreshed])

    return (
        <>
            <Head>
                <title>الرئيسة - Animayhem</title>
                <meta name="keywords" content="anime,animayhem,anime slayer,translated,arabic,slayer,أنمي,مترجم,أنمي سلاير,أنمايهم" />
                <meta name="description" content="موقع لمشاهدة الأنمي المترجم بجودة عالية" />
                <meta property="og:title" content="Animayhem - أنمي مترجم" />
                <meta property="og:site_name" content="Animayhem" />
                <meta property="og:url" content="https://animayhem.ga" />
                <meta property="og:description" content="موقع لمشاهدة الأنمي المترجم بجودة عالية" />
                <meta property="og:type" content="website" />
            </Head>
            <NavigationWrapper navTrigger="#hamburger-menu" contentId="home" selected="home">
                <div id="home-page" className="content-page">
                    <h2 className="section-title"><span id="hamburger-menu" className="mdi mdi-menu"></span>آخر الحلقات</h2>
                    <div id="bebi-banner">
                        <script type="text/javascript" data-cfasync="false" dangerouslySetInnerHTML={{
                            __html: `
                            if(!window.BB_a) { BB_a = [];} if(!window.BB_ind) { BB_ind = 0; } if(!window.BB_r) { BB_r = Math.floor(Math.random()*1000000000)} BB_ind++; BB_a.push({ "pl" : 2018555, "index": BB_ind});
                            `
                        }}>
                        </script>
                        <script type="text/javascript" data-cfasync="false" src="//st.bebi.com/bebi_v3.js"></script>
                    </div>
                <ContentList latest={true} className="content-list" contentList={page == 1 ? newEpisodes : data} />
                <div className="bottom-detector"></div>
                </div>
        </NavigationWrapper>
        </>
    )
}
