import AnimeSearchList from "../components/AnimeSearchList"
import { useEffect } from 'react'

const Ranked = () => {

    useEffect(() => {
        const script = document.createElement('script');
        script.innerHTML = "(function(s,u,z,p){s.src=u,s.setAttribute('data-zone',z),p.appendChild(s);})(document.createElement('script'),'https://iclickcdn.com/tag.min.js',4169282,document.body||document.documentElement)"
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        }
    }, []);

    return (
        <div id="all" className="menu-content">
            <div id="all-page" className="content-page">
                <h2 className="section-title"><span id="hamburger-menu" className="mdi mdi-menu"></span>تصنيف الأنمي (MAL)</h2>
                <AnimeSearchList topAnime={ true } showEpisodeName={ false } className="content-list" searchMode={ false } />
            </div>
        </div>

    )
}

export default Ranked