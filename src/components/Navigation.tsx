import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"

interface INavigation {
    trigger: string,
    selected: string,
    shown: boolean
}

const Navigation = ({ trigger, selected, shown }: INavigation) => {

    const [ isShown, updateShown ] = useState<boolean>(shown)

    const toggleMenu = () => {
        updateShown(state => !state)
    }

    useEffect(() => {
        /**
         * Add click listeners to selected triggers
         * to make side menu appears (or disappear). @Ritzy
         */
        if (trigger) {
            if (trigger.startsWith("#")) {
                document.getElementById(trigger.slice(1))?.addEventListener("click", () => {
                    toggleMenu()
                })
            } else if (trigger.startsWith(".")) {
                Array.from(document.getElementsByClassName(trigger.slice(1))).forEach(element => {
                    element.addEventListener("click", () => {
                        toggleMenu()
                    })
                });
            }
        }
    })    

    return (
        <nav className={ isShown ? "main-menu shown" : "main-menu hidden" }>
            <section className="logo-section">
                <div id="main-logo" className="logo">AnimeSlayer</div>
            </section>
            <section className="menu-section">
                <NavLink onClick={ () => toggleMenu() } className={ selected == "home" ? "menu-item selected" : "menu-item"} to="/"><span className="mdi mdi-home"></span>الرئيسة</NavLink>
                <NavLink onClick={ () => toggleMenu() } className={ selected == "list-all" ? "menu-item selected" : "menu-item"} to="/all"><span className="mdi mdi-format-list-text mdi-flip-h"></span>قائمة الأنمي</NavLink>
                <NavLink onClick={ () => toggleMenu() } className={ selected == "favorite" ? "menu-item selected" : "menu-item"} to="#"><span className="mdi mdi-star"></span>أنمياتي المفضلة</NavLink>
            </section>
            <div onClick={ () => updateShown(_ => false) } className="main-menu-close">
                <span className="mdi mdi-close mdi-nm"></span>
            </div>
        </nav>
    )
}

export default Navigation