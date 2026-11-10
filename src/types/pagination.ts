// A Laravel paginated resource collection (meta + links + data).
export type PaginatedResponse<T> = {
	data: T[]
	meta: {
		current_page: number
		last_page: number
		per_page: number
		total: number
		from?: number | null
		to?: number | null
		links?: { url: string | null; label: string; active: boolean }[]
	}
	links?: {
		first?: string | null
		last?: string | null
		prev?: string | null
		next?: string | null
	}
}
