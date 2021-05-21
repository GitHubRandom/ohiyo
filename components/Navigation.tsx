import { RefObject, useEffect, useState } from "react"
import Link from 'next/link'
import { MENU_ENTRIES } from "../utils/Constants"

interface INavigation {
    trigger: RefObject<HTMLElement>,
    selected: string,
    shown: boolean,
    secondary?: boolean
}

const Navigation = ({ trigger, selected, shown, secondary }: INavigation) => {

    const [ isShown, updateShown ] = useState<boolean>(shown)

    const closeMenu = () => {
        updateShown(false)
    }

    const openMenu = () => {
        updateShown(true)
    }

    useEffect(() => {
        if (trigger.current) {
            trigger.current.addEventListener('click', () => {
                openMenu()
            })
        }
    }, [trigger])    

    return (
        // Secondary class name means that there is a top navigation and the side menu is secondary
        <nav className={ secondary ? (isShown ? "main-menu shown secondary" : "main-menu hidden secondary") : (isShown ? "main-menu shown" : "main-menu hidden") }>
            <section className="logo-section">
                <div id="side-nav" className="main-logo">Animayhem</div>
            </section>
            <section className="menu-section">
                { MENU_ENTRIES.filter(entry => entry.visible).map(entry => {
                    return <Link key={ entry.id } href={ entry.path }><a onClick={ () => closeMenu() } className={ selected == entry.id ? "menu-item selected" : "menu-item"}><span className={ "mdi " + entry.icon }></span>{ entry.title }</a></Link>
                }) }
            </section>
            <div onClick={ () => closeMenu() } className="main-menu-close">
                <span className="mdi mdi-close mdi-nm"></span>
            </div>
        </nav>
    )
}

export default Navigation