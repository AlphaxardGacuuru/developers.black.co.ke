"use client"

import type { Dispatch, ReactNode, SetStateAction } from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { BreadcrumbItem } from "@/types"

type LayoutPropsValue = {
	breadcrumbs: BreadcrumbItem[]
	setBreadcrumbs: Dispatch<SetStateAction<BreadcrumbItem[]>>
}

const LayoutPropsContext = createContext<LayoutPropsValue | null>(null)

/**
 * Holds what money's pages declare as `Page.layout`. A Next layout can't read
 * its page's statics, so pages hand their breadcrumbs up with useBreadcrumbs.
 */
export function LayoutPropsProvider({ children }: { children: ReactNode }) {
	const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([])

	return (
		<LayoutPropsContext.Provider value={{ breadcrumbs, setBreadcrumbs }}>
			{children}
		</LayoutPropsContext.Provider>
	)
}

export function useLayoutProps(): { breadcrumbs: BreadcrumbItem[] } {
	const context = useContext(LayoutPropsContext)

	return { breadcrumbs: context?.breadcrumbs ?? [] }
}

/** Shows `breadcrumbs` in the app header while the calling page is mounted. */
export function useBreadcrumbs(breadcrumbs: BreadcrumbItem[]): void {
	const setBreadcrumbs = useContext(LayoutPropsContext)?.setBreadcrumbs
	const key = JSON.stringify(breadcrumbs)

	useEffect(() => {
		setBreadcrumbs?.(breadcrumbs)

		return () => setBreadcrumbs?.([])
	}, [key])
}

export function Head({ title }: { title: string }) {
	useEffect(() => {
		document.title = `${title} - Black Developers`
	}, [title])

	return null
}
