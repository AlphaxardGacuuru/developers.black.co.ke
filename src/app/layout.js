import { Nunito, Roboto } from 'next/font/google'
import '@/app/global.css'

const nunitoFont = Nunito({
    subsets: ['latin'],
    display: 'swap',
    weight: ['200', '300', '400', '500', '600', '700'],
    variable: '--font-nunito',
})

const robotoFont = Roboto({
    subsets: ['latin'],
    display: 'swap',
    weight: ['100', '300', '400', '500', '700'],
    variable: '--font-roboto',
})

const RootLayout = ({ children }) => {
    return (
        <html lang="en" className={`${nunitoFont.className} ${robotoFont.variable}`}>
            <body className="antialiased font-light">{children}</body>
        </html>
    )
}

export const metadata = {
    title: 'Laravel',
}

export default RootLayout
