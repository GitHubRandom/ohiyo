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

    NProgress.configure({
        minimum: 0.3,
        easing: 'ease-out',
        speed: 800,
        showSpinner: false
    })

    Router.events.on('routeChangeStart', () => {
        NProgress.start()
    })
    Router.events.on('routeChangeComplete', () => {
        NProgress.done()
    })
    Router.events.on('routeChangeError', () => { 
        NProgress.done()
    })    

    return (
        <>
        { !adBlockDetected || process.env.NODE_ENV === "development" ?
            <Component {...pageProps} />
        : <AntiADB /> }</>
    )
}

export default MyApp
