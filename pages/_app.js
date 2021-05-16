import '../styles/slayer.css'
import NProgress from 'nprogress';
import Router from 'next/router';
import "../styles/nprogress.css";
import 'tippy.js/dist/tippy.css'
import { useDetectAdBlock } from 'adblock-detect-react'
import AntiADB from './adblock'
import { useEffect, useState } from 'react';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {

    const adBlockDetected = useDetectAdBlock()
    const [pageReady, updatePageReady] = useState(true)

    NProgress.configure({
        minimum: 0.3,
        easing: 'ease-out',
        speed: 800,
        showSpinner: false
    })

    Router.events.on('routeChangeStart', () => {
        updatePageReady(false)
        NProgress.start()
    })
    Router.events.on('routeChangeComplete', () => {
        updatePageReady(true)
        NProgress.done()
    })
    Router.events.on('routeChangeError', () => { 
        updatePageReady(false)
        NProgress.done()
    })    

    return (
        <>
        { !adBlockDetected || process.env.NODE_ENV === "development" ? <>
            <Component {...pageProps} />
            <script dangerouslySetInnerHTML={{
                __html: `
                var uid = '317440';
                var wid = '617624';
                var pop_fback = 'up';
                var pop_tag = document.createElement('script');pop_tag.src='//cdn.popcash.net/show.js';document.body.appendChild(pop_tag);
                pop_tag.onerror = function() {pop_tag = document.createElement('script');pop_tag.src='//cdn2.popcash.net/show.js';document.body.appendChild(pop_tag)};
                `
            }}>
            </script></>
        : <AntiADB /> }</>
    )
}

export default MyApp
