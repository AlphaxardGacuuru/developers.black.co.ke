import React, { useEffect, useState } from "react"
import { ToastContainer, toast, Bounce } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const Messages = ({
	messages,
	setMessages,
	errors,
	setErrors,
	setFormErrors,
}) => {
	const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
	const [isSmallMobile, setIsSmallMobile] = useState(window.innerWidth <= 480)

	// Handle window resize
	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 768)
			setIsSmallMobile(window.innerWidth <= 480)
		}

		window.addEventListener("resize", handleResize)
		return () => window.removeEventListener("resize", handleResize)
	}, [])

	useEffect(() => {
		// Display messages and errors as toasts
		if (messages.length > 0) {
			messages.forEach((message) => toast.success(message))
			setTimeout(() => setMessages([]), 2900)
		}

		if (errors.length > 0) {
			errors.forEach((validationErrors) => {
				// Check if validationErrors is an array
				if (Array.isArray(validationErrors)) {
					validationErrors.forEach((error) => toast.error(error))
				} else {
					toast.warning(validationErrors)
				}
			})
			setTimeout(() => setErrors([]), 2900)
			setTimeout(() => setFormErrors([]), 10000)
		}

		return () => {}
	}, [messages, errors])

	return (
		<ToastContainer
			toastId="messages-toast" // Unique ID for this toast
			position="top-right"
			autoClose={10000}
			hideProgressBar={false}
			newestOnTop={false}
			closeOnClick
			rtl={false}
			pauseOnFocusLoss
			draggable
			draggablePercent={40}
			pauseOnHover
			theme="colored"
			transition={Bounce}
			style={{
				zIndex: 1000002,
				fontSize: isSmallMobile ? "14px" : "16px",
				width: isSmallMobile ? "55%" : isMobile ? "50%" : "",
				left: isMobile ? "70%" : "",
				transform: isMobile ? "translateX(-50%)" : "",
				top: isMobile ? "10px" : "",
			}}
			toastStyle={{
				minHeight: isSmallMobile ? "50px" : "68px",
				fontSize: isSmallMobile ? "14px" : "16px",
				margin: isSmallMobile ? "4px 0" : "",
				// borderRadius: isSmallMobile ? "6px" : "",
				padding: isSmallMobile ? "8px 12px" : "",
			}}
		/>
	)
}

export default Messages
