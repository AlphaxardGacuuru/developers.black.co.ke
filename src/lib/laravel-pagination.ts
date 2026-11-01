type LaravelPage = {
	meta?: {
		current_page: number
		last_page: number
		per_page: number
		total: number
		links?: { url: string | null; active: boolean }[]
	}
}

type Fetch<TList> = (
	endpoint: string,
	setState: (list: TList) => void
) => void

// A paginated Laravel resource as the DataTable's server pagination. Pages are
// fetched from the list's own links so its filters are kept.
export function laravelPagination<TList extends LaravelPage>(
	list: TList,
	getPaginated: Fetch<TList>,
	setState: (list: TList) => void
) {
	const meta = list.meta

	const fetchPage = (page: number, perPage = meta?.per_page) => {
		const link =
			meta?.links?.find((pageLink) => pageLink.url && pageLink.active) ??
			meta?.links?.find((pageLink) => pageLink.url)

		if (!link?.url) {
			return
		}

		const url = new URL(link.url)

		url.searchParams.set("page", String(page))
		url.searchParams.set("per_page", String(perPage))

		getPaginated(
			url.toString().replace(/^(?:\/\/|[^/]+)*\/api\//, ""),
			setState
		)
	}

	return {
		currentPage: meta?.current_page ?? 1,
		lastPage: meta?.last_page ?? 1,
		total: meta?.total ?? 0,
		pageSize: meta?.per_page ?? 10,
		onPageChange: (page: number) => fetchPage(page),
		onPageSizeChange: (pageSize: number) => fetchPage(1, pageSize),
	}
}
