import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"

interface INavigation {
    trigger: string,
    selected: string,
    shown: boolean
}

const Navigation = ({ trigger, selected, shown }: INavigation) => {

    const [ isShown, updateShown ] = useState<boolean>(shown)

    const closeMenu = () => {
        updateShown(false)
    }

    const openMenu = () => {
        updateShown(true)
    }

    useEffect(() => {
        /**
         * Add click listeners to selected triggers
         * to make side menu appears (or disappear). @Ritzy
         */
        if (trigger) {
            let elements = document.querySelectorAll(trigger)
            if (elements.length) {
                elements.forEach(element => {
                    if (!element.getAttribute("data-attched-click") || element.getAttribute("data-attached-click") !== "true") {
                        element.addEventListener("click", () => {
                            openMenu()
                        })
                        element.setAttribute("data-attached-click", "true")
                    }
                })
            }
        }
    })    

    return (
        <nav className={ isShown ? "main-menu shown" : "main-menu hidden" }>
            <section className="logo-section">
                <div id="main-logo" className="logo">Animayhem</div>
            </section>
            <section className="menu-section">
                <NavLink onClick={ () => closeMenu() } className={ selected == "home" ? "menu-item selected" : "menu-item"} to="/"><span className="mdi mdi-home"></span>الرئيسة</NavLink>
                <NavLink onClick={ () => closeMenu() } className={ selected == "list-all" ? "menu-item selected" : "menu-item"} to="/all"><span className="mdi mdi-format-list-text mdi-flip-h"></span>قائمة الأنمي</NavLink>
                <NavLink onClick={ () => closeMenu() } className={ selected == "library" ? "menu-item selected" : "menu-item"} to="/library"><span className="mdi mdi-bookshelf"></span>مكتبتي</NavLink>
            </section>
            <div onClick={ () => closeMenu() } className="main-menu-close">
                <span className="mdi mdi-close mdi-nm"></span>
            </div>
        </nav>
    )
}

export default Navigation