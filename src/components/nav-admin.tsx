import { Activity, ChevronDown, Gauge, ShieldCheck } from "lucide-react"
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Link } from "@/components/ui/link"
import { useApp } from "@/contexts/AppContext"
import { useCurrentUrl } from "@/hooks/use-current-url"

// Telescope and Pulse are served by the API, not this app.
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

/**
 * Admin pages: the API's server-rendered dashboards. Each is shown only to
 * users its gate allows (reported by /api/user).
 */
export function NavAdmin() {
	const { auth } = useApp()

	const { isCurrentUrl } = useCurrentUrl()

	const items = [
		auth?.can_view_telescope && {
			title: "Telescope",
			href: `${BACKEND_URL}/telescope`,
			icon: Activity,
			internal: false,
		},
		auth?.can_view_pulse && {
			title: "Pulse",
			href: `${BACKEND_URL}/pulse`,
			icon: Gauge,
			internal: false,
		},
	].filter(
		(
			item
		): item is {
			title: string
			href: string
			icon: typeof Activity
			internal: boolean
		} => Boolean(item)
	)

	if (items.length === 0) {
		return null
	}

	return (
		<SidebarGroup className="px-2 py-0">
			<SidebarGroupContent>
				<SidebarMenu>
					<Collapsible className="group/admin">
						<SidebarMenuItem>
							<CollapsibleTrigger asChild>
								<SidebarMenuButton tooltip={{ children: "Admin" }}>
									<ShieldCheck className="h-5 w-5" />
									<span>Admin</span>
									<ChevronDown className="ms-auto size-4 transition-transform group-data-[state=open]/admin:rotate-180" />
								</SidebarMenuButton>
							</CollapsibleTrigger>

							<CollapsibleContent>
								<SidebarMenuSub>
									{items.map((item) => (
										<SidebarMenuSubItem key={item.title}>
											{item.internal ? (
												<SidebarMenuSubButton
													asChild
													isActive={isCurrentUrl(item.href)}
													className="justify-start">
													<Link href={item.href}>
														<item.icon />
														<span>{item.title}</span>
													</Link>
												</SidebarMenuSubButton>
											) : (
												/* Full page loads: these dashboards are served by the API, not this app. */
												<SidebarMenuSubButton
													href={item.href}
													target="_blank"
													rel="noopener"
													className="justify-start">
													<item.icon />
													<span>{item.title}</span>
												</SidebarMenuSubButton>
											)}
										</SidebarMenuSubItem>
									))}
								</SidebarMenuSub>
							</CollapsibleContent>
						</SidebarMenuItem>
					</Collapsible>
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	)
}
