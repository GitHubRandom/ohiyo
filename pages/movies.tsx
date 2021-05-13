import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import ContentList from '../components/ContentList'
import NavigationWrapper from '../containers/NavigationWrapper'
import { useRouter } from 'next/router'
import AdScripts from '../components/AdScripts'

export const getServerSideProps: GetServerSideProps = async (context) => {

    let props: Record<string,any> = {}

    const page = context.query.page ? parseInt(context.query.page.toString()) : 1
    props.page = page

    let offset: number = 25 * (page - 1)
    let res: Response
    res = await fetch("https://animeify.net/animeify/apis_v2/anime/latest_anime.php", {
        method: "POST",
        headers: new Headers({
            "Content-Type": "application/x-www-form-urlencoded"
        }),
        body: `UserId=0&Type=Movie&Language=AR&From=${offset}`
    })
    if (res.ok) {
        const data = await res.json()
        if (data) {
            props.newMovies = data
        }
    } else {
        props.newMovies = []
    }
    
    return {
        props
    }
}

export default function Home({ newMovies, page }) {

    const [ data, updateData ] = useState<Record<string,any>[]>([])
    const [ refreshed, updateRefreshed ] = useState<boolean>(false)
    const router = useRouter()

    useEffect(() => {
        if (newMovies.length) {
            updateData(oldData => oldData.concat(newMovies))
            updateRefreshed(true)
        }
    }, [newMovies])

    useEffect(() => {
        let observer = new IntersectionObserver((entries) => {
            if (refreshed && entries[0] && entries[0].isIntersecting) {
                updateRefreshed(false)
                router.push({
                    pathname: "/movies",
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
                <title>Animayhem - آخر الأفلام</title>
                <meta name="keywords" content="anime,animayhem,anime slayer,translated,movies,arabic,slayer,أفلام,أنمي,مترجم,أنمي سلاير,أنمايهم"/>
                <meta name="description" content="شاهد آخر أفلام الأنمي المترجمة بجودة عالية على موقعنا"/>
                <meta property="og:title" content="Animayhem - أنمي مترجم"/>
                <meta property="og:site_name" content="Animayhem"/>
                <meta property="og:url" content="https://animayhem.ga" />
                <meta property="og:description" content="شاهد آخر أفلام الأنمي المترجمة بجودة عالية على موقعنا" />
                <meta property="og:type" content="website" />
            </Head>
            <NavigationWrapper navTrigger="#hamburger-menu" contentId="movies" selected="movies">
                <div id="movies-page" className="content-page">
                    <h2 className="section-title"><span id="hamburger-menu" className="mdi mdi-menu"></span>آخر الأفلام</h2>
                    <ContentList latest={ false } className="content-list" contentList={ page == 1 ? newMovies : data } />
                    <div className="bottom-detector"></div>
                </div>
            </NavigationWrapper>
        </>
    )
}
