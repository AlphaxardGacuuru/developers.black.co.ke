import { usePathname } from "next/navigation"
import { mainNavItems } from "@/components/app-sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSidebar } from "@/components/ui/sidebar"
import { useInitials } from "@/hooks/use-initials"
import type { User } from "@/types"

// The floating header the other Black apps use: the current section on the
// left, and the avatar that toggles the sidebar on the right.
export function AppSidebarHeader({ user }: { user: User }) {
	const { toggleSidebar } = useSidebar()
	const getInitials = useInitials()
	const pathname = usePathname()
	const section = mainNavItems.find(
		(item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
	)

	return (
		<header className="sticky top-0 z-30 mx-2 mt-2 flex shrink-0 flex-row items-center gap-2 rounded-xl border border-white/40 bg-white/34 px-4 py-3 text-sidebar-foreground shadow-[0_20px_45px_-28px_rgba(15,23,42,0.45)] backdrop-blur-xl transition-[width,height] ease-linear md:h-16 md:py-0 dark:border-white/12 dark:bg-slate-950/20">
			<div className="min-w-0 flex-1 truncate text-sm font-medium">
				{section?.title}
			</div>

			<button
				type="button"
				onClick={toggleSidebar}
				aria-label="Toggle sidebar"
				className="relative -mr-1 ms-2 flex size-7 shrink-0 items-center justify-center rounded-full transition-opacity hover:opacity-80">
				<Avatar className="size-10">
					<AvatarImage
						src={user.avatar ?? undefined}
						alt={user.name}
					/>
					<AvatarFallback className="text-xs">
						{getInitials(user.name)}
					</AvatarFallback>
				</Avatar>
			</button>
		</header>
	)
}
