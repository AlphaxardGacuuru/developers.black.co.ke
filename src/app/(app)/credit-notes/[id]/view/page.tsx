"use client"

import { useEffect, useState } from "react"
import { isAxiosError } from "axios"
import { useParams } from "next/navigation"
import { ArrowLeft, Printer } from "lucide-react"
import AppLogoIcon from "@/components/app-logo-icon"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"
import { Spinner } from "@/components/ui/spinner"
import { useApp } from "@/contexts/AppContext"
import Axios from "@/lib/axios"
import { Head, useLayout } from "@/lib/spa"
import type { CreditNote } from "@/types"

// Format currency with commas
const formatCurrency = (amount: string | number | undefined): string => {
	if (!amount) {
		return "0.00"
	}

	const numAmount = parseFloat(amount.toString().replace(/,/g, ""))

	return numAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

// Format date from YYYY-MM-DD to DD-MM-YYYY
const formatDate = (dateString: string | undefined): string => {
	if (!dateString) {
		return ""
	}

	const [year, month, day] = dateString.split("-")

	return `${day}-${month}-${year}`
}

export default function ViewCreditNote() {
	const { id } = useParams<{ id: string }>()

	useLayout({
		breadcrumbs: [
			{ title: "Credit Notes", href: "/credit-notes" },
			{ title: "View", href: `/credit-notes/${id}/view` },
		],
	})

	const props = useApp()

	const [creditNote, setCreditNote] = useState<CreditNote | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		Axios.get<{ data: CreditNote }>(`/api/credit-notes/${id}`)
			.then((response) => setCreditNote(response.data.data))
			.catch((error: unknown) => {
				if (isAxiosError(error)) {
					props.getErrors(error)
				}
			})
			.finally(() => setLoading(false))
	}, [id])

	const printCreditNote = (): void => {
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
			<Head title="View Credit Note" />

			<div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4 p-4">
				{/* Actions Section Start */}
				<div className="flex items-center justify-between">
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
						onClick={printCreditNote}
						disabled={!creditNote}>
						<Printer className="size-4" />
						Print
					</Button>
				</div>
				{/* Actions Section End */}

				{loading || !creditNote ? (
					/* Loading State Section Start */
					<div className="flex items-center justify-center gap-2 rounded-2xl border bg-card py-12 text-sm text-muted-foreground">
						{loading && <Spinner />}
						{loading ? "Loading credit note..." : "Credit note not found"}
					</div>
				) : (
					/* Loading State Section End */
					/* Credit Note Section Start */
					<div
						id="contentToPrint"
						className="rounded-2xl border bg-card p-8 shadow-xs print:border-gray-300 print:bg-white">
						{/* Credit Note Header Start */}
						<div className="mb-8 flex items-start justify-between border-b pb-6 print:border-gray-300">
							<AppLogoIcon className="h-10 w-auto dark:invert print:invert-0" />

							<h2 className="text-2xl text-foreground print:text-gray-900">
								CREDIT NOTE
							</h2>
						</div>
						{/* Credit Note Header End */}

						{/* Credit Note Info Start */}
						<div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
							<div className="text-foreground print:text-gray-900">
								<h5 className="mb-4 text-lg">Issued To:</h5>
								<div className="space-y-1 text-muted-foreground print:text-gray-700">
									<div className="font-semibold text-foreground print:text-gray-900">
										{creditNote.clientName}
									</div>
									<div>{creditNote.clientEmail}</div>
									<div>{creditNote.clientPhone}</div>
								</div>
							</div>

							<div className="text-right text-foreground print:text-gray-900">
								<h5 className="mb-4 text-lg">
									Credit Note #: {creditNote.number}
								</h5>
								<div className="space-y-1 text-muted-foreground print:text-gray-700">
									<div>Related Invoice #: {creditNote.invoiceNumber}</div>
									<div>
										<span className="font-semibold text-foreground print:text-gray-900">
											Issue Date:
										</span>{" "}
										{formatDate(creditNote.issueDate)}
									</div>
								</div>
							</div>
						</div>
						{/* Credit Note Info End */}

						{/* Credit Amount Start */}
						<div className="mb-8 border-b pb-6 print:border-gray-300">
							<div className="flex items-center justify-between rounded-xl border bg-muted/40 p-6 print:border-gray-300 print:bg-gray-50">
								<span className="text-lg font-semibold text-foreground print:text-gray-900">
									Credit Amount:
								</span>
								<span className="text-2xl font-semibold text-foreground print:text-gray-900">
									KES {formatCurrency(creditNote.amount)}
								</span>
							</div>
						</div>
						{/* Credit Amount End */}

						{/* Notes Start */}
						{creditNote.notes && (
							<div className="mb-8 border-b pb-6 print:border-gray-300">
								<h5 className="mb-2 text-foreground print:text-gray-900">
									Notes
								</h5>
								<p className="text-sm text-muted-foreground print:text-gray-700">
									{creditNote.notes}
								</p>
							</div>
						)}
						{/* Notes End */}

						{/* Footer Start */}
						<div className="mb-4 text-center">
							<p className="text-sm text-muted-foreground print:text-gray-500">
								Thank you for your business
							</p>
						</div>
						{/* Footer End */}
					</div>
					/* Credit Note Section End */
				)}
			</div>
		</>
	)
}
