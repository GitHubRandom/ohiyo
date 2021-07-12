import Link from 'next/link'
import { useRouter } from "next/router"
import Head from "next/head"

const FourOFour = () => {

    const router = useRouter()

    return (
        <>
            <Head>
                <title>خطأ 404 - Animahyem</title>
                <link href="https://fonts.googleapis.com/css?family=M+PLUS+1p" rel="stylesheet" />
            </Head>
            <div className="fourofour-container">
                <h1>四百四</h1>
                <p>لا توجد صفحة في هذا الرابط</p>
                <div className="fourofour-buttons">
                    <div onClick={ () => router.back() } className="fourofour-back-button dark-button"><span className="mdi mdi-keyboard-backspace mdi-flip-h"></span>العودة</div>
                    <Link href="/"><a className="fourofour-home-button dark-button"><span className="mdi mdi-home"></span>الصفحة الرئيسة</a></Link>
                </div>
                <div className="fourofour-watermark">Animayhem</div>
            </div>
        </>
    )
}

export default FourOFour