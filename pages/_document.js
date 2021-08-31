import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
    render() {
        return (
            <Html lang="ar">
                <Head>
                    <meta name="google-site-verification" content="-nGbvZaTeYTZbORil3Ks3HI3q_gM0umMHLMEWkhpdl4" />
                    <meta name="a.validate.01" content="4b0a3f07bf7f69576f919840b17b3a5eb93d" />
                    <script src="/hls.min.js"></script>
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}