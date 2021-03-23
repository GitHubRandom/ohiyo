import { useState, useEffect } from "react"

const Popup = ({ children, trigger, id, title }) => {

    const [ visible, updateVisibility ] = useState(false)

    useEffect(() => {
        /**
         * Add click listeners to selected triggers
         * to make popup appears. @Ritzy
         */
        if (trigger) {
            if (trigger.startsWith("#")) {
                document.getElementById(trigger.slice(1)).addEventListener("click", () => {
                    var popup = document.getElementById(id)
                    popup.style.display = "flex"
                    popup.focus()
                    updateVisibility(true)
                })
            } else if (trigger.startsWith(".")) {
                document.getElementsByClassName(trigger.slice(1)).array.forEach(element => {
                    element.addEventListener("click", () => {
                        var popup = document.getElementById(id)
                        popup.style.display = "flex"
                        popup.focus()
                        updateVisibility(true)
                    })
                });
            }
        }
    })

    return (
        <div id={id} className="popup">
            <div className="popup-container">
                <div className="popup-header">
                    <h2 className="popup-title">{ title }</h2>
                    <div className="popup-close" onClick={ () => { document.getElementById(id).style.display = "none"; updateVisibility(false) } }>إغلاق</div>
                </div>
                { visible ? children : null }
            </div>
        </div>
    )
}

export default Popup