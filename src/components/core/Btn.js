import React, { useEffect } from "react"

const Btn = ({
	btnStyle,
	className,
	icon,
	iconFront,
	text,
	onClick,
	loading,
	dataBsToggle,
	dataBsTarget,
	tooltipText,
	tooltipBgColor,
	tooltipPlacement,
}) => {
	return (
		<button
			style={btnStyle}
			className={`mt-20 p-1 px-5 rounded-3xl text-white bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-700 ease-out group ${className}`}
			onClick={onClick}
			disabled={loading}
			data-bs-toggle={dataBsToggle}
			data-bs-target={dataBsTarget}
			data-bs-placement={tooltipPlacement}
			title={tooltipText}>
			<div className="d-flex">
				{/* Icon Start */}
				<span style={{ color: "inherit" }}>{icon}</span>
				{/* Icon End */}

				{/* Text Start */}
				{text && (
					<span
						className="mx-1"
						style={{ color: "inherit" }}>
						{text}
					</span>
				)}
				{/* Text End */}

				{/* Icon Front Start */}
				<span style={{ color: "inherit" }}>{iconFront}</span>
				{/* Icon Front End */}

				{/* Loading Start */}
				{/* {loading && (
					<div>
						<div
							className="spinner-border spinner-border-sm"
							style={{ color: "inherit" }}></div>
					</div>
				)} */}
				{/* Loading Start */}
				{loading && (
					<div className="d-flex justify-content-center align-items-center">
						<div
							id="sonar-load"
							style={{ bottom: "0" }}></div>
					</div>
				)}
				{/* Loading End */}

				{/* Loading End */}
			</div>
		</button>
	)
}

Btn.defaultProps = {
	loading: false,
	disabled: false,
	tooltipBgColor: "primary", // Bootstrap primary background (optional if using Bootstrap's native tooltips)
	tooltipPlacement: "top", // Default tooltip placement
}
export default Btn
