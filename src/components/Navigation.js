import { NavLink } from "react-router-dom"

const Navigation = ({ selected }) => {
    return (
        <nav className="main-menu">
            <section className="logo-section">

            </section>
            <section className="menu-section">
                <NavLink className={ selected == "home" ? "menu-item selected" : "menu-item"} to="/"><span className="mdi mdi-home"></span>الرئيسية</NavLink>
                <NavLink className={ selected == "list-all" ? "menu-item selected" : "menu-item"} to="/all"><span className="mdi mdi-format-list-text mdi-flip-h"></span>قائمة الأنمي</NavLink>
                <NavLink className={ selected == "favorite" ? "menu-item selected" : "menu-item"} to="#"><span className="mdi mdi-star"></span>أنمياتي المفضلة</NavLink>
            </section>
        </nav>
    )
}

export default Navigation