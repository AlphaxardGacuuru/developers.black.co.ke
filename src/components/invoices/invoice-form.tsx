"use client"

import { isAxiosError } from "axios"
import { ArrowLeft, Plus, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import InputError from "@/components/input-error"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DatePicker, formatLocalDate } from "@/components/ui/date-picker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "@/components/ui/link"
import { SelectField, SelectItem } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { useApp } from "@/contexts/AppContext"
import Axios from "@/lib/axios"
import { toast } from "@/lib/toast"
import type { Client, Invoice } from "@/types"

type FormItem = {
	item: string
	description: string
	quantity: number | string
	rate: number | string
	amount: number
}

const DEFAULT_TERMS = "Payment is due within 30 days of invoice date."

const emptyItem = (): FormItem => ({
	item: "",
	description: "",
	quantity: 1,
	rate: 0,
	amount: 0,
})

const textareaClassName =
	"flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"

// Format currency with commas
export const formatCurrency = (amount: number): string =>
	amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")

const itemAmount = (quantity: number | string, rate: number | string): number =>
	(parseFloat(String(quantity)) || 0) * (parseFloat(String(rate)) || 0)

/**
 * The invoice form shared by the create and edit pages: client, dates, line
 * items, 5% withholding tax, notes and terms. With `invoiceId` it loads that
 * invoice and saves with PUT; without, it creates one with POST.
 */
export default function InvoiceForm({ invoiceId }: { invoiceId?: string }) {
	const props = useApp()
	const router = useRouter()
	const isEditing = Boolean(invoiceId)

	const [clients, setClients] = useState<Client[]>([])
	const [loading, setLoading] = useState(false)
	const [loadingInvoice, setLoadingInvoice] = useState(isEditing)
	const [errors, setErrors] = useState<Record<string, unknown>>({})

	const [clientId, setClientId] = useState("")
	const [issueDate, setIssueDate] = useState(formatLocalDate(new Date()))
	const [dueDate, setDueDate] = useState("")
	const [notes, setNotes] = useState("")
	const [terms, setTerms] = useState(DEFAULT_TERMS)
	const [invoiceItems, setInvoiceItems] = useState<FormItem[]>([emptyItem()])
	const [applyWithholdingTax, setApplyWithholdingTax] = useState(false)

	useEffect(() => {
		props.get("users?type=client", setClients)

		if (!invoiceId) {
			// Due in 30 days by default
			const defaultDueDate = new Date()
			defaultDueDate.setDate(defaultDueDate.getDate() + 30)
			setDueDate(formatLocalDate(defaultDueDate))

			return
		}

		Axios.get<{
			data: Omit<Invoice, "invoiceItems"> & { invoiceItems: Partial<FormItem>[] }
		}>(
			`/api/invoices/${invoiceId}`
		)
			.then((res) => {
				const invoice = res.data.data

				setClientId(String(invoice.clientId ?? ""))
				setIssueDate(invoice.issueDate || formatLocalDate(new Date()))
				setDueDate(invoice.dueDate || "")
				setNotes(invoice.notes || "")
				setTerms(invoice.terms || DEFAULT_TERMS)

				if (invoice.invoiceItems?.length > 0) {
					setInvoiceItems(
						invoice.invoiceItems.map((item) => ({
							item: item.item || "",
							description: item.description || "",
							quantity: parseFloat(String(item.quantity)) || 1,
							rate: parseFloat(String(item.rate)) || 0,
							amount: parseFloat(String(item.amount)) || 0,
						}))
					)
				}

				setApplyWithholdingTax(parseFloat(String(invoice.withholdingTax)) > 0)
			})
			.finally(() => setLoadingInvoice(false))
	}, [invoiceId])

	const updateInvoiceItem = (
		index: number,
		field: keyof Omit<FormItem, "amount">,
		value: string
	) => {
		setInvoiceItems((current) =>
			current.map((item, i) => {
				if (i !== index) {
					return item
				}

				const updated = { ...item, [field]: value }

				// Recalculate amount if quantity or rate changes
				if (field === "quantity" || field === "rate") {
					updated.amount = itemAmount(updated.quantity, updated.rate)
				}

				return updated
			})
		)
	}

	const addInvoiceItem = () =>
		setInvoiceItems((current) => [...current, emptyItem()])

	const removeInvoiceItem = (index: number) => {
		if (invoiceItems.length > 1) {
			setInvoiceItems((current) => current.filter((_, i) => i !== index))
		}
	}

	const subtotal = invoiceItems.reduce(
		(sum, item) => sum + (Number(item.amount) || 0),
		0
	)
	const withholdingTax = applyWithholdingTax ? subtotal * 0.05 : 0
	const total = subtotal - withholdingTax

	const fieldError = (field: string) => props.getFieldError(errors[field])

	const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
		event.preventDefault()
		setErrors({})
		setLoading(true)

		const invoiceData = {
			clientId,
			issueDate,
			dueDate,
			invoiceItems: invoiceItems.filter(
				(item) => item.description.trim() !== ""
			),
			withholdingTax,
			total,
			notes,
			terms,
			...(isEditing ? {} : { status: "not_paid" }),
		}

		const request = isEditing
			? Axios.put(`/api/invoices/${invoiceId}`, invoiceData)
			: Axios.post("/api/invoices", invoiceData)

		request
			.then((response) => {
				toast.success(response.data.message)

				if (!isEditing) {
					setTimeout(() => router.push("/invoices"), 500)
				}
			})
			.catch((error: unknown) => {
				if (
					isAxiosError(error) &&
					error.response?.status === 422 &&
					error.response.data?.errors
				) {
					setErrors(error.response.data.errors)
				} else if (isAxiosError(error)) {
					props.getErrors(error)
				}
			})
			.finally(() => setLoading(false))
	}

	if (loadingInvoice) {
		return (
			<div className="flex items-center justify-center gap-2 rounded-2xl border bg-card p-8 text-muted-foreground">
				<Spinner />
				Loading invoice...
			</div>
		)
	}

	return (
		<form
			onSubmit={onSubmit}
			className="space-y-6">
			{/* Client Start */}
			<SelectField
				name="clientId"
				label="Client"
				placeholder="Select client"
				value={clientId || undefined}
				onValueChange={setClientId}
				error={fieldError("clientId")}
				required>
				{clients.map((client) => (
					<SelectItem
						key={client.id}
						value={String(client.id)}>
						{client.name}
					</SelectItem>
				))}
			</SelectField>
			{/* Client End */}

			<div className="grid gap-6 md:grid-cols-2">
				{/* Issue Date Start */}
				<DatePicker
					label="Issue Date"
					value={issueDate}
					onChange={setIssueDate}
					error={fieldError("issueDate")}
				/>
				{/* Issue Date End */}

				{/* Due Date Start */}
				<DatePicker
					label="Due Date"
					value={dueDate}
					onChange={setDueDate}
					error={fieldError("dueDate")}
				/>
				{/* Due Date End */}
			</div>

			{/* Invoice Items Section Start */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h3 className="text-lg font-semibold">Invoice Items</h3>
					<Button
						type="button"
						variant="outline"
						onClick={addInvoiceItem}>
						<Plus />
						Add Item
					</Button>
				</div>

				<div className="space-y-3">
					{invoiceItems.map((item, index) => (
						<div
							key={index}
							className="grid grid-cols-12 gap-3 rounded-xl border bg-card p-4">
							{/* Item Start */}
							<div className="col-span-12 md:col-span-3">
								<Input
									type="text"
									label="Item"
									value={item.item}
									onChange={(e) =>
										updateInvoiceItem(index, "item", e.target.value)
									}
									error={fieldError(`invoiceItems.${index}.item`)}
									required
								/>
							</div>
							{/* Item End */}

							{/* Description Start */}
							<div className="col-span-12 md:col-span-4">
								<Input
									type="text"
									label="Description"
									value={item.description}
									onChange={(e) =>
										updateInvoiceItem(index, "description", e.target.value)
									}
									error={fieldError(`invoiceItems.${index}.description`)}
								/>
							</div>
							{/* Description End */}

							{/* Quantity Start */}
							<div className="col-span-6 md:col-span-2">
								<Input
									type="number"
									label="Quantity"
									min="0"
									step="0.01"
									value={item.quantity}
									onChange={(e) =>
										updateInvoiceItem(index, "quantity", e.target.value)
									}
									error={fieldError(`invoiceItems.${index}.quantity`)}
									required
								/>
							</div>
							{/* Quantity End */}

							{/* Rate Start */}
							<div className="col-span-6 md:col-span-3">
								<Input
									type="number"
									label="Rate (KES)"
									min="0"
									step="0.01"
									value={item.rate}
									onChange={(e) =>
										updateInvoiceItem(index, "rate", e.target.value)
									}
									error={fieldError(`invoiceItems.${index}.rate`)}
									required
								/>
							</div>
							{/* Rate End */}

							<div className="col-span-12 flex items-center justify-between gap-3">
								<p className="text-sm text-muted-foreground">
									Amount:{" "}
									<span className="font-medium text-foreground">
										KES {formatCurrency(item.amount)}
									</span>
								</p>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									aria-label="Remove item"
									onClick={() => removeInvoiceItem(index)}
									disabled={invoiceItems.length === 1}
									className="hover:text-destructive">
									<X />
								</Button>
							</div>
						</div>
					))}
				</div>
			</div>
			{/* Invoice Items Section End */}

			{/* Totals Section Start */}
			<div className="flex justify-end">
				<div className="w-full space-y-3 md:w-96">
					<div className="flex items-center justify-between px-4 py-2 text-muted-foreground">
						<span>Subtotal:</span>
						<span>KES {formatCurrency(subtotal)}</span>
					</div>

					{/* Withholding Tax Start */}
					<div className="flex items-center justify-between rounded-xl border px-4 py-2">
						<div className="flex items-center gap-3">
							<Checkbox
								id="withholdingTax"
								checked={applyWithholdingTax}
								onCheckedChange={(checked) =>
									setApplyWithholdingTax(checked === true)
								}
							/>
							<Label
								htmlFor="withholdingTax"
								className="cursor-pointer text-sm text-muted-foreground">
								Withholding Tax (5%)
							</Label>
						</div>
						{applyWithholdingTax && (
							<span className="ml-3 text-sm whitespace-nowrap text-red-500">
								- KES {formatCurrency(withholdingTax)}
							</span>
						)}
					</div>
					{/* Withholding Tax End */}

					<div className="flex items-center justify-between rounded-xl border bg-muted/40 px-4 py-3">
						<span className="text-lg">Total:</span>
						<span className="text-xl font-semibold">
							KES {formatCurrency(total)}
						</span>
					</div>
				</div>
			</div>
			{/* Totals Section End */}

			<div className="grid gap-6 md:grid-cols-2">
				{/* Notes Start */}
				<div className="grid gap-2">
					<Label htmlFor="notes">Notes</Label>
					<textarea
						id="notes"
						name="notes"
						rows={4}
						value={notes}
						onChange={(e) => setNotes(e.target.value)}
						placeholder="Additional notes or comments..."
						className={textareaClassName}
					/>
					<InputError message={fieldError("notes")} />
				</div>
				{/* Notes End */}

				{/* Terms Start */}
				<div className="grid gap-2">
					<Label htmlFor="terms">Terms & Conditions</Label>
					<textarea
						id="terms"
						name="terms"
						rows={4}
						value={terms}
						onChange={(e) => setTerms(e.target.value)}
						placeholder="Payment terms..."
						className={textareaClassName}
					/>
					<InputError message={fieldError("terms")} />
				</div>
				{/* Terms End */}
			</div>

			{/* Form Actions Section Start */}
			<div className="flex justify-between">
				<Button
					variant="outline"
					asChild>
					<Link
						href="/invoices"
						variant="unstyled"
						size="none">
						<ArrowLeft className="size-4" />
						Back to Invoices
					</Link>
				</Button>

				<Button
					type="submit"
					disabled={loading}>
					{isEditing ? "Update Invoice" : "Create Invoice"}
					{loading && <Spinner />}
				</Button>
			</div>
			{/* Form Actions Section End */}
		</form>
	)
}
