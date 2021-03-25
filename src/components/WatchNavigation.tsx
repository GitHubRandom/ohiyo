import { NavLink } from "react-router-dom"

const WatchNavigation = ({ shrink }: { shrink: boolean }) => {
    return (
        <nav className={ shrink ? "watch-menu shrink" : "watch-menu" }>
            <section className="logo-section">
                { shrink ? <span id="hamburger-menu" className="mdi mdi-menu"></span> : null }
                <div id="main-logo" className="logo">AnimeSlayer</div>
            </section>
            { !shrink ?
            <section className="menu-section">
                <NavLink className="menu-item" to="/"><span className="mdi mdi-home"></span>الرئيسة</NavLink>
                <NavLink className="menu-item" to="/all"><span className="mdi mdi-format-list-text mdi-flip-h"></span>قائمة الأنمي</NavLink>
                <NavLink className="menu-item" to="#"><span className="mdi mdi-star"></span>أنمياتي المفضلة</NavLink>
            </section> : null }
        </nav>
    )
}

export default WatchNavigation