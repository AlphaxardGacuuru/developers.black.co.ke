import type { Metadata, Viewport } from "next"
import { Instrument_Sans } from "next/font/google"
import type { ReactNode } from "react"
import "@/app/global.css"
import { AppProvider } from "@/contexts/AppContext"
import AppContextInjector from "@/components/AppContextInjector"
import CsrfInitializer from "@/components/CsrfInitializer"
import { Toaster } from "@/components/ui/sonner"

// The same font as the other Black apps.
const instrumentSans = Instrument_Sans({
	subsets: ["latin"],
	display: "swap",
	weight: ["400", "500", "600", "700"],
	variable: "--font-instrument-sans",
})

// Apply the saved appearance (Settings > Appearance) before first paint,
// falling back to the system setting, like the other Black apps.
const appearanceScript = `(function () {
	var appearance = "system"
	try {
		appearance = localStorage.getItem("appearance") || "system"
	} catch (e) {}
	var dark =
		appearance === "dark" ||
		(appearance === "system" &&
			window.matchMedia("(prefers-color-scheme: dark)").matches)
	document.documentElement.classList.toggle("dark", dark)
	document.documentElement.style.colorScheme = dark ? "dark" : "light"
})()`

const RootLayout = ({ children }: { children: ReactNode }) => {
	return (
		<html
			lang="en"
			className={instrumentSans.variable}
			suppressHydrationWarning>
			<head>
				<script dangerouslySetInnerHTML={{ __html: appearanceScript }} />
			</head>
			<body
				className="min-h-screen font-sans antialiased"
				suppressHydrationWarning>
				<AppProvider>
					<CsrfInitializer />
					<AppContextInjector>{children}</AppContextInjector>
				</AppProvider>
				<Toaster />
			</body>
		</html>
	)
}

export const metadata: Metadata = {
	title: "Black Developers",
}

export const viewport: Viewport = {
	themeColor: "#000000",
}

export default RootLayout
