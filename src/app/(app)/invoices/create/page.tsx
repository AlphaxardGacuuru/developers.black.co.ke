"use client"

import InvoiceForm from "@/components/invoices/invoice-form"
import Heading from "@/components/heading"
import { Head, useLayout } from "@/lib/spa"

export default function CreateInvoice() {
	useLayout({
		breadcrumbs: [
			{ title: "Invoices", href: "/invoices" },
			{ title: "Create", href: "/invoices/create" },
		],
	})

	return (
		<>
			<Head title="Create Invoice" />

			<div className="flex flex-1 flex-col gap-6 p-4">
				{/* Page Header Section Start */}
				<Heading
					title="Create Invoice"
					description="Bill a client for work, with line items and optional withholding tax."
				/>
				{/* Page Header Section End */}

				{/* Invoice Form Section Start */}
				<InvoiceForm />
				{/* Invoice Form Section End */}
			</div>
		</>
	)
}
