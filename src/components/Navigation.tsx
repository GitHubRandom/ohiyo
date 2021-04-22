import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"

interface INavigation {
    trigger: string,
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
        /**
         * Add click listeners to selected triggers
         * to make side menu appears (or disappear). @Ritzy
         */
        if (trigger) {
            console.log(trigger)
            let elements = document.querySelectorAll(trigger)
            if (elements.length) {
                elements.forEach(element => {
                    console.log(element)
                    if (!element.getAttribute("data-attached-click") || element.getAttribute("data-attached-click") !== "true") {
                        element.addEventListener("click", () => {
                            console.log("Open !")
                            openMenu()
                        })
                        element.setAttribute("data-attached-click", "true")
                    }
                })
            }
        }
    })    

    return (
        // Secondary class name means that there is a top navigation and the side menu is secondary
        <nav className={ secondary ? (isShown ? "main-menu shown secondary" : "main-menu hidden secondary") : (isShown ? "main-menu shown" : "main-menu hidden") }>
            <section className="logo-section">
                <div id="main-logo" className="logo">Animayhem</div>
            </section>
            <section className="menu-section">
                <NavLink onClick={ () => closeMenu() } className={ selected == "home" ? "menu-item selected" : "menu-item"} to="/"><span className="mdi mdi-home"></span>الرئيسة</NavLink>
                <NavLink onClick={ () => closeMenu() } className={ selected == "list-all" ? "menu-item selected" : "menu-item"} to="/all"><span className="mdi mdi-format-list-text mdi-flip-h"></span>قائمة الأنمي</NavLink>
                <NavLink onClick={ () => closeMenu() } className={ selected == "ranked" ? "menu-item selected" : "menu-item"} to="/ranked"><span className="mdi mdi-chevron-triple-up"></span>تصنيف الأنمي</NavLink>
                <NavLink onClick={ () => closeMenu() } className={ selected == "library" ? "menu-item selected" : "menu-item"} to="/library"><span className="mdi mdi-bookshelf"></span>مكتبتي</NavLink>
            </section>
            <div onClick={ () => closeMenu() } className="main-menu-close">
                <span className="mdi mdi-close mdi-nm"></span>
            </div>
        </nav>
    )
}

export default Navigation