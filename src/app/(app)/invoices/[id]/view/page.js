"use client"

import React, { useEffect, useState } from "react"
import { useApp } from "@/contexts/AppContext"
import Axios from "@/lib/axios"
import { format } from "date-fns"

import Header from "@/app/(app)/Header"
import MyLink from "@/components/ui/my-link"
import Btn from "@/components/ui/button"

import BackSVG from "@/svgs/BackSVG"
import PrintSVG from "@/svgs/PrintSVG"
import LogoSVG from "@/svgs/LogoSVG"

const ViewInvoice = ({ params }) => {
	const appProps = useApp()

	const [invoice, setInvoice] = useState({})
	const [loading, setLoading] = useState(true)

	// Format currency with commas
	const formatCurrency = (amount) => {
		if (!amount) return "0.00"
		const numAmount = parseFloat(amount.toString().replace(/,/g, ""))
		return numAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
	}

	useEffect(() => {
		// Fetch Invoice
		Axios.get(`/api/invoices/${params.id}`)
			.then((res) => {
				setInvoice(res.data.data)
				setLoading(false)
			})
			.catch((err) => {
				appProps.getErrors(err)
				setLoading(false)
			})
	}, [params.id])

	/*
	 * Print Invoice
	 */
	const printInvoice = () => {
		const contentToPrint = document.getElementById("contentToPrint").innerHTML
		const originalContent = document.body.innerHTML

		document.body.innerHTML = contentToPrint
		window.print()
		document.body.innerHTML = originalContent
		window.location.reload()
	}

	if (loading) {
		return (
			<>
				<Header title="View Invoice" />
				<div className="py-6">
					<div className="max-w-4xl mx-auto px-3 lg:px-4">
						<div className="bg-foreground/5 backdrop-blur-xl border border-border rounded-3xl p-8">
							<div className="text-foreground text-center">Loading invoice...</div>
						</div>
					</div>
				</div>
			</>
		)
	}

	return (
		<>
			<Header title="View Invoice" />

			<div className="py-6">
				<div className="max-w-4xl mx-auto px-3 lg:px-4">
					{/* Action Buttons */}
					<div className="flex justify-between items-center mb-4">
						<MyLink
							href="/invoices"
							icon={<BackSVG />}
							text="Back to Invoices"
						/>
						<Btn
							icon={<PrintSVG />}
							text="Print"
							onClick={printInvoice}
						/>
					</div>

					{/* Invoice Content */}
					<div
						id="contentToPrint"
						className="bg-foreground/5 backdrop-blur-xl border border-border rounded-3xl p-8 print:bg-white print:border-gray-300">
						{/* Invoice Header */}
						<div className="flex justify-between items-start mb-8 pb-6 border-b border-border print:border-gray-300">
							<div className="text-foreground print:text-gray-900">
								<div className="text-xl sm:text-4xl mb-2">
									<LogoSVG />
								</div>
							</div>

							<div className="text-right">
								<h2 className="text-2xl text-foreground mb-2 print:text-gray-900">
									INVOICE
								</h2>
								<div className="inline-block">
									<span
										className={`
											${
												invoice.status == "not_paid"
													? "bg-red-600 text-white"
													: invoice.status == "partially_paid"
														? "bg-yellow-500 text-gray-900"
														: invoice.status == "paid"
															? "bg-green-600 text-white"
															: "bg-gray-600 text-foreground"
											}
											py-2 px-4 rounded capitalize
										`}>
										{invoice.status
											?.split("_")
											.map(
												(word) => word.charAt(0).toUpperCase() + word.slice(1)
											)
											.join(" ")}
									</span>
								</div>
							</div>
						</div>

						{/* Invoice Info */}
						<div className="flex justify-between mb-8">
							<div className="text-foreground print:text-gray-900">
								<h5 className="text-lg mb-2">Billed To</h5>
								<div className="text-foreground/80 print:text-gray-700">
									<div>Client: {invoice.clientName}</div>
									<div>Email: {invoice.clientEmail}</div>
									{invoice.clientPhone && (
										<div>Phone: {invoice.clientPhone}</div>
									)}
								</div>
							</div>
							<div className="text-right text-foreground print:text-gray-900">
								<h5 className="text-lg mb-2">
									Invoice No: {invoice.number}
								</h5>
								<div className="text-foreground/80 print:text-gray-700">
									<div>
										Issue Date: {format(invoice.issueDate, "dd MMM yyyy")}
									</div>
									<div>Due Date: {format(invoice.dueDate, "dd MMM yyyy")}</div>
								</div>
							</div>
						</div>

						{/* Line Items Table */}
						<div className="overflow-x-auto mb-8">
							<table className="w-full">
								<thead className="border-b border-border print:border-gray-300">
									<tr className="text-foreground/60 print:text-gray-700">
										<th className="text-left py-3 font-normal">
											Item
										</th>
										<th className="text-left py-3 font-normal">
											Description
										</th>
										<th className="text-center py-3 font-normal">
											Quantity
										</th>
										<th className="text-right py-3 font-normal">
											Rate
										</th>
										<th className="text-right py-3 font-normal">
											Amount
										</th>
									</tr>
								</thead>
								<tbody>
									{invoice.invoiceItems?.map((item, key) => (
										<tr
											key={key}
											className="border-b border-border print:border-gray-200">
											<td className="py-4 text-foreground print:text-gray-900">
												{item.item}
											</td>
											<td className="py-4 text-foreground/80 text-sm print:text-gray-600">
												{item.description}
											</td>
											<td className="py-4 text-center text-foreground print:text-gray-900">
												{item.quantity}
											</td>
											<td className="py-4 text-right text-foreground print:text-gray-900">
												<small className="mr-1">KES</small>
												{formatCurrency(item.rate)}
											</td>
											<td className="py-4 text-right text-foreground print:text-gray-900">
												<small className="mr-1">KES</small>
												{formatCurrency(item.amount)}
											</td>
										</tr>
									))}

									{/* Totals */}
									<tr className="border-t border-border print:border-gray-300">
										<td
											colSpan="4"
											className="py-3 text-right text-foreground print:text-gray-900">
											Subtotal:
										</td>
										<td className="py-3 text-right text-foreground print:text-gray-900">
											<small className="mr-1">KES</small>
											{formatCurrency(
												invoice.invoiceItems?.reduce(
													(sum, item) => sum + (parseFloat(item.amount) || 0),
													0
												) ?? 0
											)}
										</td>
									</tr>
									{parseFloat(invoice.withholdingTax) > 0 && (
										<tr className="border-b border-border print:border-gray-200">
											<td
												colSpan="4"
												className="py-3 text-right text-foreground print:text-gray-900">
												Withholding Tax (5%):
											</td>
											<td className="py-3 text-right text-red-400 print:text-red-600">
												- <small className="mr-1">KES</small>
												{formatCurrency(invoice.withholdingTax)}
											</td>
										</tr>
									)}
									<tr className="border-b border-border print:border-gray-200">
										<td
											colSpan="4"
											className="py-3 text-right text-foreground print:text-gray-900">
											Total:
										</td>
										<td className="py-3 text-right text-foreground font-medium print:text-gray-900">
											<small className="mr-1">KES</small>
											{formatCurrency(invoice.amount)}
										</td>
									</tr>
									<tr className="border-b border-border print:border-gray-200">
										<td
											colSpan="4"
											className="py-3 text-right text-foreground print:text-gray-900">
											Paid:
										</td>
										<td className="py-3 text-right text-green-500 print:text-green-600">
											<small className="mr-1">KES</small>
											{formatCurrency(invoice.paid)}
										</td>
									</tr>
									<tr className="border-t-2 border-foreground/30 print:border-gray-400">
										<td
											colSpan="4"
											className="py-4 text-right text-foreground text-lg print:text-gray-900">
											Balance Due:
										</td>
										<td className="py-4 text-right text-foreground text-lg font-medium print:text-gray-900">
											<small className="mr-1">KES</small>
											{formatCurrency(invoice.balance)}
										</td>
									</tr>
								</tbody>
							</table>
						</div>

						{/* Notes and Terms */}
						{(invoice.notes || invoice.terms) && (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pb-6 border-b border-border print:border-gray-300">
								{invoice.notes && (
									<div>
										<h5 className="text-foreground mb-2 print:text-gray-900">
											Notes
										</h5>
										<p className="text-foreground/80 text-sm print:text-gray-700">
											{invoice.notes}
										</p>
									</div>
								)}
								{invoice.terms && (
									<div>
										<h5 className="text-foreground mb-2 print:text-gray-900">
											Terms & Conditions
										</h5>
										<p className="text-foreground/80 text-sm print:text-gray-700">
											{invoice.terms}
										</p>
									</div>
								)}
							</div>
						)}

						{/* Footer */}
						<div className="text-center mb-4">
							<h4 className="text-foreground text-xl print:text-gray-900">
								<div className="mb-2">Pay to 0700364446 via M-Pesa, unless otherwise stated.</div>
								<div>Thank you for your business!</div>
							</h4>
						</div>

						<div className="flex justify-end">
							<div className="text-right text-foreground print:text-gray-900">
								<h3 className="text-xl mb-2">Black Developers</h3>
								<div className="text-foreground/80 text-sm print:text-gray-700">
									<div>Email: al@developers.black.co.ke</div>
									<div>Phone: +254 700 364446</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default ViewInvoice
