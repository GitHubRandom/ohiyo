import { NavLink } from "react-router-dom"

const WatchNavigation = () => {
    return (
        <nav className={ "watch-menu" }>
            <section className="logo-section">
                <span id="hamburger-menu" className="mdi mdi-menu"></span>
                <div id="main-logo" className="logo">Animayhem</div>
            </section>
            <section className="menu-section">
                <NavLink className="menu-item" to="/"><span className="mdi mdi-home"></span>الرئيسة</NavLink>
                <NavLink className="menu-item" to="/all"><span className="mdi mdi-format-list-text mdi-flip-h"></span>قائمة الأنمي</NavLink>
                <NavLink className="menu-item" to="/ranked"><span className="mdi mdi-chevron-triple-up"></span>تصنيف الأنمي</NavLink>
                <NavLink className="menu-item" to="/library"><span className="mdi mdi-bookshelf"></span>مكتبتي</NavLink>
            </section>
        </nav>
    )
}

export default WatchNavigation