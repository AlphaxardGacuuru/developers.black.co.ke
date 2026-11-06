import Link from "next/link"
import { usePathname } from "next/navigation"
import { isActive, mainNavItems } from "@/components/app-sidebar"
import { cn } from "@/lib/utils"

// The other Black apps' phone navigation (gallery's AppBottomNav), with just
// the icons (two steps larger than gallery's) so all six sections fit.
export function AppBottomNav() {
	const pathname = usePathname()

	return (
		<div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-3 md:hidden">
			<nav className="pointer-events-auto mx-auto flex max-w-md items-center justify-around rounded-2xl border border-sidebar-border bg-sidebar p-1 text-sidebar-foreground shadow-sm backdrop-blur supports-backdrop-filter:bg-sidebar/95">
				{mainNavItems.map((item) => {
					const active = isActive(pathname, item.href)
					const Icon = item.icon

					return (
						<Link
							key={item.title}
							href={item.href}
							aria-label={item.title}
							title={item.title}
							aria-current={active ? "page" : undefined}
							className={cn(
								"flex min-w-0 flex-1 items-center justify-center rounded-2xl py-2 transition-colors",
								active
									? "bg-primary text-secondary"
									: "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
							)}>
							<span className="flex size-13 items-center justify-center">
								{Icon && <Icon className="size-12" />}
							</span>
						</Link>
					)
				})}
			</nav>
		</div>
	)
}
