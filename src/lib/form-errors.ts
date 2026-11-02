type ValidationError = {
	response?: {
		status?: number
		data?: { errors?: Record<string, string | string[]> }
	}
}

/**
 * The first message per field of a Laravel 422 response, or null for any
 * other error.
 */
export function validationErrors(
	error: unknown
): Record<string, string> | null {
	const response = (error as ValidationError).response

	if (response?.status !== 422) {
		return null
	}

	return Object.fromEntries(
		Object.entries(response.data?.errors ?? {}).map(([field, messages]) => [
			field,
			Array.isArray(messages) ? String(messages[0] ?? "") : String(messages),
		])
	)
}
