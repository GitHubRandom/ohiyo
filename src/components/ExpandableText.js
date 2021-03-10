import { useState } from "react/cjs/react.development";

const ExpandableText = ({ className, expandText, hideText, text }) => {

    const [ expanded, toggleCollapse ] = useState(false)

    return (
        <>
        { text && text.length >= 120 ?
        <p className={ className }>
            { expanded ? 
            <>{ text } <span id="hide" onClick={ () => toggleCollapse(!expanded) } className="more-text">{ hideText }</span></> 
            :
            <>{ shorten(text,120) + "... " } <span onClick={ () => toggleCollapse(!expanded) } id="show" className="more-text">{ expandText }</span></> }
        </p>
        :
        <p className={ className }>
            { text }
        </p>
        }
        </>
    )
}

function shorten(str, maxLen, separator = ' ') {
    if (!str) return ''
    if (str.length <= maxLen) return str;
    return str.substr(0, str.lastIndexOf(separator, maxLen));
}

export default ExpandableText