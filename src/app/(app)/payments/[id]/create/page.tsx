"use client"

import { useParams } from "next/navigation"
import { PaymentForm } from "@/components/payments/payment-form"
import { Head, useLayout } from "@/lib/spa"

// Records a payment for invoice [id], with that invoice preselected.
export default function CreatePaymentFromInvoice() {
	const { id } = useParams<{ id: string }>()

	useLayout({
		breadcrumbs: [
			{ title: "Payments", href: "/payments" },
			{ title: "Create", href: `/payments/${id}/create` },
		],
	})

	return (
		<>
			<Head title="Create Payment" />
			<PaymentForm invoiceId={id} />
		</>
	)
}
