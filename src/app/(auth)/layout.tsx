"use client"

import type { ReactNode } from "react"
import AuthLayout from "@/layouts/auth-layout"
import { LayoutPropsProvider, useLayoutProps } from "@/lib/spa"

function AuthLayoutWithProps({ children }: { children: ReactNode }) {
	const { title, description } = useLayoutProps()

	return (
		<AuthLayout
			title={title}
			description={description}>
			{children}
		</AuthLayout>
	)
}

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<LayoutPropsProvider>
			<AuthLayoutWithProps>{children}</AuthLayoutWithProps>
		</LayoutPropsProvider>
	)
}
