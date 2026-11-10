import type { FormEvent } from "react"
import { ArrowLeft } from "lucide-react"
import InputError from "@/components/input-error"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "@/components/ui/link"
import { SelectField, SelectItem } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import type { Invoice } from "@/types"

export type CreditNoteFormErrors = Partial<
	Record<"invoiceId" | "amount" | "issueDate" | "notes", string>
>

type Props = {
	invoices: Invoice[]
	invoiceId: string
	setInvoiceId: (value: string) => void
	amount: string
	setAmount: (value: string) => void
	issueDate: string
	setIssueDate: (value: string) => void
	notes: string
	setNotes: (value: string) => void
	errors: CreditNoteFormErrors
	loading: boolean
	submitLabel: string
	// The invoice can't be changed once the credit note exists.
	invoiceLocked?: boolean
	onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export default function CreditNoteForm(props: Props) {
	return (
		<form
			onSubmit={props.onSubmit}
			className="space-y-6">
			{/* Invoice Start */}
			<SelectField
				label="Invoice"
				name="invoiceId"
				placeholder="Select Invoice"
				value={props.invoiceId || undefined}
				onValueChange={props.setInvoiceId}
				disabled={props.invoiceLocked}
				required
				error={props.errors.invoiceId}>
				{props.invoices.map((invoice) => (
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
					value={props.amount}
					onChange={(event) => props.setAmount(event.target.value)}
					required
					error={props.errors.amount}
				/>
				{/* Amount End */}

				{/* Issue Date Start */}
				<DatePicker
					label="Issue Date"
					value={props.issueDate}
					onChange={props.setIssueDate}
					error={props.errors.issueDate}
				/>
				{/* Issue Date End */}
			</div>

			{/* Notes Start */}
			<div className="grid gap-2">
				<Label htmlFor="notes">Notes</Label>
				<textarea
					id="notes"
					name="notes"
					rows={4}
					value={props.notes}
					onChange={(event) => props.setNotes(event.target.value)}
					placeholder="Additional notes or comments..."
					className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
				/>
				<InputError message={props.errors.notes} />
			</div>
			{/* Notes End */}

			{/* Form Actions Section Start */}
			<div className="flex justify-between">
				<Button
					variant="outline"
					asChild>
					<Link
						href="/credit-notes"
						variant="unstyled"
						size="none">
						<ArrowLeft className="size-4" />
						Back to Credit Notes
					</Link>
				</Button>

				<Button
					type="submit"
					disabled={props.loading}>
					{props.submitLabel}
					{props.loading && <Spinner />}
				</Button>
			</div>
			{/* Form Actions Section End */}
		</form>
	)
}
