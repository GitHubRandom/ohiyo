const Navigation = ({ selected }) => {
    return (
        <nav className="main-menu">
            <section className="logo-section">

            </section>
            <section className="menu-section">
                <a className={ selected == "home" ? "menu-item selected" : "menu-item"} href="#"><span className="mdi mdi-home"></span>الرئيسية</a>
                <a className={ selected == "list-all" ? "menu-item selected" : "menu-item"} href="#"><span className="mdi mdi-format-list-text"></span>قائمة الأنمي</a>
                <a className={ selected == "favorite" ? "menu-item selected" : "menu-item"} href="#"><span className="mdi mdi-star"></span>أنمياتي المفضلة</a>
            </section>
        </nav>
    )
}

export default Navigation