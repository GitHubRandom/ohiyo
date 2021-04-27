import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
    render() {
        return (
            <Html lang="ar">
                <Head>
                    <meta name="google-site-verification" content="-nGbvZaTeYTZbORil3Ks3HI3q_gM0umMHLMEWkhpdl4" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}