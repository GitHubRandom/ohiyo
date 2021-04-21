import { NavLink } from "react-router-dom"

const FourOFour = () => {
    return (
        <div className="fourofour-container">
            <h1>四百四</h1>
            <p>لا توجد صفحة في هذا الرابط</p>
            <NavLink to="/"><span className="mdi mdi-home"></span>الصفحة الرئيسة</NavLink>
            <div className="fourofour-watermark">Animayhem</div>
        </div>
    )
}

export default FourOFour