"use client"

import type { Dispatch, SetStateAction } from "react"
import { useState } from "react"
import type { RowSelectionState } from "@tanstack/react-table"
import { format } from "date-fns"
import { Banknote, Mail, MessageSquare, Plus, Send, Wallet } from "lucide-react"
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
import type { PaginatedResponse, Payment } from "@/types"

export type PaymentRow = Payment & {
	emailsSent?: number
	smsesSent?: number
}

/** /api/payments: a page of payments plus the sum of every matching payment. */
export type PaymentPage = PaginatedResponse<PaymentRow> & { sum?: string }

export type PaymentFilters = {
	number: string
	clientId: string
	startMonth: string
	startYear: string
	endMonth: string
	endYear: string
}

// Radix selects can't hold an empty value, so "any" stands in for no filter.
const ANY = "any"

type Props = {
	payments: PaymentPage
	setPayments: Dispatch<SetStateAction<PaymentPage>>
	clients: { id: number; name: string }[]
	filters: PaymentFilters
	setFilter: (key: keyof PaymentFilters, value: string) => void
}

export function PaymentList({
	payments,
	setPayments,
	clients,
	filters,
	setFilter,
}: Props) {
	const props = useApp()
	const fabPosition = useFabPosition()

	const [loadingSMS, setLoadingSMS] = useState(false)
	const [loadingEmail, setLoadingEmail] = useState(false)
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
	const [showSendPaymentModal, setShowSendPaymentModal] = useState(false)
	const [paymentToSend, setPaymentToSend] = useState<PaymentRow | null>(null)

	const selectFilter = (key: keyof PaymentFilters) => (value: string) =>
		setFilter(key, value === ANY ? "" : value)

	/*
	 * Send Email with PDF Attachment
	 */
	const onSendEmail = (paymentId: number) => {
		if (loadingEmail) return

		setLoadingEmail(true)

		// The API renders the PDF with Browsershot and emails it
		Axios.post(`api/payments/${paymentId}/send-email`)
			.then((response) => {
				toast.success(
					response.data.message ||
						"Payment email sent successfully with PDF attachment"
				)

				const emailsSent = response.data.emailsSent

				if (emailsSent) {
					setPaymentToSend((previous) =>
						previous ? { ...previous, emailsSent } : previous
					)
					setPayments((previous) => ({
						...previous,
						data: previous.data.map((payment) =>
							payment.id === paymentId ? { ...payment, emailsSent } : payment
						),
					}))
				}

				setShowSendPaymentModal(false)
			})
			.catch((error) => props.getErrors(error))
			.finally(() => setLoadingEmail(false))
	}

	/*
	 * Send SMS
	 */
	const onSendSMS = (paymentId: number) => {
		if (loadingSMS) return

		setLoadingSMS(true)

		Axios.post(`api/payments/send-sms/${paymentId}`)
			.then((response) => {
				toast.success(response.data.message)
				setShowSendPaymentModal(false)
			})
			.catch((error) => props.getErrors(error))
			.finally(() => setLoadingSMS(false))
	}

	/*
	 * Delete Payment
	 */
	const onDeletePayment = (paymentId: number | (string | number)[]) => {
		const paymentIds = Array.isArray(paymentId) ? paymentId.join(",") : paymentId

		Axios.delete(`/api/payments/${paymentIds}`)
			.then((response) => {
				toast.success(response.data.message)
				setPayments((previous) => ({
					...previous,
					data: previous.data.filter((payment) =>
						Array.isArray(paymentId)
							? !paymentId.map(String).includes(String(payment.id))
							: payment.id != paymentId
					),
				}))
			})
			.catch((error) => props.getErrors(error))
			.finally(() => setRowSelection({}))
	}

	const sentCount = (payment: PaymentRow) =>
		(payment.smsesSent ?? 0) + (payment.emailsSent ?? 0)

	return (
		<>
			{/* Floating Section Start */}
			<div {...fabPosition}>
				<Button
					asChild
					className="h-14 min-w-14 rounded-full px-4 shadow-lg sm:px-6">
					<Link
						href="/payments/create"
						variant="unstyled"
						aria-label="Create payment"
						title="Create payment">
						<Plus
							className="size-8"
							strokeWidth={1.3}
						/>
						<span className="hidden sm:inline">Create payment</span>
					</Link>
				</Button>
			</div>
			{/* Floating Section End */}

			{/* Send Receipt Dialog Start */}
			<Dialog
				open={showSendPaymentModal}
				onOpenChange={setShowSendPaymentModal}>
				<DialogContent>
					<DialogTitle>Send Receipt {paymentToSend?.number}</DialogTitle>
					<DialogDescription>
						Send receipt <strong>{paymentToSend?.number}</strong> to{" "}
						<strong>{paymentToSend?.clientName}</strong>? A PDF receipt will be
						generated and sent to{" "}
						<strong>{paymentToSend?.clientEmail || "the client"}</strong>.
					</DialogDescription>

					<DialogFooter className="gap-2">
						<Button
							type="button"
							variant="secondary"
							onClick={() => setShowSendPaymentModal(false)}>
							Cancel
						</Button>
						{/* SMS sending is hidden until the SMS provider is set up */}
						<Button
							type="button"
							className="hidden"
							disabled={loadingSMS}
							onClick={() => paymentToSend && onSendSMS(paymentToSend.id)}>
							<MessageSquare />
							Send SMS {paymentToSend?.smsesSent ? `(${paymentToSend.smsesSent})` : ""}
							{loadingSMS && <Spinner />}
						</Button>
						<Button
							type="button"
							disabled={loadingEmail}
							onClick={() => paymentToSend && onSendEmail(paymentToSend.id)}>
							<Mail />
							{loadingEmail
								? "Sending..."
								: paymentToSend?.emailsSent
									? `Send Email (${paymentToSend.emailsSent} sent)`
									: "Send Email"}
							{loadingEmail && <Spinner />}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			{/* Send Receipt Dialog End */}

			{/* Summary Cards Start */}
			<div className="grid gap-3 sm:grid-cols-2">
				<StatCard
					label="Count"
					value={payments.meta?.total ?? 0}
					icon={Wallet}
				/>
				<StatCard
					label="Total Payments"
					value={`KES ${payments.sum ?? 0}`}
					icon={Banknote}
					valueClassName="text-green-600 dark:text-green-400"
				/>
			</div>
			{/* Summary Cards End */}

			{/* Filters Section Start */}
			<div className="rounded-2xl border bg-card p-4 shadow-xs">
				<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{/* Number Start */}
					<Input
						type="text"
						label="Number"
						value={filters.number}
						onChange={(event) => setFilter("number", event.target.value)}
					/>
					{/* Number End */}

					{/* Client Start */}
					<SelectField
						name="client"
						label="Client"
						value={filters.clientId || ANY}
						onValueChange={selectFilter("clientId")}>
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

					<div className="grid grid-cols-2 gap-3">
						{/* Start Month Start */}
						<SelectField
							name="startMonth"
							label="Start At"
							value={filters.startMonth || ANY}
							onValueChange={selectFilter("startMonth")}>
							<SelectItem value={ANY}>Any month</SelectItem>
							{props.months.slice(1).map((month, index) => (
								<SelectItem
									key={month}
									value={String(index + 1)}>
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
							onValueChange={selectFilter("startYear")}>
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
							onValueChange={selectFilter("endMonth")}>
							<SelectItem value={ANY}>Any month</SelectItem>
							{props.months.slice(1).map((month, index) => (
								<SelectItem
									key={month}
									value={String(index + 1)}>
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
							onValueChange={selectFilter("endYear")}>
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
			</div>
			{/* Filters Section End */}

			{/* Payments Table Section Start */}
			<div className="rounded-2xl border bg-card p-4 shadow-xs">
				<DataTable<PaymentRow, unknown>
					rowSelection={rowSelection}
					setRowSelection={setRowSelection}
					columns={[
						{
							id: "index",
							header: "#",
							cell: ({ row }) => (
								<div className="whitespace-nowrap">
									{props.iterator(row.index, payments)}
								</div>
							),
						},
						{
							accessorKey: "number",
							header: "Number",
						},
						{
							accessorKey: "invoiceNumber",
							header: "Invoice",
						},
						{
							accessorKey: "clientName",
							header: "Client",
						},
						{
							accessorKey: "amount",
							header: "Amount",
							cell: ({ row }) => (
								<div className="whitespace-nowrap text-green-600 dark:text-green-400">
									<small>KES</small> {row.original.amount}
								</div>
							),
						},
						{
							accessorKey: "paymentDate",
							header: "Payment Date",
							cell: ({ row }) =>
								row.original.paymentDate
									? format(new Date(row.original.paymentDate), "dd MMM yyyy")
									: "",
						},
					]}
					data={payments.data ?? []}
					emptyMessage={props.loadingItems > 0 ? "Loading…" : "No payments yet"}
					showHref={(payment) => `/payments/${payment.id}/view`}
					editHref={(payment) => `/payments/${payment.id}/edit`}
					onDelete={(payment) => onDeletePayment(payment.id)}
					onBulkDelete={(ids) => onDeletePayment(ids)}
					getItemLabel={(payment) => `Payment ${payment.number}`}
					renderActions={(payment) => (
						/* Send Receipt Start */
						<Button
							type="button"
							size="sm"
							variant={sentCount(payment) ? "default" : "outline"}
							onClick={() => {
								setPaymentToSend(payment)
								setShowSendPaymentModal(true)
							}}>
							<Send />
							Send receipt {sentCount(payment) ? `(${sentCount(payment)})` : ""}
						</Button>
						/* Send Receipt End */
					)}
					pagination={laravelPagination(
						payments,
						(endpoint) => {
							props.getPaginated(endpoint, setPayments)
						},
						setPayments
					)}
				/>
			</div>
			{/* Payments Table Section End */}
		</>
	)
}
