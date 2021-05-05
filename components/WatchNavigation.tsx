import Link from 'next/link'
import { MENU_ENTRIES } from "../utils/Constants"

const WatchNavigation = () => {
    return (
        <nav className={ "watch-menu" }>
            <section className="logo-section">
                <span id="hamburger-menu" className="mdi mdi-menu"></span>
                <Link href="/"><a id="watch-nav" className="main-logo">Animayhem</a></Link>
            </section>
            <section className="menu-section">
                { MENU_ENTRIES.filter(entry => entry.visible).map(entry => {
                    return <Link key={ entry.id } href={ entry.path }><a className="menu-item"><span className={ "mdi " + entry.icon }></span>{ entry.title }</a></Link>
                }) }
            </section>
        </nav>
    )
}

export default WatchNavigation