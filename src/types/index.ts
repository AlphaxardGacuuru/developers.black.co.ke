import type { LucideIcon } from "lucide-react"

// What /api/user returns (the fields the app shell uses).
export type User = {
	id: string | number
	name: string
	email: string
	avatar?: string | null
	[key: string]: unknown
}

export type NavItem = {
	title: string
	href: string
	icon?: LucideIcon
}
