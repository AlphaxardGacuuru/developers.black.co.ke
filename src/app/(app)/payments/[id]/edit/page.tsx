"use client"

import { useParams } from "next/navigation"
import { PaymentForm } from "@/components/payments/payment-form"
import { Head, useLayout } from "@/lib/spa"

export default function EditPayment() {
	const { id } = useParams<{ id: string }>()

	useLayout({
		breadcrumbs: [
			{ title: "Payments", href: "/payments" },
			{ title: "Edit", href: `/payments/${id}/edit` },
		],
	})

	return (
		<>
			<Head title="Edit Payment" />
			<PaymentForm paymentId={id} />
		</>
	)
}
