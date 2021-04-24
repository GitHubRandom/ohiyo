import { NavLink } from "react-router-dom"
import { MENU_ENTRIES } from "../Constants"

const WatchNavigation = () => {
    return (
        <nav className={ "watch-menu" }>
            <section className="logo-section">
                <span id="hamburger-menu" className="mdi mdi-menu"></span>
                <div id="main-logo" className="logo">Animayhem</div>
            </section>
            <section className="menu-section">
                { MENU_ENTRIES.filter(entry => entry.visible).map(entry => {
                    return <NavLink key={ entry.id } className="menu-item" to={ entry.path }><span className={ "mdi " + entry.icon }></span>{ entry.title }</NavLink>
                }) }
            </section>
        </nav>
    )
}

export default WatchNavigation