"use client"

import type { ColumnDef, RowSelectionState } from "@tanstack/react-table"
import { isAxiosError } from "axios"
import {
	Coins,
	FileText,
	Mail,
	MessageSquare,
	Plus,
	Scale,
	Send,
	Wallet,
} from "lucide-react"
import type { Dispatch, SetStateAction } from "react"
import { useState } from "react"
import {
	InvoiceStatusBadge,
	INVOICE_STATUSES,
} from "@/components/invoices/invoice-status-badge"
import { StatCard } from "@/components/stat-card"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Link } from "@/components/ui/link"
import { SelectField, SelectItem } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { useApp } from "@/contexts/AppContext"
import { useFabPosition } from "@/hooks/use-fab-position"
import Axios from "@/lib/axios"
import { laravelPagination } from "@/lib/laravel-pagination"
import { toast } from "@/lib/toast"
import type { Invoice, PaginatedResponse } from "@/types"

// Radix selects can't hold an empty value, so "any" stands in for no filter.
const ANY = "any"

export type InvoiceListResponse = PaginatedResponse<SendableInvoice> & {
	sum?: string
	paid?: string
	balance?: string
}

type SendableInvoice = Invoice & { smsesSent?: number }

export type InvoiceFilters = {
	number: string
	clientId: string
	status: string
	startMonth: string
	startYear: string
	endMonth: string
	endYear: string
}

type Props = {
	invoices: InvoiceListResponse
	setInvoices: Dispatch<SetStateAction<InvoiceListResponse>>
	clients: { id: number; name: string }[]
	filters: InvoiceFilters
	setFilter: (filter: keyof InvoiceFilters, value: string) => void
}

const fromSelect = (value: string) => (value === ANY ? "" : value)

export default function InvoiceList({
	invoices,
	setInvoices,
	clients,
	filters,
	setFilter,
}: Props) {
	const props = useApp()
	const fabPosition = useFabPosition()

	const [loadingSMS, setLoadingSMS] = useState(false)
	const [loadingEmail, setLoadingEmail] = useState(false)
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
	const [showSendInvoiceModal, setShowSendInvoiceModal] = useState(false)
	const [invoiceToSend, setInvoiceToSend] = useState<SendableInvoice | null>(
		null
	)

	const handleError = (error: unknown) => {
		if (isAxiosError(error)) {
			props.getErrors(error)
		}
	}

	/*
	 * Send Email with PDF Attachment
	 */
	const onSendEmail = (invoiceId: number) => {
		if (loadingEmail) return

		setLoadingEmail(true)

		// The API generates the PDF with Browsershot and emails it
		Axios.post(`api/invoices/${invoiceId}/send-email`)
			.then((res) => {
				toast.success(
					res.data.message ||
						"Invoice email sent successfully with PDF attachment"
				)

				if (res.data.emailsSent) {
					setInvoiceToSend((prev) =>
						prev ? { ...prev, emailsSent: res.data.emailsSent } : prev
					)

					setInvoices((prev) => ({
						...prev,
						data: prev.data.map((invoice) =>
							invoice.id === invoiceId
								? { ...invoice, emailsSent: res.data.emailsSent }
								: invoice
						),
					}))
				}

				setShowSendInvoiceModal(false)
			})
			.catch(handleError)
			.finally(() => setLoadingEmail(false))
	}

	/*
	 * Send SMS
	 */
	const onSendSMS = (invoiceId: number) => {
		if (loadingSMS) return

		setLoadingSMS(true)

		Axios.post(`api/invoices/send-sms/${invoiceId}`)
			.then((res) => {
				toast.success(res.data.message)
				setShowSendInvoiceModal(false)
			})
			.catch(handleError)
			.finally(() => setLoadingSMS(false))
	}

	/*
	 * Delete Invoice
	 */
	const onDeleteInvoice = (invoiceId: number | (string | number)[]) => {
		const invoiceIds = Array.isArray(invoiceId)
			? invoiceId.join(",")
			: invoiceId

		Axios.delete(`/api/invoices/${invoiceIds}`)
			.then((res) => {
				toast.success(res.data.message)
				// Remove the deleted rows
				setInvoices((prev) => ({
					...prev,
					data: prev.data.filter((invoice) =>
						Array.isArray(invoiceId)
							? !invoiceId.map(String).includes(String(invoice.id))
							: invoice.id !== invoiceId
					),
				}))
			})
			.catch(handleError)
			.finally(() => setRowSelection({}))
	}

	const columns: ColumnDef<SendableInvoice, unknown>[] = [
		{
			id: "iteration",
			header: "#",
			cell: ({ row }) => (
				<div className="whitespace-nowrap">
					{props.iterator(row.index, invoices)}
				</div>
			),
		},
		{
			accessorKey: "number",
			header: "Number",
			cell: ({ row }) => (
				<div className="whitespace-nowrap">{row.original.number}</div>
			),
		},
		{
			accessorKey: "clientName",
			header: "Client",
		},
		{
			accessorKey: "amount",
			header: "Amount",
			cell: ({ row }) => (
				<div className="whitespace-nowrap text-green-600">
					<small>KES</small> {row.original.amount}
				</div>
			),
		},
		{
			accessorKey: "paid",
			header: "Paid",
		},
		{
			accessorKey: "balance",
			header: "Balance",
		},
		{
			accessorKey: "credits",
			header: "Credits",
			cell: ({ row }) => (
				<div className="whitespace-nowrap text-yellow-500">
					<small>KES</small> {row.original.credits}
				</div>
			),
		},
		{
			accessorKey: "deductions",
			header: "Deductions",
			cell: ({ row }) => (
				<div className="whitespace-nowrap text-red-500">
					<small>KES</small> {row.original.deductions}
				</div>
			),
		},
		{
			accessorKey: "status",
			header: "Status",
			cell: ({ row }) => <InvoiceStatusBadge status={row.original.status} />,
		},
		{
			accessorKey: "createdAt",
			header: "Created At",
		},
	]

	const sentCount = (invoice: SendableInvoice) =>
		(invoice.smsesSent ?? 0) + (invoice.emailsSent ?? 0)

	return (
		<>
			{/* Floating Section Start */}
			<div {...fabPosition}>
				<Button
					asChild
					className="h-14 min-w-14 rounded-full px-4 shadow-lg sm:px-6">
					<Link
						href="/invoices/create"
						variant="unstyled"
						aria-label="Create invoice"
						title="Create invoice">
						<Plus
							className="size-8"
							strokeWidth={1.3}
						/>
						<span className="hidden sm:inline">Create invoice</span>
					</Link>
				</Button>
			</div>
			{/* Floating Section End */}

			{/* Send Invoice Dialog Start */}
			<Dialog
				open={showSendInvoiceModal}
				onOpenChange={setShowSendInvoiceModal}>
				<DialogContent>
					<DialogTitle>Send Invoice {invoiceToSend?.number}</DialogTitle>
					<DialogDescription>
						Send invoice <strong>{invoiceToSend?.number}</strong> to{" "}
						<strong>{invoiceToSend?.clientName}</strong>? A PDF invoice will be
						generated and sent to{" "}
						<strong>{invoiceToSend?.clientEmail || "the client"}</strong>.
					</DialogDescription>

					<DialogFooter className="gap-2">
						<Button
							type="button"
							variant="secondary"
							onClick={() => setShowSendInvoiceModal(false)}>
							Cancel
						</Button>
						{/* SMS sending is hidden, as before */}
						<Button
							type="button"
							className="hidden"
							onClick={() => invoiceToSend && onSendSMS(invoiceToSend.id)}
							disabled={loadingSMS}>
							<MessageSquare />
							Send SMS{" "}
							{invoiceToSend?.smsesSent ? `(${invoiceToSend.smsesSent})` : ""}
							{loadingSMS && <Spinner />}
						</Button>
						<Button
							type="button"
							onClick={() => invoiceToSend && onSendEmail(invoiceToSend.id)}
							disabled={loadingEmail}>
							<Mail />
							{loadingEmail
								? "Generating PDF & Sending..."
								: invoiceToSend?.emailsSent
									? `Send Email (${invoiceToSend.emailsSent} sent)`
									: "Send Email"}
							{loadingEmail && <Spinner />}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			{/* Send Invoice Dialog End */}

			{/* Summary Cards Start */}
			<div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
				<StatCard
					label="Count"
					value={invoices.meta?.total ?? 0}
					icon={FileText}
				/>
				<StatCard
					label="Total"
					value={`KES ${invoices.sum ?? 0}`}
					icon={Wallet}
				/>
				<StatCard
					label="Balance"
					value={`KES ${invoices.balance ?? 0}`}
					icon={Scale}
				/>
				<StatCard
					label="Paid"
					value={`KES ${invoices.paid ?? 0}`}
					icon={Coins}
					valueClassName="text-green-600 dark:text-green-400"
				/>
			</div>
			{/* Summary Cards End */}

			{/* Filters Section Start */}
			<div className="grid gap-3 rounded-2xl border bg-card p-4 sm:grid-cols-2 lg:grid-cols-3">
				{/* Number Start */}
				<Input
					type="text"
					label="Number"
					value={filters.number}
					onChange={(e) => setFilter("number", e.target.value)}
				/>
				{/* Number End */}

				{/* Client Start */}
				<SelectField
					name="client"
					label="Client"
					value={filters.clientId || ANY}
					onValueChange={(value) => setFilter("clientId", fromSelect(value))}>
					<SelectItem value={ANY}>All clients</SelectItem>
					{clients.map((client) => (
						<SelectItem
							key={client.id}
							value={String(client.id)}>
							{client.name}
						</SelectItem>
					))}
				</SelectField>
				{/* Client End */}

				{/* Status Start */}
				<SelectField
					name="status"
					label="Status"
					value={filters.status || ANY}
					onValueChange={(value) => setFilter("status", fromSelect(value))}>
					<SelectItem value={ANY}>All statuses</SelectItem>
					{INVOICE_STATUSES.map((status) => (
						<SelectItem
							key={status.id}
							value={status.id}>
							{status.name}
						</SelectItem>
					))}
				</SelectField>
				{/* Status End */}

				<div className="grid grid-cols-2 gap-3">
					{/* Start Month Start */}
					<SelectField
						name="startMonth"
						label="Start At"
						value={filters.startMonth || ANY}
						onValueChange={(value) =>
							setFilter("startMonth", fromSelect(value))
						}>
						<SelectItem value={ANY}>Any month</SelectItem>
						{props.months.slice(1).map((month, key) => (
							<SelectItem
								key={month}
								value={String(key + 1)}>
								{month}
							</SelectItem>
						))}
					</SelectField>
					{/* Start Month End */}

					{/* Start Year Start */}
					<SelectField
						name="startYear"
						label="Year"
						value={filters.startYear || ANY}
						onValueChange={(value) => setFilter("startYear", fromSelect(value))}>
						<SelectItem value={ANY}>Any year</SelectItem>
						{props.years.map((year) => (
							<SelectItem
								key={year}
								value={String(year)}>
								{year}
							</SelectItem>
						))}
					</SelectField>
					{/* Start Year End */}
				</div>

				<div className="grid grid-cols-2 gap-3">
					{/* End Month Start */}
					<SelectField
						name="endMonth"
						label="End At"
						value={filters.endMonth || ANY}
						onValueChange={(value) => setFilter("endMonth", fromSelect(value))}>
						<SelectItem value={ANY}>Any month</SelectItem>
						{props.months.slice(1).map((month, key) => (
							<SelectItem
								key={month}
								value={String(key + 1)}>
								{month}
							</SelectItem>
						))}
					</SelectField>
					{/* End Month End */}

					{/* End Year Start */}
					<SelectField
						name="endYear"
						label="Year"
						value={filters.endYear || ANY}
						onValueChange={(value) => setFilter("endYear", fromSelect(value))}>
						<SelectItem value={ANY}>Any year</SelectItem>
						{props.years.map((year) => (
							<SelectItem
								key={year}
								value={String(year)}>
								{year}
							</SelectItem>
						))}
					</SelectField>
					{/* End Year End */}
				</div>
			</div>
			{/* Filters Section End */}

			{/* Invoices Table Section Start */}
			<div className="rounded-2xl border bg-card p-4">
				<DataTable
					rowSelection={rowSelection}
					setRowSelection={setRowSelection}
					columns={columns}
					data={invoices.data ?? []}
					emptyMessage={props.loadingItems > 0 ? "Loading…" : "No invoices yet"}
					showHref={(invoice) => `/invoices/${invoice.id}/view`}
					editHref={(invoice) => `/invoices/${invoice.id}/edit`}
					onDelete={(invoice) => onDeleteInvoice(invoice.id)}
					onBulkDelete={(ids) => onDeleteInvoice(ids)}
					getItemLabel={(invoice) => `Invoice ${invoice.number}`}
					renderActions={(invoice) => (
						<>
							{/* Send Invoice Start */}
							{parseFloat(invoice.balance?.replace(/,/g, "")) > 0 && (
								<Button
									type="button"
									size="sm"
									variant={sentCount(invoice) ? "default" : "outline"}
									className={
										sentCount(invoice)
											? "bg-green-600 text-white hover:bg-green-600/90"
											: undefined
									}
									onClick={() => {
										setInvoiceToSend(invoice)
										setShowSendInvoiceModal(true)
									}}>
									<Send />
									Send invoice
									{sentCount(invoice) ? ` (${sentCount(invoice)})` : ""}
								</Button>
							)}
							{/* Send Invoice End */}

							{/* Create Payment Start */}
							<Button
								asChild
								size="sm"
								variant="outline">
								<Link
									href={`/payments/${invoice.id}/create`}
									variant="unstyled"
									size="none">
									<Plus />
									Create payment
								</Link>
							</Button>
							{/* Create Payment End */}
						</>
					)}
					pagination={laravelPagination(
						invoices,
						(endpoint) => props.getPaginated(endpoint, setInvoices),
						setInvoices
					)}
				/>
			</div>
			{/* Invoices Table Section End */}
		</>
	)
}
