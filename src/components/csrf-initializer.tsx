"use client"

import { useEffect, useRef } from "react"
import axios from "@/lib/axios"

export function CsrfInitializer() {
	const initialized = useRef(false)

	useEffect(() => {
		// Only initialize once, even in strict mode
		if (initialized.current) {
			return
		}

		initialized.current = true

		axios.get("/sanctum/csrf-cookie").catch((error: unknown) => {
			console.error("Failed to initialize CSRF cookie:", error)
		})
	}, [])

	return null
}
