import { Nunito, Roboto } from "next/font/google"
import "@/app/global.css"
import { AppProvider } from "@/contexts/AppContext"
import AppContextInjector from "@/components/AppContextInjector"

const nunitoFont = Nunito({
	subsets: ["latin"],
	display: "swap",
	weight: ["200", "300", "400", "500", "600", "700"],
	variable: "--font-nunito",
})

const robotoFont = Roboto({
	subsets: ["latin"],
	display: "swap",
	weight: ["100", "300", "400", "500", "700"],
	variable: "--font-roboto",
})

const RootLayout = ({ children }) => {
	return (
		<html
			lang="en"
			className={`${nunitoFont.className} ${robotoFont.variable}`}>
			<body className="antialiased font-light bg-gradient-to-br from-[#000000] via-[#1a1a1a] to-[#232323] min-h-screen">
				<AppProvider>
					<AppContextInjector>{children}</AppContextInjector>
				</AppProvider>
			</body>
		</html>
	)
}

export const metadata = {
	title: "Laravel",
}

export default RootLayout
