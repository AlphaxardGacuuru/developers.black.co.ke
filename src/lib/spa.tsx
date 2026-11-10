"use client"

import type { Dispatch, ReactNode, SetStateAction } from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { BreadcrumbItem } from "@/types"

/** What money's pages declare as `Page.layout`. */
export type LayoutProps = {
	breadcrumbs?: BreadcrumbItem[]
	title?: string
	description?: string
}

type LayoutPropsValue = {
	layoutProps: LayoutProps
	setLayoutProps: Dispatch<SetStateAction<LayoutProps>>
}

const LayoutPropsContext = createContext<LayoutPropsValue | null>(null)

/**
 * A Next layout can't read its page's statics the way money's router reads
 * `Page.layout`, so pages hand their layout props up with useLayout instead.
 */
export function LayoutPropsProvider({ children }: { children: ReactNode }) {
	const [layoutProps, setLayoutProps] = useState<LayoutProps>({})

	return (
		<LayoutPropsContext.Provider value={{ layoutProps, setLayoutProps }}>
			{children}
		</LayoutPropsContext.Provider>
	)
}

export function useLayoutProps(): LayoutProps {
	return useContext(LayoutPropsContext)?.layoutProps ?? {}
}

/** Passes `layoutProps` to the surrounding layout while the calling page is mounted. */
export function useLayout(layoutProps: LayoutProps): void {
	const setLayoutProps = useContext(LayoutPropsContext)?.setLayoutProps
	const key = JSON.stringify(layoutProps)

	useEffect(() => {
		setLayoutProps?.(layoutProps)

		return () => setLayoutProps?.({})
	}, [key])
}

export function Head({ title }: { title: string }) {
	useEffect(() => {
		document.title = `${title} - Black Developers`
	}, [title])

	return null
}
