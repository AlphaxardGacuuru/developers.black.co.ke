import type { AxiosError } from "axios"
import type { ChangeEvent, Dispatch, ReactNode, SetStateAction } from "react"
import type { User } from "@/types"

export type FormError = {
	field: string
	message: string[]
}

export type ListMeta = {
	per_page: number
	current_page: number
	total?: number
	last_page?: number
}

export type PaginatedList = {
	meta: ListMeta
}

export type ErrorResponse = {
	errors?: Record<string, string[] | string>
	message?: string
}

export type RequestController = {
	signal?: AbortSignal
}

export type AppContextValue = {
	messages: string[]
	setMessages: Dispatch<SetStateAction<string[]>>
	errors: string[]
	setErrors: Dispatch<SetStateAction<string[]>>
	formErrors: FormError[]
	setFormErrors: Dispatch<SetStateAction<FormError[]>>
	auth: User | undefined
	loadingItems: number
	setLoadingItems: Dispatch<SetStateAction<number>>
	get: <T>(
		endpoint: string,
		setState: Dispatch<SetStateAction<T>>,
		storage?: string | null,
		shouldSetErrors?: boolean,
		controller?: RequestController
	) => Promise<void>
	getPaginated: <T>(
		endpoint: string,
		setState: Dispatch<SetStateAction<T>>,
		storage?: string | null,
		shouldSetErrors?: boolean,
		controller?: RequestController
	) => Promise<void>
	getLocalStorage: <T>(key: string, fallback?: T) => T
	setLocalStorage: (key: string, value: unknown) => void
	iterator: (key: number, list: PaginatedList) => number
	getErrors: (err: AxiosError<ErrorResponse>, includeMessage?: boolean) => void
	getFieldError: (value: unknown) => string | undefined
	formatToCommas: (event: ChangeEvent<HTMLInputElement>) => string
	currentYear: number
	currentMonth: number
	months: string[]
	years: number[]
}

export type AppProviderProps = {
	children: ReactNode
}
