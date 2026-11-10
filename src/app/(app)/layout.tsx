"use client"

import type { ReactNode } from "react"
import Loading from "@/app/(app)/Loading"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useAuth } from "@/hooks/auth"
import AppLayout from "@/layouts/app-layout"
import { LayoutPropsProvider, useLayoutProps } from "@/lib/spa"

function AppLayoutWithBreadcrumbs({ children }: { children: ReactNode }) {
	const { breadcrumbs } = useLayoutProps()

	return <AppLayout breadcrumbs={breadcrumbs}>{children}</AppLayout>
}

export default function Layout({ children }: { children: ReactNode }) {
	const { user } = useAuth({ middleware: "auth" })

	if (!user) {
		return <Loading />
	}

	return (
		<TooltipProvider delayDuration={0}>
			<LayoutPropsProvider>
				<AppLayoutWithBreadcrumbs>{children}</AppLayoutWithBreadcrumbs>
			</LayoutPropsProvider>
		</TooltipProvider>
	)
}
