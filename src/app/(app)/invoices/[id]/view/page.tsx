"use client"

import { isAxiosError } from "axios"
import { format } from "date-fns"
import { ArrowLeft, Printer } from "lucide-react"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import AppLogoIcon from "@/components/app-logo-icon"
import { InvoiceStatusBadge } from "@/components/invoices/invoice-status-badge"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"
import { Spinner } from "@/components/ui/spinner"
import { useApp } from "@/contexts/AppContext"
import Axios from "@/lib/axios"
import { Head, useLayout } from "@/lib/spa"
import type { Invoice } from "@/types"

type ViewedInvoice = Omit<Invoice, "invoiceItems"> & {
	clientPhone?: string | null
	invoiceItems: (Invoice["invoiceItems"][number] & { item?: string })[]
}

// Format currency with commas
const formatCurrency = (amount?: number | string | null): string => {
	if (!amount) return "0.00"

	const numAmount = parseFloat(amount.toString().replace(/,/g, ""))

	return numAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const formatDate = (date?: string | null) =>
	date ? format(date, "dd MMM yyyy") : ""

export default function ViewInvoice() {
	const props = useApp()
	const { id } = useParams<{ id: string }>()

	useLayout({
		breadcrumbs: [
			{ title: "Invoices", href: "/invoices" },
			{ title: "View", href: `/invoices/${id}/view` },
		],
	})

	const [invoice, setInvoice] = useState<ViewedInvoice | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		Axios.get<{ data: ViewedInvoice }>(`/api/invoices/${id}`)
			.then((res) => setInvoice(res.data.data))
			.catch((error: unknown) => {
				if (isAxiosError(error)) {
					props.getErrors(error)
				}
			})
			.finally(() => setLoading(false))
	}, [id])

	/*
	 * Print only the invoice, then restore the page
	 */
	const printInvoice = () => {
		const contentToPrint = document.getElementById("contentToPrint")?.innerHTML

		if (!contentToPrint) {
			return
		}

		document.body.innerHTML = contentToPrint
		window.print()
		window.location.reload()
	}

	const subtotal =
		invoice?.invoiceItems?.reduce(
			(sum, item) => sum + (parseFloat(String(item.amount)) || 0),
			0
		) ?? 0

	return (
		<>
			<Head title="View Invoice" />

			<div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4 p-4">
				{/* Actions Section Start */}
				<div className="flex items-center justify-between">
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
						type="button"
						onClick={printInvoice}
						disabled={!invoice}>
						<Printer />
						Print
					</Button>
				</div>
				{/* Actions Section End */}

				{loading || !invoice ? (
					<div className="flex items-center justify-center gap-2 rounded-2xl border bg-card p-8 text-muted-foreground">
						{loading ? (
							<>
								<Spinner />
								Loading invoice...
							</>
						) : (
							"Invoice not found"
						)}
					</div>
				) : (
					/* Invoice Section Start */
					<div
						id="contentToPrint"
						className="rounded-2xl border bg-card p-8 shadow-xs print:border-gray-300 print:bg-white">
						{/* Invoice Header Start */}
						<div className="mb-8 flex items-start justify-between border-b pb-6 print:border-gray-300">
							<AppLogoIcon className="h-10 w-auto dark:invert print:invert-0" />

							<div className="text-right">
								<h2 className="mb-2 text-2xl font-semibold print:text-gray-900">
									INVOICE
								</h2>
								<InvoiceStatusBadge
									status={invoice.status}
									className="px-4 py-2"
								/>
							</div>
						</div>
						{/* Invoice Header End */}

						{/* Invoice Info Start */}
						<div className="mb-8 flex justify-between gap-6">
							<div className="print:text-gray-900">
								<h5 className="mb-2 text-lg font-medium">Billed To</h5>
								<div className="text-muted-foreground print:text-gray-700">
									<div>Client: {invoice.clientName}</div>
									<div>Email: {invoice.clientEmail}</div>
									{invoice.clientPhone && <div>Phone: {invoice.clientPhone}</div>}
								</div>
							</div>
							<div className="text-right print:text-gray-900">
								<h5 className="mb-2 text-lg font-medium">
									Invoice No: {invoice.number}
								</h5>
								<div className="text-muted-foreground print:text-gray-700">
									<div>Issue Date: {formatDate(invoice.issueDate)}</div>
									<div>Due Date: {formatDate(invoice.dueDate)}</div>
								</div>
							</div>
						</div>
						{/* Invoice Info End */}

						{/* Line Items Start */}
						<div className="mb-8 overflow-x-auto">
							<table className="w-full">
								<thead className="border-b print:border-gray-300">
									<tr className="text-muted-foreground print:text-gray-700">
										<th className="py-3 text-left font-normal">Item</th>
										<th className="py-3 text-left font-normal">Description</th>
										<th className="py-3 text-center font-normal">Quantity</th>
										<th className="py-3 text-right font-normal">Rate</th>
										<th className="py-3 text-right font-normal">Amount</th>
									</tr>
								</thead>
								<tbody>
									{invoice.invoiceItems?.map((item, key) => (
										<tr
											key={key}
											className="border-b print:border-gray-200">
											<td className="py-4 print:text-gray-900">{item.item}</td>
											<td className="py-4 text-sm text-muted-foreground print:text-gray-600">
												{item.description}
											</td>
											<td className="py-4 text-center print:text-gray-900">
												{item.quantity}
											</td>
											<td className="py-4 text-right print:text-gray-900">
												<small className="mr-1">KES</small>
												{formatCurrency(item.rate)}
											</td>
											<td className="py-4 text-right print:text-gray-900">
												<small className="mr-1">KES</small>
												{formatCurrency(item.amount)}
											</td>
										</tr>
									))}

									{/* Totals Start */}
									<tr className="border-t print:border-gray-300">
										<td
											colSpan={4}
											className="py-3 text-right print:text-gray-900">
											Subtotal:
										</td>
										<td className="py-3 text-right print:text-gray-900">
											<small className="mr-1">KES</small>
											{formatCurrency(subtotal)}
										</td>
									</tr>
									{parseFloat(String(invoice.withholdingTax)) > 0 && (
										<tr className="border-b print:border-gray-200">
											<td
												colSpan={4}
												className="py-3 text-right print:text-gray-900">
												Withholding Tax (5%):
											</td>
											<td className="py-3 text-right text-red-500 print:text-red-600">
												- <small className="mr-1">KES</small>
												{formatCurrency(invoice.withholdingTax)}
											</td>
										</tr>
									)}
									<tr className="border-b print:border-gray-200">
										<td
											colSpan={4}
											className="py-3 text-right print:text-gray-900">
											Total:
										</td>
										<td className="py-3 text-right font-medium print:text-gray-900">
											<small className="mr-1">KES</small>
											{formatCurrency(invoice.amount)}
										</td>
									</tr>
									<tr className="border-b print:border-gray-200">
										<td
											colSpan={4}
											className="py-3 text-right print:text-gray-900">
											Paid:
										</td>
										<td className="py-3 text-right text-green-600 print:text-green-600">
											<small className="mr-1">KES</small>
											{formatCurrency(invoice.paid)}
										</td>
									</tr>
									<tr className="border-t-2 border-foreground/30 print:border-gray-400">
										<td
											colSpan={4}
											className="py-4 text-right text-lg print:text-gray-900">
											Balance Due:
										</td>
										<td className="py-4 text-right text-lg font-medium print:text-gray-900">
											<small className="mr-1">KES</small>
											{formatCurrency(invoice.balance)}
										</td>
									</tr>
									{/* Totals End */}
								</tbody>
							</table>
						</div>
						{/* Line Items End */}

						{/* Notes And Terms Start */}
						{(invoice.notes || invoice.terms) && (
							<div className="mb-8 grid grid-cols-1 gap-6 border-b pb-6 md:grid-cols-2 print:border-gray-300">
								{invoice.notes && (
									<div>
										<h5 className="mb-2 font-medium print:text-gray-900">Notes</h5>
										<p className="text-sm text-muted-foreground print:text-gray-700">
											{invoice.notes}
										</p>
									</div>
								)}
								{invoice.terms && (
									<div>
										<h5 className="mb-2 font-medium print:text-gray-900">
											Terms & Conditions
										</h5>
										<p className="text-sm text-muted-foreground print:text-gray-700">
											{invoice.terms}
										</p>
									</div>
								)}
							</div>
						)}
						{/* Notes And Terms End */}

						{/* Footer Start */}
						<div className="mb-4 text-center">
							<h4 className="text-xl print:text-gray-900">
								<div className="mb-2">
									Pay to 0700364446 via M-Pesa, unless otherwise stated.
								</div>
								<div>Thank you for your business!</div>
							</h4>
						</div>

						<div className="flex justify-end">
							<div className="text-right print:text-gray-900">
								<h3 className="mb-2 text-xl font-medium">Black Developers</h3>
								<div className="text-sm text-muted-foreground print:text-gray-700">
									<div>Email: al@developers.black.co.ke</div>
									<div>Phone: +254 700 364446</div>
								</div>
							</div>
						</div>
						{/* Footer End */}
					</div>
					/* Invoice Section End */
				)}
			</div>
		</>
	)
}
