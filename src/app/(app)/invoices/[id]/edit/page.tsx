"use client"

import { useParams } from "next/navigation"
import InvoiceForm from "@/components/invoices/invoice-form"
import Heading from "@/components/heading"
import { Head, useLayout } from "@/lib/spa"

export default function EditInvoice() {
	const { id } = useParams<{ id: string }>()

	useLayout({
		breadcrumbs: [
			{ title: "Invoices", href: "/invoices" },
			{ title: "Edit", href: `/invoices/${id}/edit` },
		],
	})

	return (
		<>
			<Head title="Edit Invoice" />

			<div className="flex flex-1 flex-col gap-6 p-4">
				{/* Page Header Section Start */}
				<Heading
					title="Edit Invoice"
					description="Update the client, dates, line items or terms of this invoice."
				/>
				{/* Page Header Section End */}

				{/* Invoice Form Section Start */}
				<InvoiceForm invoiceId={id} />
				{/* Invoice Form Section End */}
			</div>
		</>
	)
}
