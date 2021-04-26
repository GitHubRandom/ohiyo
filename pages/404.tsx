import { useEffect } from "react"
import Link from 'next/link'

const FourOFour = () => {

    useEffect(() => {
        document.title = "Error 404 - Animahyem"
    }, [])

    return (
        <div className="fourofour-container">
            <h1>四百四</h1>
            <p>لا توجد صفحة في هذا الرابط</p>
            <Link href="/"><a><span className="mdi mdi-home"></span>الصفحة الرئيسة</a></Link>
            <div className="fourofour-watermark">Animayhem</div>
        </div>
    )
}

export default FourOFour