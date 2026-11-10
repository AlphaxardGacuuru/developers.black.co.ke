"use client"

import type { AxiosError } from "axios"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { ArrowLeft, Printer } from "lucide-react"
import AppLogoIcon from "@/components/app-logo-icon"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Link } from "@/components/ui/link"
import { Spinner } from "@/components/ui/spinner"
import { useApp } from "@/contexts/AppContext"
import Axios from "@/lib/axios"
import { Head, useLayout } from "@/lib/spa"
import type { ErrorResponse } from "@/types/app-context"
import type { Deduction } from "@/types"

// Format currency with commas
const formatCurrency = (amount?: string | number | null): string => {
	if (!amount) {
		return "0.00"
	}

	const numAmount = parseFloat(amount.toString().replace(/,/g, ""))

	return numAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

// Format date from YYYY-MM-DD to DD-MM-YYYY
const formatDate = (dateString?: string | null): string => {
	if (!dateString) {
		return ""
	}

	const [year, month, day] = dateString.split("-")

	return `${day}-${month}-${year}`
}

export default function ViewDeduction() {
	const { id } = useParams<{ id: string }>()

	useLayout({
		breadcrumbs: [
			{ title: "Deductions", href: "/deductions" },
			{ title: "View", href: `/deductions/${id}/view` },
		],
	})

	const props = useApp()

	const [deduction, setDeduction] = useState<Deduction | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		Axios.get<{ data: Deduction }>(`/api/deductions/${id}`)
			.then((response) => setDeduction(response.data.data))
			.catch((error: AxiosError<ErrorResponse>) => props.getErrors(error))
			.finally(() => setLoading(false))
	}, [id])

	// Prints only the deduction, then restores the page.
	const printDeduction = (): void => {
		const contentToPrint = document.getElementById("contentToPrint")?.innerHTML

		if (!contentToPrint) {
			return
		}

		document.body.innerHTML = contentToPrint
		window.print()
		window.location.reload()
	}

	return (
		<>
			<Head title="View Deduction" />

			<div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4 p-4">
				{/* Actions Section Start */}
				<div className="flex items-center justify-between">
					<Button
						variant="outline"
						asChild>
						<Link
							href="/deductions"
							variant="unstyled"
							size="none">
							<ArrowLeft className="size-4" />
							Back to Deductions
						</Link>
					</Button>

					<Button
						onClick={printDeduction}
						disabled={!deduction}>
						<Printer className="size-4" />
						Print
					</Button>
				</div>
				{/* Actions Section End */}

				{loading || !deduction ? (
					/* Loading Section Start */
					<div className="flex justify-center py-12 text-muted-foreground">
						{loading ? <Spinner /> : "Deduction not found."}
					</div>
				) : (
					/* Loading Section End */
					/* Deduction Section Start */
					<Card id="contentToPrint">
						<CardContent className="space-y-8 print:text-gray-900">
							{/* Deduction Header Start */}
							<div className="flex flex-col items-start justify-between gap-4 border-b pb-6 md:flex-row">
								<AppLogoIcon className="h-10 w-auto dark:invert" />
								<h2 className="text-2xl font-semibold tracking-tight">DEDUCTION</h2>
							</div>
							{/* Deduction Header End */}

							{/* Deduction Info Start */}
							<div className="grid grid-cols-1 gap-8 border-b pb-6 md:grid-cols-2">
								<div>
									<h5 className="mb-4 text-lg font-medium">Issued To:</h5>
									<div className="text-muted-foreground">
										<div className="font-semibold text-foreground">
											{deduction.clientName}
										</div>
										<div>{deduction.clientEmail}</div>
										<div>{deduction.clientPhone}</div>
									</div>
								</div>

								<div className="space-y-2 text-right text-muted-foreground">
									<h5 className="mb-4 text-lg text-foreground">
										<span className="font-semibold">Deduction Number:</span>{" "}
										{deduction.number}
									</h5>
									<p>
										<span className="font-semibold">Invoice Number:</span>{" "}
										{deduction.invoiceNumber}
									</p>
									<p>
										<span className="font-semibold">Issue Date:</span>{" "}
										{formatDate(deduction.issueDate)}
									</p>
								</div>
							</div>
							{/* Deduction Info End */}

							{/* Amount Section Start */}
							<div className="border-b pb-6">
								<h5 className="mb-4 font-medium">Deduction Amount</h5>
								<div className="flex items-center justify-between rounded-xl border bg-muted/40 p-6">
									<span className="font-semibold text-muted-foreground">Amount:</span>
									<span className="text-2xl font-bold text-red-500 print:text-red-600">
										<small>KES</small> {formatCurrency(deduction.amount)}
									</span>
								</div>
							</div>
							{/* Amount Section End */}

							{/* Notes Section Start */}
							{deduction.notes && (
								<div>
									<h5 className="mb-4 font-medium">Notes</h5>
									<div className="rounded-xl border bg-muted/40 p-6 text-muted-foreground">
										<p className="whitespace-pre-wrap">{deduction.notes}</p>
									</div>
								</div>
							)}
							{/* Notes Section End */}
						</CardContent>
					</Card>
					/* Deduction Section End */
				)}
			</div>
		</>
	)
}
