"use client"

import { ArrowUp } from "lucide-react"
import { useEffect, useState } from "react"

/**
 * A floating "back to top" button for long pages. It appears once the
 * visitor has scrolled a little way down and scrolls the window back up
 * (instantly when they prefer reduced motion).
 */
/**
 * How far down (in px) the button appears.
 */
const SHOW_AFTER_PX = 400

export default function ScrollToTopButton() {
	const [visible, setVisible] = useState(false)

	useEffect(() => {
		const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX)

		onScroll()
		window.addEventListener("scroll", onScroll, { passive: true })

		return () => window.removeEventListener("scroll", onScroll)
	}, [])

	const scrollToTop = () => {
		const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

		window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" })
	}

	return (
		<button
			type="button"
			onClick={scrollToTop}
			aria-label="Back to top"
			title="Back to top"
			tabIndex={visible ? 0 : -1}
			aria-hidden={!visible}
			className={`fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#1a1a1a] shadow-black/30 focus-visible:ring-white/60 shadow-lg transition-all duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-[3px] sm:right-6 sm:bottom-6 ${
				visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
			}`}>
			<ArrowUp className="h-5 w-5" />
		</button>
	)
}
