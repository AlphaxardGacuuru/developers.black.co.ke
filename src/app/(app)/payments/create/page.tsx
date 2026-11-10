"use client"

import { PaymentForm } from "@/components/payments/payment-form"
import { Head, useLayout } from "@/lib/spa"

export default function CreatePayment() {
	useLayout({
		breadcrumbs: [
			{ title: "Payments", href: "/payments" },
			{ title: "Create", href: "/payments/create" },
		],
	})

	return (
		<>
			<Head title="Create Payment" />
			<PaymentForm />
		</>
	)
}
