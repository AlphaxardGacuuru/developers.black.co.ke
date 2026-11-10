"use client"

import { useEffect, useState } from "react"
import InvoiceList from "@/components/invoices/invoice-list"
import type {
	InvoiceFilters,
	InvoiceListResponse,
} from "@/components/invoices/invoice-list"
import { PageHeader } from "@/components/page-header"
import { useApp } from "@/contexts/AppContext"
import { Head, useLayout } from "@/lib/spa"

const EMPTY_INVOICES: InvoiceListResponse = {
	data: [],
	meta: { current_page: 1, last_page: 1, per_page: 20, total: 0 },
}

const NO_FILTERS: InvoiceFilters = {
	number: "",
	clientId: "",
	status: "",
	startMonth: "",
	startYear: "",
	endMonth: "",
	endYear: "",
}

export default function Invoices() {
	const props = useApp()

	useLayout({ breadcrumbs: [{ title: "Invoices", href: "/invoices" }] })

	const [invoices, setInvoices] = useState<InvoiceListResponse>(() =>
		props.getLocalStorage("invoices", EMPTY_INVOICES)
	)
	const [clients, setClients] = useState<{ id: number; name: string }[]>([])
	const [filters, setFilters] = useState<InvoiceFilters>(NO_FILTERS)

	const setFilter = (filter: keyof InvoiceFilters, value: string) =>
		setFilters((current) => ({ ...current, [filter]: value }))

	useEffect(() => {
		const query = new URLSearchParams(filters).toString()

		props.getPaginated(`invoices?${query}`, setInvoices, "invoices")
		props.get("users?idAndName=true&type=client", setClients)
	}, [filters])

	return (
		<>
			<Head title="Invoices" />

			{/* Bottom padding keeps the last row clear of the floating button. */}
			<div className="flex flex-1 flex-col gap-2 pb-32 md:pb-24">
				{/* Page Header Section Start */}
				<PageHeader
					title="Invoices"
					description="Bill clients, send invoices by email and track what's been paid."
				/>
				{/* Page Header Section End */}

				{/* Invoices Content Section Start */}
				<InvoiceList
					invoices={invoices}
					setInvoices={setInvoices}
					clients={clients}
					filters={filters}
					setFilter={setFilter}
				/>
				{/* Invoices Content Section End */}
			</div>
		</>
	)
}
