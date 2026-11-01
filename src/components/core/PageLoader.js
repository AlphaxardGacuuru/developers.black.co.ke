import { useEffect } from "react"
import { toast } from "@/lib/toast"

const PAGE_LOADER_TOAST = "page-loader-toast"

const PageLoader = (props) => {
	// Show one loading toast while anything is loading
	useEffect(() => {
		if (props.loadingItems > 0) {
			toast.loading("Loading items", {
				id: PAGE_LOADER_TOAST,
				duration: Infinity,
			})
		} else {
			toast.dismiss(PAGE_LOADER_TOAST)
		}
	}, [props.loadingItems])

	return null
}

export default PageLoader
