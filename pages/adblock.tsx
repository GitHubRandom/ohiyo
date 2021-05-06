import { useRouter } from "next/router"
import Head from "next/head"

const AntiADB = () => {
    const router = useRouter()
    return (
        <>
            <Head>
                <title>Animahyem</title>
            </Head>
            <div className="bl-container">
                <h1>المرجو تعطيل مانع الإعلانات</h1>
                <p>الإعلانات تمكن من إبقاء الموقع مجاني</p>
                <div className="bl-buttons">
                    <div onClick={ () => router.reload() } className="bl-back-button dark-button"><span className="mdi mdi-restart mdi-flip-h"></span>إعادة المحاولة</div>
                </div>
                <div className="bl-watermark">Animayhem</div>
            </div>
        </>
    )
}

export default AntiADB