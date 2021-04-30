import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import ContentList from '../components/ContentList'
import Head from 'next/head'
import NavigationWrapper from '../containers/NavigationWrapper'
import Popup from '../components/Popup'

export const getServerSideProps: GetServerSideProps = async (context) => {
    let props: Record<string,any> = {}

    if (process.env.NODE_ENV == 'development') {
        console.log(context)
    }

    let offset = 0
    // Detect which page is requested (infinite scroll)
    const page = context.query.page ? parseInt(context.query.page.toString()) : 1
    if ( page > 1 ) {
        offset = 25 * (page - 1)
    }

    props.page = page

    let search = context.query.search

    let res
    if (search && search.length > 0) {
        if (!context.query.page || context.query.page == '1') {
            res = await fetch("https://animeify.net/animeify/apis_v2/anime/filtersort/search.php", {
                method: "POST",
                headers: new Headers({
                    "Content-Type": "application/x-www-form-urlencoded"
                }),
                body: `UserID=0&Language=AR&Text=${search}`
            })
        }
    } else {
        res = await fetch("https://animeify.net/animeify/apis_v2/anime/catalogseries.php", {
            method: "POST",
            headers: new Headers({
                "Content-Type": "application/x-www-form-urlencoded"
            }),
            body: `UserID=0&Language=AR&From=${offset}`
        })
    }

    if (res && res.ok) {
        const data = await res.json()
        console.log(data)
        if (Array.isArray(data) && data.length) {
            props.results = {
                status: "success",
                data: data
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
        let query: Record<string,string> = {}
        if (value.length) {
            console.log(value)
            query.search = value
        }
        router.push({
            pathname: "/all",
            query
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
                updateRefreshed(true)
            } else if ( results.status == "success" && page == 1 ) {
                updateResult(results)
                updateCurrent(1)
                updateRefreshed(true)
            }
        }
    }, [results])

    useEffect(() => {
        let observer = new IntersectionObserver((entries) => {
            if (refreshed && entries[0] && entries[0].isIntersecting) {
                updateRefreshed(false)
                router.push({
                    pathname: "/all",
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
    })

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
                            <input onInput={ (e: React.ChangeEvent<HTMLInputElement>) => updateSearch(e.target.value) } placeholder="البحث عن الأنمي" type="text" name="anime-search" id="anime-search"/>
                        </div>
                    </div>
                    <ContentList latest={ false } className="content-list" contentList={ page == 1 ? results.data : result.data } />
                    { result.data.length % 25 == 0 ? <div className="bottom-detector"></div> : null }
                </div>
            </NavigationWrapper>
        </>
    )
}

export default All