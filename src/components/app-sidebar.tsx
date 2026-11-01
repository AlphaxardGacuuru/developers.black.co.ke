import Link from "next/link"
import { usePathname } from "next/navigation"
import {
	CreditCard,
	FileMinus,
	FilePlus,
	FileText,
	LayoutGrid,
	Users,
} from "lucide-react"
import ApplicationLogo from "@/components/ApplicationLogo"
import { NavUser } from "@/components/nav-user"
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar"
import type { NavItem, User } from "@/types"

export const mainNavItems: NavItem[] = [
	{ title: "Dashboard", href: "/dashboard", icon: LayoutGrid },
	{ title: "Clients", href: "/clients", icon: Users },
	{ title: "Invoices", href: "/invoices", icon: FileText },
	{ title: "Payments", href: "/payments", icon: CreditCard },
	{ title: "Credit Notes", href: "/credit-notes", icon: FilePlus },
	{ title: "Deductions", href: "/deductions", icon: FileMinus },
]

export function isActive(pathname: string, href: string) {
	return pathname === href || pathname.startsWith(`${href}/`)
}

export function AppSidebar({ user }: { user: User }) {
	const { state } = useSidebar()
	const pathname = usePathname()

	return (
		<Sidebar
			side="right"
			collapsible="icon"
			variant="floating">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							size="xl"
							asChild>
							<Link href="/dashboard">
								<div className="flex w-full justify-center text-primary">
									{state === "collapsed" ? (
										<img
											src="/android-chrome-192x192.png"
											alt="Black Developers"
											className="h-8 w-auto"
										/>
									) : (
										<ApplicationLogo className="h-8 w-auto" />
									)}
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup className="hidden px-2 py-0 md:block">
					<SidebarMenu>
						{mainNavItems.map((item) => (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton
									asChild
									isActive={isActive(pathname, item.href)}
									tooltip={item.title}>
									<Link href={item.href}>
										{item.icon && <item.icon />}
										<span>{item.title}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter>
				<NavUser user={user} />
			</SidebarFooter>
		</Sidebar>
	)
}
