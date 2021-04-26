import Document, { Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
    render() {
        return (
            <html lang="ar">
                <Head>
                    <script data-ad-client="ca-pub-7290706763753135" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </html>
        )
    }
}