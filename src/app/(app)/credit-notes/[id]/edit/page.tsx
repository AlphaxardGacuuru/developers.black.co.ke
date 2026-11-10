"use client"

import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { isAxiosError } from "axios"
import { useParams } from "next/navigation"
import CreditNoteForm from "@/components/credit-notes/credit-note-form"
import type { CreditNoteFormErrors } from "@/components/credit-notes/credit-note-form"
import Heading from "@/components/heading"
import { formatLocalDate } from "@/components/ui/date-picker"
import { Spinner } from "@/components/ui/spinner"
import { useApp } from "@/contexts/AppContext"
import Axios from "@/lib/axios"
import { Head, useLayout } from "@/lib/spa"
import { toast } from "@/lib/toast"
import type { CreditNote, Invoice } from "@/types"

export default function EditCreditNote() {
	const { id } = useParams<{ id: string }>()

	useLayout({
		breadcrumbs: [
			{ title: "Credit Notes", href: "/credit-notes" },
			{ title: "Edit", href: `/credit-notes/${id}/edit` },
		],
	})

	const props = useApp()

	const [invoices, setInvoices] = useState<Invoice[]>([])
	const [invoiceId, setInvoiceId] = useState("")
	const [amount, setAmount] = useState("")
	const [issueDate, setIssueDate] = useState(formatLocalDate(new Date()))
	const [notes, setNotes] = useState("")
	const [errors, setErrors] = useState<CreditNoteFormErrors>({})
	const [loading, setLoading] = useState(false)
	const [loadingCreditNote, setLoadingCreditNote] = useState(true)

	useEffect(() => {
		props.get("invoices", setInvoices)

		Axios.get<{ data: CreditNote }>(`/api/credit-notes/${id}`)
			.then((response) => {
				const creditNote = response.data.data

				setInvoiceId(String(creditNote.invoiceId))
				// The API formats the amount ("1,000.00"); the number input needs it plain.
				setAmount(creditNote.amount?.replace(/,/g, "") || "")
				setIssueDate(creditNote.issueDate)
				setNotes(creditNote.notes || "")
			})
			.catch((error: unknown) => {
				if (isAxiosError(error)) {
					props.getErrors(error)
				}
			})
			.finally(() => setLoadingCreditNote(false))
	}, [id])

	const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
		event.preventDefault()
		setErrors({})
		setLoading(true)

		Axios.put(`/api/credit-notes/${id}`, {
			invoiceId,
			amount: parseFloat(amount),
			issueDate,
			notes,
		})
			.then((response) => toast.success(response.data.message))
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
			<Head title="Edit Credit Note" />

			<div className="flex flex-1 flex-col gap-6 p-4">
				{/* Page Header Section Start */}
				<Heading
					title="Edit Credit Note"
					description="Update the amount, date or notes of this credit note."
				/>
				{/* Page Header Section End */}

				{loadingCreditNote ? (
					/* Loading State Section Start */
					<div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
						<Spinner />
						Loading credit note...
					</div>
				) : (
					/* Loading State Section End */
					/* Credit Note Form Section Start */
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
						submitLabel="Update Credit Note"
						invoiceLocked
						onSubmit={onSubmit}
					/>
					/* Credit Note Form Section End */
				)}
			</div>
		</>
	)
}
