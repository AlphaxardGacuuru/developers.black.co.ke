"use client"

import { useEffect, useState } from "react"
import type { AxiosError } from "axios"
import {
	CreditCard,
	FileMinus,
	FilePlus,
	FileText,
	Users,
	Wallet,
} from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { StatCard } from "@/components/stat-card"
import { useApp } from "@/contexts/AppContext"
import Axios from "@/lib/axios"
import { Head, useLayout } from "@/lib/spa"
import type { ErrorResponse } from "@/types/app-context"

type Totals = { count: number; total: number | string }

type DashboardStats = {
	clients: { count: number }
	invoices: Totals
	payments: Totals
	creditNotes: Totals
	deductions: Totals
}

const EMPTY_STATS: DashboardStats = {
	clients: { count: 0 },
	invoices: { count: 0, total: 0 },
	payments: { count: 0, total: 0 },
	creditNotes: { count: 0, total: 0 },
	deductions: { count: 0, total: 0 },
}

function formatCurrency(amount: number | string | null | undefined): string {
	if (!amount) {
		return "0.00"
	}

	return parseFloat(amount.toString().replace(/,/g, ""))
		.toFixed(2)
		.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export default function Dashboard() {
	const props = useApp()

	useLayout({
		breadcrumbs: [{ title: "Dashboard", href: "/dashboard" }],
	})

	const [stats, setStats] = useState<DashboardStats>(EMPTY_STATS)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		Axios.get<DashboardStats>("api/dashboard-stats")
			.then((response) => setStats(response.data))
			.catch((error: AxiosError<ErrorResponse>) => props.getErrors(error))
			.finally(() => setLoading(false))
	}, [])

	const show = (value: string | number) => (loading ? "..." : value)

	// The API may send totals formatted ("1,000.00"), so parse before adding.
	const toNumber = (value: number | string | null | undefined): number =>
		Number(String(value ?? 0).replace(/,/g, "")) || 0

	const netBalance =
		toNumber(stats.invoices.total) +
		toNumber(stats.payments.total) -
		toNumber(stats.creditNotes.total) -
		toNumber(stats.deductions.total)

	return (
		<>
			<Head title="Dashboard" />

			<div className="flex flex-1 flex-col gap-4">
				{/* Page Header Section Start */}
				<PageHeader
					title="Welcome Back!"
					description="Here's an overview of your business metrics"
				/>
				{/* Page Header Section End */}

				{/* Counts Section Start */}
				<div className="grid gap-3 md:grid-cols-2">
					<StatCard
						label="Clients"
						value={show(stats.clients.count)}
						icon={Users}
					/>
					<StatCard
						label="Invoices"
						value={show(stats.invoices.count)}
						icon={FileText}
					/>
				</div>
				{/* Counts Section End */}

				{/* Totals Section Start */}
				<div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
					<StatCard
						label="Invoiced"
						value={`KES ${show(formatCurrency(stats.invoices.total))}`}
						icon={FileText}
					/>
					<StatCard
						label={`Payments (${show(stats.payments.count)})`}
						value={`KES ${show(formatCurrency(stats.payments.total))}`}
						icon={CreditCard}
						valueClassName="text-emerald-600 dark:text-emerald-400"
					/>
					<StatCard
						label={`Credit Notes (${show(stats.creditNotes.count)})`}
						value={`KES ${show(formatCurrency(stats.creditNotes.total))}`}
						icon={FilePlus}
						valueClassName="text-amber-600 dark:text-amber-400"
					/>
					<StatCard
						label={`Deductions (${show(stats.deductions.count)})`}
						value={`KES ${show(formatCurrency(stats.deductions.total))}`}
						icon={FileMinus}
						valueClassName="text-rose-600 dark:text-rose-400"
					/>
				</div>
				{/* Totals Section End */}

				{/* Net Balance Section Start */}
				<StatCard
					label="Net Balance"
					value={`KES ${show(formatCurrency(netBalance))}`}
					icon={Wallet}
				/>
				{/* Net Balance Section End */}
			</div>
		</>
	)
}
