import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
    render() {
        return (
            <Html lang="ar">
                <Head>
                    <meta name="google-site-verification" content="-nGbvZaTeYTZbORil3Ks3HI3q_gM0umMHLMEWkhpdl4" />
                    <script data-ad-client="ca-pub-7290706763753135" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}