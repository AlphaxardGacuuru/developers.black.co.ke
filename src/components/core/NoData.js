import React from "react"

const NoData = () => {
	return (
		<div className="bg-white text-center w-100 py-5">
			<img
				src="/img/no-data-found.jpg"
				alt="No entries found"
				style={{ width: "30%", height: "auto" }}
			/>
			<h5 className="opacity-50">We didn't find anything</h5>
		</div>
	)
}

export default NoData
