"use client"

import { useEffect, useRef } from "react"
import type { Workbox } from "workbox-window"
import toast from "@/lib/toast"

declare global {
	interface Window {
		// Created by next-pwa's entry script, left unregistered so the
		// "waiting" listener below is in place first (register: false in
		// next.config.js).
		workbox?: Workbox
	}
}

/**
 * Registers the service worker and offers a refresh when a new version is
 * waiting, like the other Black apps, instead of letting it take over open
 * tabs mid-session (skipWaiting: false in next.config.js).
 */
export function ServiceWorkerUpdater() {
	const registered = useRef(false)

	useEffect(() => {
		const wb = window.workbox

		// Only register once, even in strict mode
		if (registered.current || !("serviceWorker" in navigator) || !wb) {
			return
		}

		registered.current = true

		wb.addEventListener("waiting", () => {
			toast("A new version is available", {
				id: "new-version",
				duration: Infinity,
				action: {
					label: "Refresh",
					onClick: () => {
						wb.addEventListener("controlling", () => {
							window.location.reload()
						})
						wb.messageSkipWaiting()
					},
				},
			})
		})

		wb.register().catch(() => {
			// Ignore registration failures and keep the web app functional.
		})
	}, [])

	return null
}
