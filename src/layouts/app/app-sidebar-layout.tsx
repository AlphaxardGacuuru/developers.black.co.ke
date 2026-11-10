import { AppBottomNav } from "@/components/app-bottom-nav"
import { AppContent } from "@/components/app-content"
import { AppShell } from "@/components/app-shell"
import { AppSidebar } from "@/components/app-sidebar"
import { AppSidebarHeader } from "@/components/app-sidebar-header"
import type { AppLayoutProps } from "@/types"

export default function AppSidebarLayout({
	children,
	breadcrumbs = [],
}: AppLayoutProps) {
	return (
		<AppShell variant="sidebar">
			<AppSidebar />
			{/* min-w-0 lets wide tables scroll inside the page instead of pushing the sidebar off-screen */}
			<AppContent
				variant="sidebar"
				className="min-w-0 bg-transparent pb-24 md:pb-0">
				<AppSidebarHeader
					breadcrumbs={breadcrumbs}
					variant="floating"
				/>
				<div className="flex flex-1 flex-col gap-4 overflow-x-hidden p-4">
					{children}
				</div>
			</AppContent>
			<AppBottomNav />
		</AppShell>
	)
}
