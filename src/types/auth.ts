// What /api/user returns.
export type User = {
	id: number
	name: string
	email: string
	avatar?: string
	email_verified_at: string | null
	can_view_telescope?: boolean
	can_view_pulse?: boolean
	created_at?: string
	updated_at?: string
	[key: string]: unknown
}
