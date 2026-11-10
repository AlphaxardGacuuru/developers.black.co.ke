"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { format, isValid, parse } from "date-fns"
import { ArrowLeft, Printer } from "lucide-react"
import AppLogoIcon from "@/components/app-logo-icon"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"
import { Spinner } from "@/components/ui/spinner"
import { useApp } from "@/contexts/AppContext"
import Axios from "@/lib/axios"
import { Head, useLayout } from "@/lib/spa"
import type { Payment } from "@/types"

// Amounts come back formatted ("1,234.00"); show them with two decimals.
const formatCurrency = (amount?: string | number | null): string => {
	if (!amount) return "0.00"

	return parseFloat(String(amount).replace(/,/g, ""))
		.toFixed(2)
		.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

// YYYY-MM-DD to DD-MM-YYYY
const formatDate = (dateString?: string | null): string => {
	if (!dateString) return ""

	const date = parse(String(dateString).slice(0, 10), "yyyy-MM-dd", new Date())

	return isValid(date) ? format(date, "dd-MM-yyyy") : ""
}

export default function ViewPayment() {
	const props = useApp()
	const { id } = useParams<{ id: string }>()

	useLayout({
		breadcrumbs: [
			{ title: "Payments", href: "/payments" },
			{ title: "View", href: `/payments/${id}/view` },
		],
	})

	const [payment, setPayment] = useState<Payment | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		Axios.get(`/api/payments/${id}`)
			.then((response) => setPayment(response.data.data))
			.catch((error) => props.getErrors(error))
			.finally(() => setLoading(false))
	}, [id])

	// Print only the receipt, then restore the page.
	const printPayment = () => {
		const contentToPrint = document.getElementById("contentToPrint")?.innerHTML

		if (!contentToPrint) return

		document.body.innerHTML = contentToPrint
		window.print()
		window.location.reload()
	}

	return (
		<>
			<Head title="View Payment" />

			<div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4 p-4">
				{/* Actions Section Start */}
				<div className="flex items-center justify-between">
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
						type="button"
						onClick={printPayment}
						disabled={!payment}>
						<Printer />
						Print
					</Button>
				</div>
				{/* Actions Section End */}

				{loading ? (
					<div className="flex justify-center py-12 text-muted-foreground">
						<Spinner />
					</div>
				) : payment ? (
					/* Receipt Section Start */
					<div
						id="contentToPrint"
						className="rounded-2xl border bg-card p-8 shadow-xs print:border-gray-300 print:bg-white">
						{/* Receipt Header Start */}
						<div className="mb-8 flex items-start justify-between border-b pb-6 print:border-gray-300">
							<AppLogoIcon className="h-10 w-auto dark:invert print:invert-0" />

							<h2 className="mb-2 text-2xl text-foreground print:text-gray-900">
								PAYMENT RECEIPT
							</h2>
						</div>
						{/* Receipt Header End */}

						{/* Receipt Info Start */}
						<div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
							<div className="text-foreground print:text-gray-900">
								<h5 className="mb-4 text-lg">Payment From</h5>
								<div className="space-y-1 text-muted-foreground print:text-gray-700">
									<div>Client: {payment.clientName}</div>
									<div>Email: {payment.clientEmail}</div>
									{payment.clientPhone && <div>Phone: {payment.clientPhone}</div>}
								</div>
							</div>
							<div className="text-right text-foreground print:text-gray-900">
								<h5 className="mb-4 text-lg">Payment Details</h5>
								<div className="space-y-1 text-muted-foreground print:text-gray-700">
									<div>Payment Date: {formatDate(payment.paymentDate)}</div>
								</div>
							</div>
						</div>
						{/* Receipt Info End */}

						{/* Receipt Table Start */}
						<div className="mb-8 overflow-x-auto">
							<table className="w-full">
								<thead className="border-b print:border-gray-300">
									<tr className="text-muted-foreground print:text-gray-700">
										<th className="py-3 text-left font-normal">Description</th>
										<th className="py-3 text-right font-normal">Amount</th>
									</tr>
								</thead>
								<tbody>
									<tr className="border-b print:border-gray-200">
										<td className="py-4 text-foreground print:text-gray-900">
											Payment for Invoice: {payment.invoiceNumber}
										</td>
										<td className="py-4 text-right text-foreground print:text-gray-900">
											<small className="mr-1">KES</small>
											{formatCurrency(payment.amount)}
										</td>
									</tr>

									<tr className="border-t-2 border-foreground/30 print:border-gray-400">
										<td className="py-4 text-right text-lg text-foreground print:text-gray-900">
											Total Paid:
										</td>
										<td className="py-4 text-right text-lg font-medium text-foreground print:text-gray-900">
											<small className="mr-1">KES</small>
											{formatCurrency(payment.amount)}
										</td>
									</tr>
								</tbody>
							</table>
						</div>
						{/* Receipt Table End */}

						{/* Notes Start */}
						{payment.notes && (
							<div className="mb-8 border-b pb-6 print:border-gray-300">
								<h5 className="mb-2 text-foreground print:text-gray-900">Notes</h5>
								<p className="text-sm text-muted-foreground print:text-gray-700">
									{payment.notes}
								</p>
							</div>
						)}
						{/* Notes End */}

						{/* Receipt Footer Start */}
						<div className="mb-4 text-center">
							<h4 className="text-xl text-foreground print:text-gray-900">
								Thank you for your payment!
							</h4>
						</div>

						<div className="flex justify-end">
							<div className="text-right text-foreground print:text-gray-900">
								<h3 className="mb-2 text-xl">Black Developers</h3>
								<div className="text-sm text-muted-foreground print:text-gray-700">
									<div>Email: al@black.co.ke</div>
									<div>Phone: +254 700 364446</div>
								</div>
							</div>
						</div>
						{/* Receipt Footer End */}
					</div>
					/* Receipt Section End */
				) : (
					<div className="py-12 text-center text-muted-foreground">
						Payment not found.
					</div>
				)}
			</div>
		</>
	)
}
