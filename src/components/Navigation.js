import { NavLink } from "react-router-dom"

const Navigation = ({ updateMenu, selected, shown }) => {

    return (
        <nav className={ shown ? "main-menu shown" : "main-menu hidden" }>
            <section className="logo-section">
                <div id="main-logo" className="logo">AnimeSlayer</div>
            </section>
            <section className="menu-section">
                <NavLink onClick={ () => updateMenu(!shown) } className={ selected == "home" ? "menu-item selected" : "menu-item"} to="/"><span className="mdi mdi-home"></span>الرئيسية</NavLink>
                <NavLink onClick={ () => updateMenu(!shown) } className={ selected == "list-all" ? "menu-item selected" : "menu-item"} to="/all"><span className="mdi mdi-format-list-text mdi-flip-h"></span>قائمة الأنمي</NavLink>
                <NavLink onClick={ () => updateMenu(!shown) } className={ selected == "favorite" ? "menu-item selected" : "menu-item"} to="#"><span className="mdi mdi-star"></span>أنمياتي المفضلة</NavLink>
            </section>
            <div onClick={ () => updateMenu(!shown) } className="main-menu-close">
                <span className="mdi mdi-close mdi-nm"></span>
            </div>
        </nav>
    )
}

export default Navigation