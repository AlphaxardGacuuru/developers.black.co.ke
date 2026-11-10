import { queryOptions } from "@tanstack/react-query"
import { isAxiosError } from "axios"
import axios from "@/lib/axios"
import type { User } from "@/types"

export const AUTH_QUERY = queryOptions({
	queryKey: ["auth"] as const,
	queryFn: (): Promise<User> => axios.get("/api/user").then((res) => res.data),
	// A 401 means the session is gone and a 409 that the email isn't verified;
	// retrying either only delays sending the user where they need to go.
	retry: (failureCount, error) =>
		!isUnauthenticated(error) && !isUnverified(error) && failureCount < 3,
})

export function isUnauthenticated(error: unknown): boolean {
	return isAxiosError(error) && error.response?.status === 401
}

export function isUnverified(error: unknown): boolean {
	return isAxiosError(error) && error.response?.status === 409
}
