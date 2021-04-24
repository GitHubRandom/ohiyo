import AnimeSearchList from "../components/AnimeSearchList"
import { useEffect } from "react"

const Home = () => {

    useEffect(() => {
        document.title = "الرئيسة"
    },[])

    useEffect(() => {
        const script = document.createElement('script');
        script.innerHTML = "(function(s,u,z,p){s.src=u,s.setAttribute('data-zone',z),p.appendChild(s);})(document.createElement('script'),'https://iclickcdn.com/tag.min.js',4169282,document.body||document.documentElement)"
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        }
    }, []);

    return (
        <div id="home" className="menu-content">
            <div id="home-page" className="content-page">
                <h2 className="section-title"><span id="hamburger-menu" className="mdi mdi-menu"></span>حلقات جديدة</h2>
                <AnimeSearchList className="content-list" showEpisodeName={ true } searchMode={ false } />
            </div>
        </div>
    )
}

export default Home