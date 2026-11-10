// A client is a user with type "client" (UserResource returns the model).
export type Client = {
	id: number
	name: string
	email: string
	phone?: string | null
	type?: string | null
	createdAt?: string
	created_at?: string
	updated_at?: string
}
