import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/** Money's summary card (overview page): a label and icon over a value. */
export function StatCard({
	label,
	value,
	icon: Icon,
	className,
	valueClassName,
}: {
	label: string
	value: ReactNode
	icon?: LucideIcon
	className?: string
	valueClassName?: string
}) {
	return (
		<div className={cn("rounded-xl border bg-card p-4", className)}>
			<div className="flex items-center justify-between">
				<span className="text-sm text-muted-foreground">{label}</span>
				{Icon && <Icon className="size-4 text-muted-foreground" />}
			</div>
			<p
				className={cn(
					"mt-2 text-xl font-semibold tracking-tight lg:text-2xl",
					valueClassName
				)}>
				{value}
			</p>
		</div>
	)
}
