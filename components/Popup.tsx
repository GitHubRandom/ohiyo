import { useState, useEffect, FunctionComponent } from "react"

interface IPopup {
    trigger: string,
    id: string,
    title: string
}

const Popup: FunctionComponent<IPopup> = ({ children, trigger, id, title }) => {

    const [ visible, updateVisibility ] = useState(false)

    useEffect(() => {
        /**
         * Add click listeners to selected triggers
         * to make popup appears. @Ritzy
         */
        if (trigger) {
            if (trigger.startsWith("#")) {
                document.getElementById(trigger.slice(1))?.addEventListener("click", () => {
                    var popup = document.getElementById(id) as HTMLElement
                    popup.style.display = "flex"
                    popup.focus()
                    updateVisibility(true)
                })
            } else if (trigger.startsWith(".")) {
                Array.from(document.getElementsByClassName(trigger.slice(1))).forEach(element => {
                    element.addEventListener("click", () => {
                        var popup = document.getElementById(id) as HTMLElement
                        popup.style.display = "flex"
                        popup.focus()
                        updateVisibility(true)
                    })
                });
            }
        }
    }, [])

    useEffect(() => {
        if (visible) {
            (document.querySelector("body") as HTMLElement).style.overflow = "hidden"
        } else {
            (document.querySelector("body") as HTMLElement).style.overflow = "unset"
        }
    }, [visible])

    return (
        <div id={id} className="popup">
            <div className="popup-container">
                <div className="popup-header">
                    <h2 className="popup-title">{ title }</h2>
                    <div className="popup-close" onClick={ () => { (document.getElementById(id) as HTMLElement).style.display = "none"; updateVisibility(false) } }>إغلاق</div>
                </div>
                { visible ? children : null }
            </div>
        </div>
    )
}

export default Popup