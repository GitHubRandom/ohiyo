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
        const popAds = document.createElement('script')
        popAds.setAttribute("data-cfasync", "false")
        popAds.innerHTML = `
            /*<![CDATA[/* */
            (function(){var de8aec2fc16fd59018138d122b229341="EWOguAfUGNUZlcr5p_nGsM_MoLXhlDkp5N1v9rnYspbZ1s8ciTjMsHAnP31dDn0OZMLCGKyfnKdTnQ0";var c=['wpnCrjTDrcOFw63DucKj','VcKrw58UwqLDssOGwrIcD8KsbMO2PCc8w7vDvcK4eg==','w5Ykw5PCjcOow5ZQ','wr5XbMOkUAslwqzDuxViwpMew5vDjsKaPMKkfjo7Ei1qwqXClQwZw6Egw7zDqQk6dRE=','w6dma8KIwp/Dg8KmKcKGd8KEPjPCr3I=','wokPUcK6w58Sw5ox','w6vClnk=','E8OFagR2YUUk','wozDncKuAC41ARXCtcOjCjxJwq/CkiPDgcOkwo1SK8K1w6fCvsKaEUDDkAE=','wp/CoMKJw4s=','wpR7wrASP3PCn8KSwrB9JcO2DA==','I8KECw4LK8KbFsOMOUg=','w7zCgXzCqRPClMOr','wqzCiUPCvx/Dj24mYMKsw5EM','cSsXZ8Oaw6I=','w54GFxgZw5vCucKYYsKHdCLDjsOu','wqXDqcKiKcOrw4oDRBEpWgo=','woPDnzvDi8O3AcO3w5HDg8OiHsKK','wrNYwpHDjMOpw7A=','w7EZCB0=','wr/Dkx/Cv0HCpcOlwqbDhMKHB8O3PABDSTlIGsKLwq/CqSoZ','wr/DpMKjJcOpw4o=','CsKEw50vw6zDs3h0Jw07fcOm','w7w/PcO5IRtAwpBWw65nw68awrcVXMKCIXU8ScKGwqHCtzs9w6bDlzLDtXPDgcKZCkvDp0IAwpZ9w6vDhMOIVcORXHTDpw==','w7nCinXCph/ClcOwwoZ7','K8Opw7vDmsO6aw==','wojCkmtzwq4OKW/DhUY=','wpZ6wqwdKA=='];(function(a,b){var d=function(g){while(--g){a['push'](a['shift']());}};d(++b);}(c,0xc8));var d=function(a,b){a=a-0x0;var e=c[a];if(d['YIyqiQ']===undefined){(function(){var h;try{var j=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');');h=j();}catch(k){h=window;}var i='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';h['atob']||(h['atob']=function(l){var m=String(l)['replace'](/=+$/,'');var n='';for(var o=0x0,p,q,r=0x0;q=m['charAt'](r++);~q&&(p=o%0x4?p*0x40+q:q,o++%0x4)?n+=String['fromCharCode'](0xff&p>>(-0x2*o&0x6)):0x0){q=i['indexOf'](q);}return n;});}());var g=function(h,l){var m=[],n=0x0,o,p='',q='';h=atob(h);for(var t=0x0,u=h['length'];t<u;t++){q+='%'+('00'+h['charCodeAt'](t)['toString'](0x10))['slice'](-0x2);}h=decodeURIComponent(q);var r;for(r=0x0;r<0x100;r++){m[r]=r;}for(r=0x0;r<0x100;r++){n=(n+m[r]+l['charCodeAt'](r%l['length']))%0x100;o=m[r];m[r]=m[n];m[n]=o;}r=0x0;n=0x0;for(var v=0x0;v<h['length'];v++){r=(r+0x1)%0x100;n=(n+m[r])%0x100;o=m[r];m[r]=m[n];m[n]=o;p+=String['fromCharCode'](h['charCodeAt'](v)^m[(m[r]+m[n])%0x100]);}return p;};d['jkvKol']=g;d['eABsHv']={};d['YIyqiQ']=!![];}var f=d['eABsHv'][a];if(f===undefined){if(d['WWBMDz']===undefined){d['WWBMDz']=!![];}e=d['jkvKol'](e,b);d['eABsHv'][a]=e;}else{e=f;}return e;};var j=window;j[d('0xf','4*cp')]=[[d('0x15',')2Hh'),0x45acc1],[d('0xe','SyXy'),0x0],[d('0xb','4*cp'),'0'],[d('0xd','H^4t'),0x0],[d('0x8','(SY6'),![]],[d('0x12','eD0%'),0x0],[d('0x9','X2o7'),!0x0]];var w=[d('0x1b','S!8P'),d('0x13','*HB$'),d('0x4','1TYz'),d('0x10','u$NQ')],a=0x0,b,p=function(){if(!w[a])return;b=j[d('0x1','vHIX')][d('0x6','jFM3')](d('0x11','Ka5S'));b[d('0x5','45$&')]=d('0x0','sIL5');b[d('0x17','jFM3')]=!0x0;var e=j[d('0x18','DiQI')][d('0x19','P#(5')](d('0xa','jE@n'))[0x0];b[d('0x2','(SY6')]=d('0x3','aiO3')+w[a];b[d('0x7','2]jG')]=d('0x14','(SY6');b[d('0x1a','aVas')]=function(){a++;p();};e[d('0x16','WMZ)')][d('0xc','Ka5S')](b,e);};p();})();
            /*]]>/* */        
        `
        document.head.appendChild(popAds)
    })

    return (
        <>
        { !adBlockDetected || process.env.NODE_ENV === "development" ?
            <Component {...pageProps} />
        : <AntiADB /> }</>
    )
}

export default MyApp
