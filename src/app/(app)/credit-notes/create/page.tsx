"use client"

import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { isAxiosError } from "axios"
import { useRouter } from "next/navigation"
import CreditNoteForm from "@/components/credit-notes/credit-note-form"
import type { CreditNoteFormErrors } from "@/components/credit-notes/credit-note-form"
import Heading from "@/components/heading"
import { formatLocalDate } from "@/components/ui/date-picker"
import { useApp } from "@/contexts/AppContext"
import Axios from "@/lib/axios"
import { Head, useLayout } from "@/lib/spa"
import { toast } from "@/lib/toast"
import type { Invoice } from "@/types"

export default function CreateCreditNote() {
	useLayout({
		breadcrumbs: [
			{ title: "Credit Notes", href: "/credit-notes" },
			{ title: "Create", href: "/credit-notes/create" },
		],
	})

	const props = useApp()
	const router = useRouter()

	const [invoices, setInvoices] = useState<Invoice[]>([])
	const [invoiceId, setInvoiceId] = useState("")
	const [amount, setAmount] = useState("")
	const [issueDate, setIssueDate] = useState(formatLocalDate(new Date()))
	const [notes, setNotes] = useState("")
	const [errors, setErrors] = useState<CreditNoteFormErrors>({})
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		props.get("invoices", setInvoices)
	}, [])

	const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
		event.preventDefault()
		setErrors({})
		setLoading(true)

		Axios.post("/api/credit-notes", {
			invoiceId,
			amount: parseFloat(amount),
			issueDate,
			notes,
		})
			.then((response) => {
				toast.success(response.data.message)
				setTimeout(() => router.push("/credit-notes"), 500)
			})
			.catch((error: unknown) => {
				if (isAxiosError(error) && error.response?.status === 422) {
					const fieldErrors = error.response.data?.errors ?? {}

					setErrors({
						invoiceId: props.getFieldError(fieldErrors.invoiceId),
						amount: props.getFieldError(fieldErrors.amount),
						issueDate: props.getFieldError(fieldErrors.issueDate),
						notes: props.getFieldError(fieldErrors.notes),
					})

					return
				}

				if (isAxiosError(error)) {
					props.getErrors(error)
				}
			})
			.finally(() => setLoading(false))
	}

	return (
		<>
			<Head title="Create Credit Note" />

			<div className="flex flex-1 flex-col gap-6 p-4">
				{/* Page Header Section Start */}
				<Heading
					title="Create Credit Note"
					description="Credit part of an invoice back to the client."
				/>
				{/* Page Header Section End */}

				{/* Credit Note Form Section Start */}
				<CreditNoteForm
					invoices={invoices}
					invoiceId={invoiceId}
					setInvoiceId={setInvoiceId}
					amount={amount}
					setAmount={setAmount}
					issueDate={issueDate}
					setIssueDate={setIssueDate}
					notes={notes}
					setNotes={setNotes}
					errors={errors}
					loading={loading}
					submitLabel="Create Credit Note"
					onSubmit={onSubmit}
				/>
				{/* Credit Note Form Section End */}
			</div>
		</>
	)
}
