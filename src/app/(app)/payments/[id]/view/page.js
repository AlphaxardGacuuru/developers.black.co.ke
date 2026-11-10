"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/contexts/AppContext"
import Axios from "@/lib/axios"
import { format, parse, isValid } from "date-fns"

import Header from "@/app/(app)/Header"
import MyLink from "@/components/legacy/my-link"
import Btn from "@/components/legacy/button"

import BackSVG from "@/svgs/BackSVG"
import PrintSVG from "@/svgs/PrintSVG"
import LogoSVG from "@/svgs/LogoSVG"

const ViewPayment = ({ params }) => {
	const router = useRouter()
	const appProps = useApp()

	const [payment, setPayment] = useState({})
	const [loading, setLoading] = useState(true)

	// Format currency with commas
	const formatCurrency = (amount) => {
		if (!amount) return "0.00"
		const numAmount = parseFloat(amount.toString().replace(/,/g, ""))
		return numAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
	}

	// Format date from YYYY-MM-DD to DD-MM-YYYY
	const formatDate = (dateString) => {
		if (!dateString) return ""
		const date = parse(
			String(dateString).slice(0, 10),
			"yyyy-MM-dd",
			new Date()
		)
		return isValid(date) ? format(date, "dd-MM-yyyy") : ""
	}

	useEffect(() => {
		// Fetch Payment
		Axios.get(`/api/payments/${params.id}`)
			.then((res) => {
				setPayment(res.data.data)
				setLoading(false)
			})
			.catch((err) => {
				appProps.getErrors(err)
				setLoading(false)
			})
	}, [params.id])

	/*
	 * Print Payment
	 */
	const printPayment = () => {
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
				<Header title="View Payment" />
				<div className="py-6">
					<div className="max-w-4xl mx-auto px-3 lg:px-4">
						<div className="bg-foreground/5 backdrop-blur-xl border border-border rounded-3xl p-8">
							<div className="text-foreground text-center">Loading payment...</div>
						</div>
					</div>
				</div>
			</>
		)
	}

	return (
		<>
			<Header title="View Payment" />

			<div className="py-6">
				<div className="max-w-4xl mx-auto px-3 lg:px-4">
					{/* Action Buttons */}
					<div className="flex justify-between items-center mb-4">
						<MyLink
							href="/payments"
							icon={<BackSVG />}
							text="Back to Payments"
						/>
						<Btn
							icon={<PrintSVG />}
							text="Print"
							onClick={printPayment}
						/>
					</div>

					{/* Payment Content */}
					<div
						id="contentToPrint"
						className="bg-foreground/5 backdrop-blur-xl border border-border rounded-3xl p-8 print:bg-white print:border-gray-300">
						{/* Payment Header */}
						<div className="flex justify-between items-start mb-8 pb-6 border-b border-border print:border-gray-300">
							<div className="text-foreground print:text-gray-900">
								<div className="text-xl sm:text-4xl mb-2">
									<LogoSVG />
								</div>
							</div>

							<div className="text-right">
								<h2 className="text-2xl text-foreground mb-2 print:text-gray-900">
									PAYMENT RECEIPT
								</h2>
							</div>
						</div>

						{/* Payment Info */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
							<div className="text-foreground print:text-gray-900">
								<h5 className="text-lg mb-4">Payment From</h5>
								<div className="text-foreground/80 print:text-gray-700 space-y-1">
									<div>Client: {payment.clientName}</div>
									<div>Email: {payment.clientEmail}</div>
									{payment.clientPhone && (
										<div>Phone: {payment.clientPhone}</div>
									)}
								</div>
							</div>
							<div className="text-right text-foreground print:text-gray-900">
								<h5 className="text-lg mb-4">Payment Details</h5>
								<div className="text-foreground/80 print:text-gray-700 space-y-1">
									<div>Payment Date: {formatDate(payment.paymentDate)}</div>
								</div>
							</div>
						</div>

						{/* Payment Details Table */}
						<div className="overflow-x-auto mb-8">
							<table className="w-full">
								<thead className="border-b border-border print:border-gray-300">
									<tr className="text-foreground/60 print:text-gray-700">
										<th className="text-left py-3 font-normal">
											Description
										</th>
										<th className="text-right py-3 font-normal">
											Amount
										</th>
									</tr>
								</thead>
								<tbody>
									<tr className="border-b border-border print:border-gray-200">
										<td className="py-4 text-foreground print:text-gray-900">
											Payment for Invoice: {payment.invoiceNumber}
										</td>
										<td className="py-4 text-right text-foreground print:text-gray-900">
											<small className="mr-1">KES</small>
											{formatCurrency(payment.amount)}
										</td>
									</tr>

									{/* Total */}
									<tr className="border-t-2 border-foreground/30 print:border-gray-400">
										<td className="py-4 text-right text-foreground text-lg print:text-gray-900">
											Total Paid:
										</td>
										<td className="py-4 text-right text-foreground text-lg font-medium print:text-gray-900">
											<small className="mr-1">KES</small>
											{formatCurrency(payment.amount)}
										</td>
									</tr>
								</tbody>
							</table>
						</div>

						{/* Notes */}
						{payment.notes && (
							<div className="mb-8 pb-6 border-b border-border print:border-gray-300">
								<h5 className="text-foreground mb-2 print:text-gray-900">
									Notes
								</h5>
								<p className="text-foreground/80 text-sm print:text-gray-700">
									{payment.notes}
								</p>
							</div>
						)}

						{/* Footer */}
						<div className="text-center mb-4">
							<h4 className="text-foreground text-xl print:text-gray-900">
								Thank you for your payment!
							</h4>
						</div>

						<div className="flex justify-end">
							<div className="text-right text-foreground print:text-gray-900">
								<h3 className="text-xl mb-2">Black Developers</h3>
								<div className="text-foreground/80 text-sm print:text-gray-700">
									<div>Email: al@black.co.ke</div>
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

export default ViewPayment
