"use client"

import type { ReactNode } from "react"
import Loading from "@/app/(app)/Loading"
import { AppBottomNav } from "@/components/app-bottom-nav"
import { AppSidebar } from "@/components/app-sidebar"
import { AppSidebarHeader } from "@/components/app-sidebar-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useAuth } from "@/hooks/auth"
import type { User } from "@/types"

// The signed-in shell shared with the other Black apps: a floating sidebar
// on the right and a floating header above the page.
const AppLayout = ({ children }: { children: ReactNode }) => {
	const { user } = useAuth({ middleware: "auth" }) as { user?: User }

	if (!user) {
		return <Loading />
	}

	return (
		<TooltipProvider delayDuration={0}>
			<SidebarProvider defaultOpen={true}>
				<SidebarInset className="bg-transparent pb-24 md:pb-0">
					<AppSidebarHeader user={user} />
					<div className="flex flex-1 flex-col gap-4 overflow-x-hidden">
						{children}
					</div>
				</SidebarInset>
				<AppSidebar user={user} />
				<AppBottomNav />
			</SidebarProvider>
		</TooltipProvider>
	)
}

export default AppLayout
