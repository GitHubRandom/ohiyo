import Link from 'next/link'
import React from 'react'

const WatchFooter = () => {
    return (
        <footer className="watch-footer">
            <p className="copyright">كل الحقوق محفوظة لموقع <Link href="/"><a className="copyright-animayhem">Animayhem</a></Link></p>
        </footer>
    )
}

export default React.memo(WatchFooter)