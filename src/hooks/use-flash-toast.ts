import { useEffect } from "react"
import { useApp } from "@/contexts/AppContext"
import { toast } from "@/lib/toast"

const PAGE_LOADER_TOAST = "page-loader-toast"

/**
 * Next has no server flash like money's Laravel views, so this shows what
 * pages put in the app context instead: messages, errors and one loading
 * toast while anything is being fetched.
 */
export function useFlashToast(): void {
	const { messages, setMessages, errors, setErrors, setFormErrors, loadingItems } =
		useApp()

	useEffect(() => {
		if (messages.length === 0) {
			return
		}

		messages.forEach((message) => toast.success(message))
		setMessages([])
	}, [messages])

	useEffect(() => {
		if (errors.length === 0) {
			return
		}

		errors.forEach((error) => toast.error(error))
		setErrors([])

		const timeout = setTimeout(() => setFormErrors([]), 10000)

		return () => clearTimeout(timeout)
	}, [errors])

	useEffect(() => {
		if (loadingItems > 0) {
			toast.loading("Loading items", {
				id: PAGE_LOADER_TOAST,
				duration: Infinity,
			})
		} else {
			toast.dismiss(PAGE_LOADER_TOAST)
		}
	}, [loadingItems])
}
