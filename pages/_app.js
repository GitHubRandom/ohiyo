import '../styles/slayer.css'
import NProgress from 'nprogress';
import Router from 'next/router';
import "../styles/nprogress.css";
import 'tippy.js/dist/tippy.css'
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {

    NProgress.configure({
        minimum: 0.3,
        easing: 'ease-out',
        speed: 800,
        showSpinner: false
    })

    Router.events.on('routeChangeStart', () => NProgress.start())
    Router.events.on('routeChangeComplete', () => NProgress.done())
    Router.events.on('routeChangeError', () => NProgress.done())

    useEffect(() => {
        window.OneSignal = window.OneSignal || [];
        OneSignal.push(function () {
            OneSignal.init({
                appId: "15773eb1-d11b-4a85-b8cf-e251797ffb12",
                notifyButton: {
                    enable: true,
                },
            });
        });
    })

    return <Component {...pageProps} />
}

export default MyApp
