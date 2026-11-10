import {
	CreditCard,
	FileMinus,
	FilePlus,
	FileText,
	LayoutGrid,
	Users,
} from "lucide-react"
import AppLogo from "@/components/app-logo"
import { NavAdmin } from "@/components/nav-admin"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { Link } from "@/components/ui/link"
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarTrigger,
} from "@/components/ui/sidebar"
import type { NavItem } from "@/types"

export const mainNavItems: NavItem[] = [
	{
		title: "Dashboard",
		href: "/dashboard",
		icon: LayoutGrid,
	},
	{
		title: "Clients",
		href: "/clients",
		icon: Users,
	},
	{
		title: "Invoices",
		href: "/invoices",
		icon: FileText,
	},
	{
		title: "Payments",
		href: "/payments",
		icon: CreditCard,
	},
	{
		title: "Credit Notes",
		href: "/credit-notes",
		icon: FilePlus,
	},
	{
		title: "Deductions",
		href: "/deductions",
		icon: FileMinus,
	},
]

export function AppSidebar() {
	return (
		<Sidebar
			side="right"
			collapsible="icon"
			variant="inset">
			<SidebarHeader>
				<div className="mt-2 flex items-center gap-2">
					<SidebarMenu className="min-w-0 flex-1 items-center">
						<SidebarMenuItem>
							<SidebarMenuButton
								size="lg"
								asChild>
								<Link
									href="/dashboard"
									variant="unstyled">
									<AppLogo iconClassName="h-28 w-28 dark:invert" />
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
					<SidebarTrigger className="shrink-0" />
				</div>
			</SidebarHeader>

			<SidebarContent>
				<NavMain items={mainNavItems} />
				<NavAdmin />
			</SidebarContent>

			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
		</Sidebar>
	)
}
