import { useEffect } from "react"
import { toast } from "@/lib/toast"

const Messages = ({
	messages,
	setMessages,
	errors,
	setErrors,
	setFormErrors,
}) => {
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
	}, [messages, errors])

	return null
}

export default Messages
