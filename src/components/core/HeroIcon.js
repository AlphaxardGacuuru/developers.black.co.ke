import React from "react"

const HeroIcon = ({ children }) => {
	return (
		<div className="bg-white/10 backdrop-blur-xl border border-white/20 text-white text-4xl py-6 px-6 rounded-full shadow-lg hover:bg-white/20 transition-all duration-500">
			{children}
		</div>
	)
}

export default HeroIcon
