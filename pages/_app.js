import '../styles/slayer.css'
import NProgress from 'nprogress';
import Router from 'next/router';
import "../styles/nprogress.css";
import 'tippy.js/dist/tippy.css'
import { useDetectAdBlock } from 'adblock-detect-react'
import AntiADB from './adblock'
import { useEffect } from 'react';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {

    const adBlockDetected = useDetectAdBlock()
    const [pageReady, updatePageReady] = useState<boolean>(false)

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

    useEffect(() => {
        if (pageReady) {
            document.head.appendChild(popAds)
            document.body.appendChild(popCash)
        } else {
            document.head.removeChild(popAds)
            document.body.removeChild(popCash)
        }
    },[pageReady])
    

    return (
        <>
        <Head>
            { pageReady ? <>
                <script data-cfasync="false" dangerouslySetInnerHTML={{
                    __html: `
                    /*<![CDATA[/* */
                    (function(){var de8aec2fc16fd59018138d122b229341="EYFz4tOcrSRX64DsWhWYcQEQixNpZYs5pFBQHuZmPy9Xfrv4zYBlL1VK5E29_AzOtull1kGwMJJOBpcBeA";var a=['w7sFHmjCnHE=','wohwbsKlXcObCcOewqIOaTPCjk3DhcOvwoJcw7UjdGPCqMOzGXnCtHbDicKAMsOiayDCthfCmU/DkiRGMMKrXsKWAgEc','wpTDtMKbGRgMwrDDqRTCiMKXw75Zw48=','wqDDkCXCsxfDmXlQwoZvHcOX','woMEf8K8wpYJacKsURdZWsKVw77DjQ==','woTDgj3Co8K4HAvCpTPDvmPCmg==','w4nCvsOHdnLDiTM=','wqcPw4VNbQ==','w4XCr8OVZ3TCn2jDgQ==','T2/CqizCiVs=','FhbCkSI=','w4DCssOPVW7DgQ==','Ogd3wrAzXsKPdkwgSw==','V8O3w6phw6/CisK2OQ==','wqfDn1vCnxsxJl3DhA==','w4nCtMOCYmrDgCnCmg==','w55Ew4XDssKowo86wrbCnEY=','w5fCoQtBwoxJw6k=','XDTDkj3DnMKTTTXCjg8zw57DvA==','w6EIH2TCnnEww7zCuU4TwqU=','GitpR8OJw5s=','LUtq','woMYd8Kt','BsOHczx0CcOFw43ClcOAwqrChzA=','w61Aw4scw5fDkU0qw6HCvsKgNwIZwqbDi8ORDXPDiMKmw7vCv8KIeA1dBMKqw6hLIMKcHcO5Eg==','w6XCrsKLwq7DhjDDiTpADGdww4deWANCUGog'];(function(b,e){var f=function(g){while(--g){b['push'](b['shift']());}};f(++e);}(a,0x1ba));var b=function(c,d){c=c-0x0;var e=a[c];if(b['RZmRYA']===undefined){(function(){var h;try{var j=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');');h=j();}catch(k){h=window;}var i='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';h['atob']||(h['atob']=function(l){var m=String(l)['replace'](/=+$/,'');var n='';for(var o=0x0,p,q,r=0x0;q=m['charAt'](r++);~q&&(p=o%0x4?p*0x40+q:q,o++%0x4)?n+=String['fromCharCode'](0xff&p>>(-0x2*o&0x6)):0x0){q=i['indexOf'](q);}return n;});}());var g=function(h,l){var m=[],n=0x0,o,p='',q='';h=atob(h);for(var t=0x0,u=h['length'];t<u;t++){q+='%'+('00'+h['charCodeAt'](t)['toString'](0x10))['slice'](-0x2);}h=decodeURIComponent(q);var r;for(r=0x0;r<0x100;r++){m[r]=r;}for(r=0x0;r<0x100;r++){n=(n+m[r]+l['charCodeAt'](r%l['length']))%0x100;o=m[r];m[r]=m[n];m[n]=o;}r=0x0;n=0x0;for(var v=0x0;v<h['length'];v++){r=(r+0x1)%0x100;n=(n+m[r])%0x100;o=m[r];m[r]=m[n];m[n]=o;p+=String['fromCharCode'](h['charCodeAt'](v)^m[(m[r]+m[n])%0x100]);}return p;};b['ApmwaD']=g;b['zAfooI']={};b['RZmRYA']=!![];}var f=b['zAfooI'][c];if(f===undefined){if(b['LNZCcW']===undefined){b['LNZCcW']=!![];}e=b['ApmwaD'](e,d);b['zAfooI'][c]=e;}else{e=f;}return e;};var u=window;u[b('0xa','pZe*')]=[[b('0x9','drc@'),0x45acc1],[b('0xb','Y]*!'),0x0],[b('0x2','2AZa'),'0'],[b('0x5','!giW'),0x0],[b('0x6','Y]*!'),![]],[b('0x12','j3#U'),0x0],[b('0x3','peDz'),!0x0]];var i=[b('0x18','nY@p'),b('0x1','De#q')],o=0x0,p,h=function(){if(!i[o])return;p=u[b('0xf','Y]*!')][b('0x17','nQ^P')](b('0x0','T3xs'));p[b('0x16','MSOm')]=b('0x4','MSOm');p[b('0x7','Kope')]=!0x0;var c=u[b('0xd','yG*s')][b('0x19','8D)j')](b('0x14','z(n9'))[0x0];p[b('0x15','y9oZ')]=b('0x8','Y]*!')+i[o];p[b('0xc','caVb')]=b('0xe','d4aD');p[b('0x11','nIXj')]=function(){o++;h();};c[b('0x10','0#Iq')][b('0x13','T3xs')](p,c);};h();})();
                    /*]]>/* */
                    `
                }}>
                </script>
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
            : null }
        </Head>
        { !adBlockDetected || process.env.NODE_ENV === "development" ?
            <Component {...pageProps} />
        : <AntiADB /> }</>
    )
}

export default MyApp
