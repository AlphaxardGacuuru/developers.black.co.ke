"use client"

import type { AxiosError } from "axios"
import { useParams } from "next/navigation"
import type { FormEvent } from "react"
import { useEffect, useState } from "react"
import DeductionForm from "@/components/deductions/deduction-form"
import type { DeductionFormErrors } from "@/components/deductions/deduction-form"
import Heading from "@/components/heading"
import { formatLocalDate } from "@/components/ui/date-picker"
import { Spinner } from "@/components/ui/spinner"
import { useApp } from "@/contexts/AppContext"
import Axios from "@/lib/axios"
import { Head, useLayout } from "@/lib/spa"
import { toast } from "@/lib/toast"
import type { ErrorResponse } from "@/types/app-context"
import type { Deduction, Invoice } from "@/types"

export default function EditDeduction() {
	const { id } = useParams<{ id: string }>()

	useLayout({
		breadcrumbs: [
			{ title: "Deductions", href: "/deductions" },
			{ title: "Edit", href: `/deductions/${id}/edit` },
		],
	})

	const props = useApp()

	const [invoices, setInvoices] = useState<Invoice[]>([])
	const [invoiceId, setInvoiceId] = useState("")
	const [amount, setAmount] = useState("")
	const [issueDate, setIssueDate] = useState(formatLocalDate(new Date()))
	const [notes, setNotes] = useState("")
	const [errors, setErrors] = useState<DeductionFormErrors>({})
	const [loading, setLoading] = useState(false)
	const [loadingDeduction, setLoadingDeduction] = useState(true)

	useEffect(() => {
		props.get("invoices", setInvoices)

		Axios.get<{ data: Deduction }>(`/api/deductions/${id}`)
			.then((response) => {
				const deduction = response.data.data

				setInvoiceId(String(deduction.invoiceId))
				// The API formats the amount ("1,000.00"); the number input needs it plain.
				setAmount(deduction.amount?.replace(/,/g, "") || "")
				setIssueDate(deduction.issueDate)
				setNotes(deduction.notes || "")
			})
			.catch((error: AxiosError<ErrorResponse>) => props.getErrors(error))
			.finally(() => setLoadingDeduction(false))
	}, [id])

	const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
		event.preventDefault()
		setErrors({})
		setLoading(true)

		Axios.put(`/api/deductions/${id}`, {
			invoiceId,
			amount: parseFloat(amount),
			issueDate,
			notes,
		})
			.then((response) => toast.success(response.data.message))
			.catch((error: AxiosError<ErrorResponse>) => {
				const fieldErrors = error.response?.data?.errors

				if (error.response?.status === 422 && fieldErrors) {
					setErrors({
						invoiceId: props.getFieldError(fieldErrors.invoiceId),
						amount: props.getFieldError(fieldErrors.amount),
						issueDate: props.getFieldError(fieldErrors.issueDate),
						notes: props.getFieldError(fieldErrors.notes),
					})

					return
				}

				props.getErrors(error)
			})
			.finally(() => setLoading(false))
	}

	return (
		<>
			<Head title="Edit Deduction" />

			<div className="flex flex-1 flex-col gap-6 p-4">
				{/* Page Header Section Start */}
				<Heading
					title="Edit Deduction"
					description="Update the amount, date or notes of this deduction."
				/>
				{/* Page Header Section End */}

				{loadingDeduction ? (
					/* Loading Section Start */
					<div className="flex justify-center py-12 text-muted-foreground">
						<Spinner />
					</div>
				) : (
					/* Loading Section End */
					/* Deduction Form Section Start */
					<DeductionForm
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
						submitLabel="Update Deduction"
						invoiceLocked
						onSubmit={onSubmit}
					/>
					/* Deduction Form Section End */
				)}
			</div>
		</>
	)
}
