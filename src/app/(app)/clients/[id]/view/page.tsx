"use client"

import { isAxiosError } from "axios"
import { ArrowLeft, Printer } from "lucide-react"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import AppLogo from "@/components/app-logo"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "@/components/ui/link"
import { Spinner } from "@/components/ui/spinner"
import { useApp } from "@/contexts/AppContext"
import Axios from "@/lib/axios"
import { Head, useLayout } from "@/lib/spa"
import type { Client } from "@/types"

// The client endpoint may also return totals; they're shown when present.
type ClientDetails = Client & {
	invoicesCount?: number
	totalInvoiced?: string | number
	totalPaid?: string | number
}

function Detail({ label, value }: { label: string; value?: string | null }) {
	return (
		<div>
			<p className="text-sm text-muted-foreground print:text-gray-600">{label}</p>
			<p className="font-medium print:text-gray-900">{value || "—"}</p>
		</div>
	)
}

export default function ViewClient() {
	const props = useApp()
	const { id } = useParams<{ id: string }>()

	useLayout({
		breadcrumbs: [
			{ title: "Clients", href: "/clients" },
			{ title: "View", href: `/clients/${id}/view` },
		],
	})

	const [client, setClient] = useState<ClientDetails | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		Axios.get<{ data: ClientDetails }>(`/api/users/${id}`)
			.then((response) => setClient(response.data.data))
			.catch((error: unknown) => {
				if (isAxiosError(error)) {
					props.getErrors(error)
				}
			})
			.finally(() => setLoading(false))
	}, [id])

	// Prints only the client details, then restores the page.
	const printClient = (): void => {
		const contentToPrint = document.getElementById("contentToPrint")?.innerHTML

		if (!contentToPrint) {
			return
		}

		document.body.innerHTML = contentToPrint
		window.print()
		window.location.reload()
	}

	const hasStatistics =
		client?.invoicesCount !== undefined || client?.totalInvoiced !== undefined

	return (
		<>
			<Head title="View Client" />

			<div className="flex flex-1 flex-col gap-6 p-4">
				{/* Page Header Section Start */}
				<PageHeader
					title="View Client"
					description="Contact details and invoicing totals for this client.">
					<div className="flex gap-2">
						<Button
							variant="outline"
							asChild>
							<Link
								href="/clients"
								variant="unstyled"
								size="none">
								<ArrowLeft className="size-4" />
								Back to Clients
							</Link>
						</Button>
						<Button
							onClick={printClient}
							disabled={!client}>
							<Printer className="size-4" />
							Print
						</Button>
					</div>
				</PageHeader>
				{/* Page Header Section End */}

				{loading ? (
					<div className="flex justify-center py-12 text-muted-foreground">
						<Spinner />
					</div>
				) : client ? (
					/* Client Details Section Start */
					<div
						id="contentToPrint"
						className="space-y-4">
						<div className="flex flex-col items-start justify-between gap-4 border-b pb-6 md:flex-row">
							<AppLogo iconClassName="h-12 w-auto dark:invert print:invert-0" />
							<h2 className="text-2xl font-semibold tracking-tight print:text-gray-900">
								Client Details
							</h2>
						</div>

						<Card>
							<CardHeader>
								<CardTitle>Basic Information</CardTitle>
							</CardHeader>
							<CardContent className="grid gap-4 md:grid-cols-2">
								<Detail
									label="Name"
									value={client.name}
								/>
								<Detail
									label="Email"
									value={client.email}
								/>
								<Detail
									label="Phone"
									value={client.phone}
								/>
							</CardContent>
						</Card>

						{hasStatistics && (
							<Card>
								<CardHeader>
									<CardTitle>Statistics</CardTitle>
								</CardHeader>
								<CardContent className="grid gap-4 md:grid-cols-3">
									{client.invoicesCount !== undefined && (
										<Detail
											label="Total Invoices"
											value={String(client.invoicesCount)}
										/>
									)}
									{client.totalInvoiced !== undefined && (
										<Detail
											label="Total Invoiced"
											value={`KES ${client.totalInvoiced}`}
										/>
									)}
									{client.totalPaid !== undefined && (
										<Detail
											label="Total Paid"
											value={`KES ${client.totalPaid}`}
										/>
									)}
								</CardContent>
							</Card>
						)}
					</div>
				) : (
					/* Client Details Section End */
					<p className="py-12 text-center text-muted-foreground">
						This client couldn't be loaded.
					</p>
				)}
			</div>
		</>
	)
}
