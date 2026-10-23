'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

// Every experiment except the home page is desktop-only: on mobile show a label and don't mount the page.
export default function DesktopGate({ children }) {
    const pathname = usePathname()
    const [mobile, setMobile] = useState(null)

    useEffect(() => {
        const mq = window.matchMedia('(max-width: 767px)')
        const update = () => setMobile(mq.matches)
        update()
        mq.addEventListener('change', update)
        return () => mq.removeEventListener('change', update)
    }, [])

    if (pathname === '/') return children
    if (mobile === null) return null
    if (mobile) return (
        <main className="h-dvh flex items-center justify-center px-8">
            <p className="display text-3xl text-center">This experiment is for desktop only.</p>
        </main>
    )
    return children
}
