import React from "react"

const HeroIcon = ({ children }) => {
	return (
		<div
			className={`bg-primary-subtle text-primary fs-1 py-3 px-4 rounded-circle shadow`}>
			{children}
		</div>
	)
}

export default HeroIcon
