import { useState } from "react"
import TabIndicator from "../components/TabIndicator"

const libraryMenu = {
    history: {
        title: "آخر المشاهدات",
        icon: "mdi-history"
    },
    watchlist: {
        title: "للمشاهدة لاحقا",
        icon: "mdi-clock-time-three-outline"
    },
    favorite: {
        title: "أنمياتي المفضلة",
        icon: "mdi-star"
    }
}

const Library = () => {

    const [ selected, updateSelected ] = useState<string>("history")

    return (
        <div id="library" className="menu-content">
            <div id="library-page" className="content-page">
                <h2 className="section-title"><span id="hamburger-menu" className="mdi mdi-menu"></span>مكتبتي</h2>
                <div className="library-items">
                    <TabIndicator setTab={ (tab) => updateSelected(tab) } items={ libraryMenu } selected={ selected } />
                </div>
            </div>
        </div>
    )
}

export default Library