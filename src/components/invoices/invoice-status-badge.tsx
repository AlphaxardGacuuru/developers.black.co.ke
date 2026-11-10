import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const STATUS_CLASSES: Record<string, string> = {
	not_paid: "bg-red-600 text-white",
	partially_paid: "bg-yellow-500 text-gray-900",
	paid: "bg-green-600 text-white",
}

export const INVOICE_STATUSES = [
	{ id: "not_paid", name: "Not Paid" },
	{ id: "partially_paid", name: "Partially Paid" },
	{ id: "paid", name: "Paid" },
	{ id: "overpaid", name: "Overpaid" },
]

/** "partially_paid" -> "Partially Paid" */
export function invoiceStatusLabel(status?: string | null): string {
	return (status ?? "")
		.split("_")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ")
}

export function InvoiceStatusBadge({
	status,
	className,
}: {
	status?: string | null
	className?: string
}) {
	return (
		<Badge
			className={cn(
				"rounded px-3 py-1 whitespace-nowrap",
				STATUS_CLASSES[status ?? ""] ?? "bg-gray-600 text-white",
				className
			)}>
			{invoiceStatusLabel(status)}
		</Badge>
	)
}
