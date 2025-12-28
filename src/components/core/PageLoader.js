import React, { useState, useEffect } from "react"

import { ToastContainer, toast, Bounce } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const PageLoader = (props) => {
	const [called, setCalled] = useState(false)
	const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
	const [isSmallMobile, setIsSmallMobile] = useState(window.innerWidth <= 480)

	const Spinner = (
		<div className="d-flex justify-content-between align-items-center">
			<div>Loading items</div>
			<div
				className="text-white spinner-border border-2 my-auto mx-2"
				style={{ color: "inherit" }}></div>
		</div>
	)

	// Check if there are loading items and show toast
	useEffect(() => {
		if (props.loadingItems > 0) {
			if (!called) {
				toast.info(Spinner, {
					toastId: "page-loader-toast", // Unique ID for this toast
					position: "top-center",
					autoClose: false,
					hideProgressBar: false,
					newestOnTop: false,
					closeOnClick: false,
					rtl: false,
					pauseOnFocusLoss: true,
					draggable: false,
					draggablePercent: 40,
					pauseOnHover: true,
					theme: "colored",
					transition: Bounce,
					closeButton: false,
					stacked: false,
					style: {
						fontSize: isSmallMobile ? "14px" : "16px",
						// width: isSmallMobile ? "55%" : isMobile ? "50%" : "",
						right: isMobile ? "30%" : "",
						// left: isMobile ? "20%" : "",
						// transform: isMobile ? "translateX(-50%)" : "",
						// top: isMobile ? "1em" : "",
					},
					toastStyle: {
						minHeight: isSmallMobile ? "50px" : "68px",
						fontSize: isSmallMobile ? "14px" : "16px",
						margin: isSmallMobile ? "4px 0" : "",
						// borderRadius: isSmallMobile ? "6px" : "",
						padding: isSmallMobile ? "8px 12px" : "",
					},
				})

				setCalled(true)
			}
		} else {
			setCalled(false)
			toast.dismiss("page-loader-toast")
		}
	}, [props.loadingItems])

	return <div className="py-3"></div>
}

export default PageLoader
