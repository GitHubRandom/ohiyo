import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import ContentList from '../components/ContentList'
import NavigationWrapper from '../containers/NavigationWrapper'
import { useRouter } from 'next/router'

export const getServerSideProps: GetServerSideProps = async (context) => {

    const params = {
        _offset: 0,
        _limit: 30,
        _order_by: "latest_first",
        list_type: "latest_updated_episode_new",
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
        console.log(data)
        if (data && data.response && !Array.isArray(data.response)) {
            props.newEpisodes = data.response.data
        } else {
            props.newEpisodes = []
        }
    } else {
        props.newEpisodes = []
    }
    
    return {
        props
    }
}

export default function Home({ newEpisodes, page }) {

    const [ data, updateData ] = useState<Record<string,any>[]>([])
    const [ refreshed, updateRefreshed ] = useState<boolean>(false)
    const router = useRouter()

    useEffect(() => {
        if (newEpisodes.length) {
            updateData(oldData => oldData.concat(newEpisodes))
        }
        updateRefreshed(true)
    }, [newEpisodes])

    useEffect(() => {
        let observer = new IntersectionObserver((entries) => {
            if (entries[0] && entries[0].isIntersecting) {
                updateRefreshed(true)
                router.push({
                    pathname: "/",
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
                <title>الرئيسة</title>
            </Head>
            <NavigationWrapper navTrigger="#hamburger-menu" contentId="home" selected="home">
                <div id="home-page" className="content-page">
                    <h2 className="section-title"><span id="hamburger-menu" className="mdi mdi-menu"></span>حلقات جديدة</h2>
                    <ContentList showEpisodeName={ true } className="content-list" contentList={ page == 1 ? newEpisodes : data } />
                    <div className="bottom-detector"></div>
                </div>
            </NavigationWrapper>
        </>
    )
}
