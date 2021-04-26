import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import NavigationWrapper from '../containers/NavigationWrapper'
import ContentList from '../components/ContentList'
import Head from 'next/head'

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
            "Client-Id": "web-app",
            "Client-Secret": "90b63e11b9b4634f124df024516id495ab749c6b"
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
        }
        updateRefreshed(true)
    }, [ranking])

    useEffect(() => {
        let observer = new IntersectionObserver((entries) => {
            if (entries[0] && entries[0].isIntersecting) {
                updateRefreshed(true)
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
            </Head>
            <NavigationWrapper navTrigger="#hamburger-menu" contentId="ranked" selected="ranked">
                <div id="ranked-page" className="content-page">
                    <h2 className="section-title"><span id="hamburger-menu" className="mdi mdi-menu"></span>تصنيف الأنمي (MAL)</h2>
                    <ContentList showEpisodeName={ false } className="content-list" contentList={ page == 1 ? ranking : data } />
                    <div className="bottom-detector"></div>
                </div>
            </NavigationWrapper>
        </>
    )
}

export default Ranked