"use client"

import type { AxiosError } from "axios"
import { useRouter } from "next/navigation"
import type { FormEvent } from "react"
import { useEffect, useState } from "react"
import DeductionForm from "@/components/deductions/deduction-form"
import type { DeductionFormErrors } from "@/components/deductions/deduction-form"
import Heading from "@/components/heading"
import { formatLocalDate } from "@/components/ui/date-picker"
import { useApp } from "@/contexts/AppContext"
import Axios from "@/lib/axios"
import { Head, useLayout } from "@/lib/spa"
import { toast } from "@/lib/toast"
import type { ErrorResponse } from "@/types/app-context"
import type { Invoice } from "@/types"

export default function CreateDeduction() {
	useLayout({
		breadcrumbs: [
			{ title: "Deductions", href: "/deductions" },
			{ title: "Create", href: "/deductions/create" },
		],
	})

	const props = useApp()
	const router = useRouter()

	const [invoices, setInvoices] = useState<Invoice[]>([])
	const [invoiceId, setInvoiceId] = useState("")
	const [amount, setAmount] = useState("")
	const [issueDate, setIssueDate] = useState(formatLocalDate(new Date()))
	const [notes, setNotes] = useState("")
	const [errors, setErrors] = useState<DeductionFormErrors>({})
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		props.get("invoices", setInvoices)
	}, [])

	const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
		event.preventDefault()
		setErrors({})
		setLoading(true)

		Axios.post("/api/deductions", {
			invoiceId,
			amount: parseFloat(amount),
			issueDate,
			notes,
		})
			.then((response) => {
				toast.success(response.data.message)
				setTimeout(() => router.push("/deductions"), 500)
			})
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
			<Head title="Create Deduction" />

			<div className="flex flex-1 flex-col gap-6 p-4">
				{/* Page Header Section Start */}
				<Heading
					title="Create Deduction"
					description="Record an amount deducted from an invoice."
				/>
				{/* Page Header Section End */}

				{/* Deduction Form Section Start */}
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
					submitLabel="Create Deduction"
					onSubmit={onSubmit}
				/>
				{/* Deduction Form Section End */}
			</div>
		</>
	)
}
