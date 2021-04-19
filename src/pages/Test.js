import { useEffect } from "react"

const Test = () => {
    useEffect(() => {
        fetch("../api/latest").then(response => response.text()).then(data => alert(data))
    })
    return <>Test Fetch</>
}

export default Test