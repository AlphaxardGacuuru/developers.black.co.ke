import type { ReactNode } from "react"
import Heading from "@/components/heading"

/** Money's page header card (accounts, overview): the page title over a soft gradient. */
export function PageHeader({
	title,
	description,
	children,
}: {
	title: string
	description?: string
	children?: ReactNode
}) {
	return (
		<div className="relative overflow-hidden rounded-2xl border bg-card px-4 py-4 shadow-xs sm:px-5">
			<div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/8 via-transparent to-transparent" />

			<div className="relative flex items-start justify-between gap-3">
				<Heading
					title={title}
					description={description}
				/>
				{children}
			</div>
		</div>
	)
}
