import { useQuery } from "@tanstack/react-query"
import { isAxiosError } from "axios"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useApp } from "@/contexts/AppContext"
import axios from "@/lib/axios"
import { queryClient } from "@/lib/query-client"
import { AUTH_QUERY, isUnverified } from "@/middleware/auth"

export const AUTH_QUERY_KEY = AUTH_QUERY.queryKey

type Errors = Record<string, string[]>
type SetErrors = (errors: Errors) => void
type SetStatus = (status: string | null) => void

type UseAuthOptions = {
	middleware?: "auth" | "guest"
	redirectIfAuthenticated?: string
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

	const { data: user, error } = useQuery(AUTH_QUERY)

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

		return axios
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

		return axios
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

		return axios
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

		return axios
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

		if (isUnverified(error)) {
			router.push("/verify-email")

			return
		}

		if (middleware === "auth" && error) {
			logout()
		}
	}, [user, error])

	return {
		user,
		register,
		login,
		forgotPassword,
		resetPassword,
		resendEmailVerification,
		logout,
		authLoading,
	}
}
