"use client"

import type { AxiosError } from "axios"
import { isCancel } from "axios"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import type { ChangeEvent } from "react"
import { initializeTheme } from "@/hooks/use-appearance"
import Axios from "@/lib/axios"
import { AUTH_QUERY } from "@/middleware/auth"
import type {
	AppContextValue,
	AppProviderProps,
	ErrorResponse,
	FormError,
	PaginatedList,
} from "@/types/app-context"

const MONTHS = [
	"Select Month",
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
]

const AppContext = createContext<AppContextValue | undefined>(undefined)

export const useApp = (): AppContextValue => {
	const context = useContext(AppContext)

	if (!context) {
		throw new Error("useApp must be used within AppProvider")
	}

	return context
}

export const AppProvider = ({ children }: AppProviderProps) => {
	function getLocalStorage<T>(key: string, fallback = [] as T): T {
		if (typeof window === "undefined") {
			return fallback
		}

		const value = window.localStorage.getItem(key)

		if (!value) {
			return fallback
		}

		return JSON.parse(value) as T
	}

	function setLocalStorage(key: string, value: unknown): void {
		if (typeof window === "undefined") {
			return
		}

		window.localStorage.setItem(key, JSON.stringify(value))
	}

	const withLoading = (
		endpoint: string,
		fn: () => Promise<void>
	): Promise<void> => {
		const shouldTrack = endpoint !== "notifications"

		if (shouldTrack) {
			setLoadingItems((prev) => prev + 1)
		}

		return fn().finally(() => {
			if (shouldTrack) {
				setLoadingItems((prev) => Math.max(0, prev - 1))
			}
		})
	}

	const [messages, setMessages] = useState<string[]>([])
	const [errors, setErrors] = useState<string[]>([])
	const [formErrors, setFormErrors] = useState<FormError[]>([])
	const [loadingItems, setLoadingItems] = useState(0)

	const get: AppContextValue["get"] = (
		endpoint,
		setState,
		storage = null,
		shouldSetErrors = true,
		controller
	) => {
		return withLoading(endpoint, () =>
			Axios.get(`/api/${endpoint}`, {
				signal: controller?.signal,
			})
				.then((response) => {
					const data = response.data?.data ?? []
					setState(data)

					if (storage) {
						setLocalStorage(storage, data)
					}
				})
				.catch((error) => {
					if (isCancel(error)) {
						return
					}

					if (shouldSetErrors) {
						setErrors([`Failed to fetch ${endpoint.split("?")[0]}`])
					}
				})
		)
	}

	const getPaginated: AppContextValue["getPaginated"] = (
		endpoint,
		setState,
		storage = null,
		shouldSetErrors = true,
		controller
	) => {
		return withLoading(endpoint, () =>
			Axios.get(`/api/${endpoint}`, {
				signal: controller?.signal,
			})
				.then((response) => {
					const data = response.data ?? []
					setState(data)

					if (storage) {
						setLocalStorage(storage, data)
					}
				})
				.catch((error) => {
					if (isCancel(error)) {
						return
					}

					if (shouldSetErrors) {
						setErrors([`Failed to fetch ${endpoint.split("?")[0]}`])
					}
				})
		)
	}

	const iterator = (key: number, list: PaginatedList): number => {
		return key + 1 + list.meta.per_page * (list.meta.current_page - 1)
	}

	const getErrors = (
		err: AxiosError<ErrorResponse>,
		includeMessage = false
	): void => {
		const validationErrors = err.response?.data?.errors ?? {}

		const errorList: string[] = []
		const keyedErrors: FormError[] = []

		for (const [field, message] of Object.entries(validationErrors)) {
			const messages = Array.isArray(message) ? message : [message]
			errorList.push(...messages)
			keyedErrors.push({ field, message: messages })
		}

		if (includeMessage && err.response?.data?.message) {
			errorList.push(err.response.data.message)
		}

		setErrors(errorList)
		setFormErrors(keyedErrors)
	}

	const getFieldError = (value: unknown): string | undefined => {
		if (typeof value === "string") {
			return value
		}

		if (Array.isArray(value) && typeof value[0] === "string") {
			return value[0]
		}

		return undefined
	}

	const formatToCommas = (event: ChangeEvent<HTMLInputElement>): string => {
		let value = event.target.value.toString().replace(/[^0-9.]/g, "")
		value = Number(value).toString()
		event.target.value = Number(value || 0).toLocaleString("en-US")

		return event.target.value.replace(/,/g, "")
	}

	const { currentYear, currentMonth, years } = useMemo(() => {
		const date = new Date()
		const year = date.getFullYear()

		return {
			currentYear: year,
			currentMonth: date.getMonth() + 1,
			years: Array.from({ length: year - 2009 }, (_, index) => year - index),
		}
	}, [])

	const { data: auth } = useQuery(AUTH_QUERY)

	useEffect(() => {
		initializeTheme()
	}, [])

	const value: AppContextValue = {
		messages,
		setMessages,
		errors,
		setErrors,
		formErrors,
		setFormErrors,
		auth,
		loadingItems,
		setLoadingItems,
		get,
		getPaginated,
		getLocalStorage,
		setLocalStorage,
		iterator,
		getErrors,
		getFieldError,
		formatToCommas,
		currentYear,
		currentMonth,
		months: MONTHS,
		years,
	}

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
