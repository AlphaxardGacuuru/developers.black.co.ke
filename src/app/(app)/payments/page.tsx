"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/page-header"
import type { PaymentFilters, PaymentPage } from "@/components/payments/payment-list"
import { PaymentList } from "@/components/payments/payment-list"
import { useApp } from "@/contexts/AppContext"
import { Head, useLayout } from "@/lib/spa"

const EMPTY_PAYMENTS: PaymentPage = {
	data: [],
	meta: { current_page: 1, last_page: 1, per_page: 20, total: 0 },
}

export default function PaymentsIndex() {
	useLayout({ breadcrumbs: [{ title: "Payments", href: "/payments" }] })

	const props = useApp()

	const [payments, setPayments] = useState<PaymentPage>(() =>
		props.getLocalStorage<PaymentPage>("payments", EMPTY_PAYMENTS)
	)
	const [clients, setClients] = useState<{ id: number; name: string }[]>([])
	const [filters, setFilters] = useState<PaymentFilters>({
		number: "",
		clientId: "",
		startMonth: "",
		startYear: "",
		endMonth: "",
		endYear: "",
	})

	const setFilter = (key: keyof PaymentFilters, value: string) =>
		setFilters((current) => ({ ...current, [key]: value }))

	useEffect(() => {
		props.get("users?idAndName=true&type=client", setClients)
	}, [])

	useEffect(() => {
		const query = new URLSearchParams(filters).toString()

		props.getPaginated(`payments?${query}`, setPayments, "payments")
	}, [filters])

	return (
		<>
			<Head title="Payments" />

			{/* Bottom padding keeps the last row clear of the floating button. */}
			<div className="flex flex-1 flex-col gap-2 pb-32 md:pb-24">
				{/* Page Header Section Start */}
				<PageHeader
					title="Payments"
					description="Payments received against your invoices, with receipts you can send to clients."
				/>
				{/* Page Header Section End */}

				<PaymentList
					payments={payments}
					setPayments={setPayments}
					clients={clients}
					filters={filters}
					setFilter={setFilter}
				/>
			</div>
		</>
	)
}
