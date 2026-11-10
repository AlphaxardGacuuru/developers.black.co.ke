"use client"

import type { FormEvent } from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import InputError from "@/components/input-error"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { DatePicker, formatLocalDate } from "@/components/ui/date-picker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "@/components/ui/link"
import { SelectField, SelectItem } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { useApp } from "@/contexts/AppContext"
import Axios from "@/lib/axios"
import { toast } from "@/lib/toast"
import type { Invoice, Payment } from "@/types"

type PaymentFormErrors = Partial<
	Record<"invoiceId" | "amount" | "paymentDate" | "notes", string>
>

type Props = {
	/** The payment being edited; omit to create one. */
	paymentId?: string
	/** Preselects the invoice when recording a payment from an invoice. */
	invoiceId?: string
}

export function PaymentForm({ paymentId, invoiceId: initialInvoiceId = "" }: Props) {
	const props = useApp()
	const router = useRouter()
	const isEditing = Boolean(paymentId)

	const [invoices, setInvoices] = useState<Invoice[]>([])
	const [loading, setLoading] = useState(false)
	const [loadingPayment, setLoadingPayment] = useState(isEditing)
	const [errors, setErrors] = useState<PaymentFormErrors>({})

	const [invoiceId, setInvoiceId] = useState(initialInvoiceId)
	const [amount, setAmount] = useState("")
	const [paymentDate, setPaymentDate] = useState(formatLocalDate(new Date()))
	const [notes, setNotes] = useState("")

	useEffect(() => {
		if (!isEditing) {
			// Only invoices that still have a balance can take a payment
			props.get("invoices?status=not_paid,partially_paid", setInvoices)

			return
		}

		props.get("invoices", setInvoices)

		Axios.get(`/api/payments/${paymentId}`)
			.then((response) => {
				const payment: Payment = response.data.data

				setInvoiceId(String(payment.invoiceId ?? ""))
				// Amounts come back formatted with commas
				setAmount(payment.amount ? String(payment.amount).replace(/,/g, "") : "")
				setPaymentDate(payment.paymentDate || formatLocalDate(new Date()))
				setNotes(payment.notes || "")
			})
			.catch((error) => props.getErrors(error))
			.finally(() => setLoadingPayment(false))
	}, [paymentId])

	const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
		event.preventDefault()
		setErrors({})
		setLoading(true)

		const paymentData = {
			invoiceId,
			amount: parseFloat(String(amount).replace(/,/g, "")),
			paymentDate,
			notes,
		}

		const request = isEditing
			? Axios.put(`/api/payments/${paymentId}`, paymentData)
			: Axios.post("/api/payments", paymentData)

		request
			.then((response) => {
				toast.success(response.data.message)
				setTimeout(() => router.push("/payments"), 500)
			})
			.catch((error) => {
				const response = error?.response

				if (response?.status === 422 && response.data?.errors) {
					setErrors({
						invoiceId: props.getFieldError(response.data.errors.invoiceId),
						amount: props.getFieldError(response.data.errors.amount),
						paymentDate: props.getFieldError(response.data.errors.paymentDate),
						notes: props.getFieldError(response.data.errors.notes),
					})

					return
				}

				props.getErrors(error)
			})
			.finally(() => setLoading(false))
	}

	const title = isEditing ? "Edit Payment" : "Create Payment"

	return (
		<div className="flex flex-1 flex-col gap-6 p-4">
			{/* Page Header Section Start */}
			<PageHeader
				title={title}
				description={
					isEditing
						? "Update the amount, date or notes of this payment."
						: "Record a payment against an unpaid invoice."
				}
			/>
			{/* Page Header Section End */}

			{loadingPayment ? (
				<div className="flex justify-center py-12 text-muted-foreground">
					<Spinner />
				</div>
			) : (
				/* Payment Form Section Start */
				<form
					onSubmit={onSubmit}
					className="space-y-6">
					{/* Invoice Start */}
					<SelectField
						name="invoiceId"
						label="Invoice"
						placeholder="Select Invoice"
						value={invoiceId || undefined}
						onValueChange={setInvoiceId}
						disabled={isEditing}
						required
						error={errors.invoiceId}>
						{invoices.map((invoice) => (
							<SelectItem
								key={invoice.id}
								value={String(invoice.id)}>
								{invoice.number} - {invoice.clientName} - KES {invoice.balance}
							</SelectItem>
						))}
					</SelectField>
					{/* Invoice End */}

					<div className="grid gap-6 sm:grid-cols-2">
						{/* Amount Start */}
						<Input
							type="number"
							label="Amount"
							id="amount"
							name="amount"
							min="0"
							step="0.01"
							value={amount}
							onChange={(event) => setAmount(event.target.value)}
							required
							error={errors.amount}
						/>
						{/* Amount End */}

						{/* Payment Date Start */}
						<DatePicker
							label="Payment Date"
							value={paymentDate}
							onChange={setPaymentDate}
							error={errors.paymentDate}
						/>
						{/* Payment Date End */}
					</div>

					{/* Notes Start */}
					<div className="grid gap-2">
						<Label htmlFor="notes">Notes</Label>
						<textarea
							id="notes"
							name="notes"
							rows={4}
							value={notes}
							onChange={(event) => setNotes(event.target.value)}
							placeholder="Additional notes or comments..."
							className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
						/>
						<InputError message={errors.notes} />
					</div>
					{/* Notes End */}

					{/* Form Actions Section Start */}
					<div className="flex justify-between">
						<Button
							variant="outline"
							asChild>
							<Link
								href="/payments"
								variant="unstyled"
								size="none">
								<ArrowLeft className="size-4" />
								Back to Payments
							</Link>
						</Button>

						<Button
							type="submit"
							disabled={loading}>
							{isEditing ? "Update Payment" : "Create Payment"}
							{loading && <Spinner />}
						</Button>
					</div>
					{/* Form Actions Section End */}
				</form>
				/* Payment Form Section End */
			)}
		</div>
	)
}
