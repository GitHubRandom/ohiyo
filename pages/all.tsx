import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import ContentList from '../components/ContentList'
import Head from 'next/head'
import NavigationWrapper from '../containers/NavigationWrapper'

export const getServerSideProps: GetServerSideProps = async (context) => {
    let props: Record<string,any> = {}

    let params: Record<string,any> = {
        _offset: 0,
        _limit: 30,
        _order_by: "latest_first",
        list_type: "anime_list",
        just_info: "Yes"
    }

    // Detect which page is requested (infinite scroll)
    const page = context.query.page ? parseInt(context.query.page.toString()) : 1
    if ( page > 1 ) {
        params._offset = 30 * (page - 1)
    }
    props.page = page

    // Detect if there is a search query
    if (context.query.search && context.query.search != "") {
        params.anime_name = context.query.search
    }

    const res = await fetch(`https://anslayer.com/anime/public/animes/get-published-animes?json=${JSON.stringify(params)}`, {
        headers: new Headers({
            "Client-Id": process.env.CLIENT_ID,
            "Client-Secret": process.env.CLIENT_SECRET
        })
    })

    if (res.ok) {
        const data = await res.json()
        if (data && data.response && !Array.isArray(data.response)) {
            props.results = {
                status: "success",
                data: data.response.data
            }
        } else {
            props.results = {
                status: "not-found",
                data: []
            }
        }
    } else {
        props.results = {
            status: "error",
            data: []
        }
    }

    return {
        props
    }
}

const All = ({ results, page }) => {

    const router = useRouter()
    const [ result, updateResult ] = useState<Record<string,any>>({
        status: "",
        data: []
    })
    const [ refreshed, updateRefreshed ] = useState<boolean>(false)
    const [ currentPage, updateCurrent ] = useState<number>(1)

    const updateSearch = (value: string) => {
        router.push({
            pathname: "/all",
            query: { search: value }
        }, undefined, { scroll: false })
    }

    useEffect(() => {
        if (Object.keys(results).length) {
            if ( results.status == "success" && page != currentPage ) {
                updateResult(oldResults => {
                    return {
                        ...oldResults,
                        status: results.status,
                        data: oldResults.data.concat(results.data)
                    }
                })
                updateCurrent(page)
            } else if ( results.status == "success" && page == 1 ) {
                updateResult(results)
                updateCurrent(1)
            }
        }
        updateRefreshed(true)
    }, [results])

    return (
        <>
            <Head>
                <title>قائمة الأنمي</title>
                <meta name="keywords" content="anime,animayhem,all,list,anime list,anime slayer,translated,arabic,slayer,أنمي,مترجم,أنمي سلاير,لائحة الأنمي,أنمايهم"/>
                <meta name="description" content="اختر الأنمي ضمن القائمة أو إبحث عن الأنمي"/>
                <meta property="og:title" content="Animayhem - قائمة الأنمي"/>
                <meta property="og:site_name" content="Animayhem"/>
                <meta property="og:url" content="https://animayhem.ga/all" />
                <meta property="og:description" content="اختر الأنمي ضمن القائمة أو إبحث عن الأنمي" />
                <meta property="og:type" content="website" />
            </Head>
            <NavigationWrapper navTrigger="#hamburger-menu" contentId="all" selected="list-all">
                <div id="all-page" className="content-page">
                    <div className="anime-list-header">
                        <h2 className="section-title"><span id="hamburger-menu" className="mdi mdi-menu"></span>قائمة الأنمي</h2>
                        <div className="anime-search-container">
                            {// Object.keys(filterOptions).length ? <span id="anime-filter-button" data-tippy-content="التصنيف" className="mdi mdi-filter"></span> : null 
                            }
                            <input onInput={ (e: React.ChangeEvent<HTMLInputElement>) => updateSearch(e.target.value) } placeholder="البحث عن الأنمي" type="text" name="anime-search" id="anime-search"/>
                        </div>
                    </div>
                    <ContentList showEpisodeName={ false } className="content-list" contentList={ page == 1 ? results.data : result.data } />
                    <div className="bottom-detector"></div>
                </div>
            </NavigationWrapper>
        </>
    )
}

export default All