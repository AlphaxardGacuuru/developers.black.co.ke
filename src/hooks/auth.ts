import { useQuery } from "@tanstack/react-query"
import { isAxiosError } from "axios"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useApp } from "@/contexts/AppContext"
import axios from "@/lib/axios"
import { queryClient } from "@/lib/query-client"
import type { User } from "@/types"

export const AUTH_QUERY_KEY = ["auth"] as const

type Errors = Record<string, string[]>
type SetErrors = (errors: Errors) => void
type SetStatus = (status: string | null) => void

type UseAuthOptions = {
	middleware?: "auth" | "guest"
	redirectIfAuthenticated?: string
}

function isUnauthenticated(error: unknown): boolean {
	return isAxiosError(error) && error.response?.status === 401
}

/** Re-throws anything that isn't a 422 and hands the validation errors to `setErrors`. */
function handleValidationError(error: unknown, setErrors: SetErrors): void {
	if (!isAxiosError(error) || error.response?.status !== 422) {
		throw error
	}

	setErrors(error.response.data.errors)
}

export const useAuth = ({
	middleware,
	redirectIfAuthenticated,
}: UseAuthOptions = {}) => {
	const appProps = useApp()
	const router = useRouter()
	const params = useParams<{ token?: string }>()

	const [authLoading, setAuthLoading] = useState(false)

	const { data: user, error } = useQuery({
		queryKey: AUTH_QUERY_KEY,
		queryFn: (): Promise<User | null> =>
			axios
				.get("/api/user")
				.then((res) => res.data)
				.catch((error) => {
					if (!isAxiosError(error) || error.response?.status !== 409) {
						throw error
					}

					router.push("/verify-email")

					return null
				}),
		// A 401 means the session is gone; retrying only delays sending the user to /login.
		retry: (failureCount, error) =>
			!isUnauthenticated(error) && failureCount < 3,
	})

	const refreshUser = () =>
		queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY })

	const csrf = () => axios.get("/sanctum/csrf-cookie")

	const register = async ({
		setErrors,
		...props
	}: { setErrors: SetErrors } & Record<string, unknown>) => {
		await csrf()

		setErrors({})
		setAuthLoading(true)

		axios
			.post("/register", props)
			.then(() => refreshUser())
			.catch((error) => handleValidationError(error, setErrors))
			.finally(() => setAuthLoading(false))
	}

	const login = async ({
		setErrors,
		setStatus,
		...props
	}: { setErrors: SetErrors; setStatus: SetStatus } & Record<
		string,
		unknown
	>) => {
		await csrf()

		setErrors({})
		setStatus(null)
		setAuthLoading(true)

		axios
			.post("/login", props)
			.then(() => {
				appProps.setMessages(["Login Successful!"])

				refreshUser()
			})
			.catch((error) => handleValidationError(error, setErrors))
			.finally(() => setAuthLoading(false))
	}

	const forgotPassword = async ({
		setErrors,
		setStatus,
		email,
	}: {
		setErrors: SetErrors
		setStatus: SetStatus
		email: string
	}) => {
		await csrf()

		setErrors({})
		setStatus(null)

		axios
			.post("/forgot-password", { email })
			.then((response) => setStatus(response.data.status))
			.catch((error) => handleValidationError(error, setErrors))
	}

	const resetPassword = async ({
		setErrors,
		setStatus,
		...props
	}: { setErrors: SetErrors; setStatus: SetStatus } & Record<
		string,
		unknown
	>) => {
		await csrf()

		setErrors({})
		setStatus(null)

		axios
			.post("/reset-password", { token: params.token, ...props })
			.then((response) =>
				router.push("/login?reset=" + btoa(response.data.status))
			)
			.catch((error) => handleValidationError(error, setErrors))
	}

	const resendEmailVerification = ({ setStatus }: { setStatus: SetStatus }) => {
		axios
			.post("/email/verification-notification")
			.then((response) => setStatus(response.data.status))
	}

	const logout = async () => {
		if (!error) {
			await axios.post("/logout").then(() => refreshUser())
		}

		window.location.pathname = "/login"
	}

	useEffect(() => {
		if (middleware === "guest" && redirectIfAuthenticated && user) {
			router.push(redirectIfAuthenticated)
		}

		if (
			window.location.pathname === "/verify-email" &&
			user?.email_verified_at &&
			redirectIfAuthenticated
		) {
			router.push(redirectIfAuthenticated)
		}

		if (middleware === "auth" && error) {
			logout()
		}
	}, [user, error])

	return {
		user: user ?? undefined,
		register,
		login,
		forgotPassword,
		resetPassword,
		resendEmailVerification,
		logout,
		authLoading,
	}
}
