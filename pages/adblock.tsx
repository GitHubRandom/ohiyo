import { useRouter } from "next/router"
import Head from "next/head"
import Image from "next/image"
import { useEffect, useState } from "react"

const AntiADB = () => {
    const router = useRouter()
    const [ userAgent, updateUA ] = useState<string>("")

    useEffect(() => {
        updateUA(navigator.userAgent)
    }, [])

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
                { userAgent.includes("Firefox") ?
                <div className="bl-ff-note">
                    <h3>لمستعملي Firefox :</h3>
                    <p>بالإضافة إلى مانع الإعلانات٬ المرجو تعطيل هذه الخاصية أيضا</p>
                    <Image src="/firefox-note.png" layout="responsive" width={ 300 } height={ 225 } />
                </div> : null }
                <div className="bl-watermark">Animayhem</div>
            </div>
        </>
    )
}

export default AntiADB