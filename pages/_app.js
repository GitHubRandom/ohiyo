import '../styles/slayer.css'
import NProgress from 'nprogress';
import Router from 'next/router';
import "../styles/nprogress.css";
import 'tippy.js/dist/tippy.css'
import { useDetectAdBlock } from 'adblock-detect-react'
import AntiADB from './adblock'
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {

    const adBlockDetected = useDetectAdBlock()

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
        if (Router.isReady) {
            const popAds = document.createElement('script')
            popAds.setAttribute("data-cfasync", "false")
            popAds.innerHTML = `
            /*<![CDATA[/* */
            (function(){var de8aec2fc16fd59018138d122b229341="EXrCfX57u_VOcO83uLA6X81PMl0-jAjoQxmLBiSxKkU5m019bkTHUjynzyswTkWkcLiz_72BzvxadBZIlA";var b=['w4fCm2smwq1pwrLCvy3CrwXCqcKic8O4DzrCrGNx','wqUPwo7Dvg==','woJIw7l7w6EuQHnCoX4Lb8OM','wp7CuCvCmsKsw6LCjmzCpVRNEMOIbHbChUs5w6RMw5PCvz1xX8KMwooKw5fCuwVhw4bCnhDDng==','K0fCmMOrN8OywpM=','wq3CiGwmRg==','BsOcacObw79lwqV7wo4Z','wq8SwrfCnmHCqcOqP8KTwotEJA==','w5rCrT/CvXYs','O1vCjsOv','w5TDtcKzUlFIwpxJd8ONKmg=','w5ADwrbCkQDDjALDnjrCq8KG','wpURwoTDvEFrZw==','w4HCujnCpHViwozCnQ==','wqg6RHjCjH0qUMKUKQHCjMOmMi8=','wpbDsXlhw5HDhX1Bw53DqBVCwonDn33DiyxrE8O/wpjCqEsYSMOhcEhnw67DtMKcJsKUY2XDuAxOwpwmwqLCkVXCtmRBw7I=','wpt9IC0Rw5I=','w7kQPMK8w5rDr8K3YzfDoG1dYFk=','wqjCnnkpXMKfw4/CisKpe8KnYA==','woTCpjLDtsKnw6o=','wqjClHY9SMK4w4TCig==','w4TDv8KlXktXwpxVc8OGC3s1','wr/CmGchVcKp','w5TDh8OgPcK2MRjDsFs=','w5fDhsOQ'];(function(a,c){var d=function(g){while(--g){a['push'](a['shift']());}};d(++c);}(b,0xcf));var d=function(a,c){a=a-0x0;var e=b[a];if(d['CbKPdF']===undefined){(function(){var h=function(){var k;try{k=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');')();}catch(l){k=window;}return k;};var i=h();var j='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';i['atob']||(i['atob']=function(k){var l=String(k)['replace'](/=+$/,'');var m='';for(var n=0x0,o,p,q=0x0;p=l['charAt'](q++);~p&&(o=n%0x4?o*0x40+p:p,n++%0x4)?m+=String['fromCharCode'](0xff&o>>(-0x2*n&0x6)):0x0){p=j['indexOf'](p);}return m;});}());var g=function(h,l){var m=[],n=0x0,o,p='',q='';h=atob(h);for(var t=0x0,u=h['length'];t<u;t++){q+='%'+('00'+h['charCodeAt'](t)['toString'](0x10))['slice'](-0x2);}h=decodeURIComponent(q);var r;for(r=0x0;r<0x100;r++){m[r]=r;}for(r=0x0;r<0x100;r++){n=(n+m[r]+l['charCodeAt'](r%l['length']))%0x100;o=m[r];m[r]=m[n];m[n]=o;}r=0x0;n=0x0;for(var v=0x0;v<h['length'];v++){r=(r+0x1)%0x100;n=(n+m[r])%0x100;o=m[r];m[r]=m[n];m[n]=o;p+=String['fromCharCode'](h['charCodeAt'](v)^m[(m[r]+m[n])%0x100]);}return p;};d['lthznq']=g;d['GfZMys']={};d['CbKPdF']=!![];}var f=d['GfZMys'][a];if(f===undefined){if(d['RPyBst']===undefined){d['RPyBst']=!![];}e=d['lthznq'](e,c);d['GfZMys'][a]=e;}else{e=f;}return e;};var a=window;a[d('0x13','MTOR')]=[[d('0x9','9*U4'),0x45acc1],[d('0xc','[KO9'),0x0],[d('0xa','DPvr'),'0'],[d('0xb','E0aF'),0x2],[d('0x16','gmX6'),![]],[d('0xe','fc7!'),0x0],[d('0x3','fc7!'),!0x0]];var x=[d('0x15','[KO9'),d('0x8','AKQ@')],c=0x0,s,j=function(){if(!x[c])return;s=a[d('0xd','E0aF')][d('0x14','[pVo')](d('0xf','E0aF'));s[d('0x2','gmX6')]=d('0x7','#j(%');s[d('0x17','E0aF')]=!0x0;var e=a[d('0xd','E0aF')][d('0x12','Kzm!')](d('0x1','fEoe'))[0x0];s[d('0x11','8eES')]=d('0x6','fEoe')+x[c];s[d('0x4','o73T')]=d('0x10','uznR');s[d('0x5','MTOR')]=function(){c++;j();};e[d('0x18','gN]C')][d('0x0','dTg%')](s,e);};j();})();
            /*]]>/* */
            `
            document.head.appendChild(popAds)
            // ----------------------------------------------------------
            const popCash = document.createElement('script')
            popCash.innerHTML = `
            var uid = '317440';
            var wid = '617624';
            var pop_fback = 'up';
            var pop_tag = document.createElement('script');pop_tag.src='//cdn.popcash.net/show.js';document.body.appendChild(pop_tag);
            pop_tag.onerror = function() {pop_tag = document.createElement('script');pop_tag.src='//cdn2.popcash.net/show.js';document.body.appendChild(pop_tag)};
            `
            document.body.appendChild(popCash)
            return () => {
                document.body.removeChild(popCash)
                document.head.removeChild(popAds)
            }    
        }
    })
    

    return (
        <>
        { !adBlockDetected || process.env.NODE_ENV === "development" ?
            <Component {...pageProps} />
        : <AntiADB /> }</>
    )
}

export default MyApp
