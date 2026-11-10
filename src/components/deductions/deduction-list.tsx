"use client"

import type { AxiosError } from "axios"
import type { ColumnDef, RowSelectionState } from "@tanstack/react-table"
import type { Dispatch, SetStateAction } from "react"
import { useState } from "react"
import { Banknote, FileMinus, Plus } from "lucide-react"
import { StatCard } from "@/components/stat-card"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Input } from "@/components/ui/input"
import { Link } from "@/components/ui/link"
import { SelectField, SelectItem } from "@/components/ui/select"
import { useApp } from "@/contexts/AppContext"
import { useFabPosition } from "@/hooks/use-fab-position"
import Axios from "@/lib/axios"
import { laravelPagination } from "@/lib/laravel-pagination"
import { toast } from "@/lib/toast"
import type { ErrorResponse } from "@/types/app-context"
import type { Client, Deduction, PaginatedResponse } from "@/types"

export type DeductionsList = PaginatedResponse<Deduction> & { sum?: string }

// Radix Select can't hold an empty value, so "no filter" is stored as "".
const ALL = "all"

const STATUSES = [
	{ id: "not_paid", name: "Not Paid" },
	{ id: "partially_paid", name: "Partially Paid" },
	{ id: "paid", name: "Paid" },
	{ id: "overpaid", name: "Overpaid" },
]

type Props = {
	deductions: DeductionsList
	setDeductions: Dispatch<SetStateAction<DeductionsList>>
	clients: Pick<Client, "id" | "name">[]
	number: string
	setNumber: (value: string) => void
	clientId: string
	setClientId: (value: string) => void
	status: string
	setStatus: (value: string) => void
	startMonth: string
	setStartMonth: (value: string) => void
	startYear: string
	setStartYear: (value: string) => void
	endMonth: string
	setEndMonth: (value: string) => void
	endYear: string
	setEndYear: (value: string) => void
}

const fromSelect = (value: string): string => (value === ALL ? "" : value)
const toSelect = (value: string): string => value || ALL

export default function DeductionList(props: Props) {
	const app = useApp()
	const fabPosition = useFabPosition()
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

	const onDeleteDeduction = (deductionId: Deduction["id"] | (string | number)[]) => {
		const deductionIds = Array.isArray(deductionId)
			? deductionId.join(",")
			: deductionId

		Axios.delete(`/api/deductions/${deductionIds}`)
			.then((response) => {
				toast.success(response.data.message)
				// Remove the deleted rows
				props.setDeductions((current) => ({
					...current,
					data: current.data.filter((deduction) =>
						Array.isArray(deductionId)
							? !deductionId.map(String).includes(String(deduction.id))
							: deduction.id != deductionId
					),
				}))
				setRowSelection({})
			})
			.catch((error: AxiosError<ErrorResponse>) => {
				app.getErrors(error)
				setRowSelection({})
			})
	}

	const columns: ColumnDef<Deduction, unknown>[] = [
		{
			accessorKey: "",
			header: "#",
			cell: ({ row }) => (
				<div className="whitespace-nowrap">
					{props.deductions.meta && app.iterator(row.index, props.deductions)}
				</div>
			),
		},
		{
			accessorKey: "number",
			header: "Number",
			cell: ({ row }) => (
				<div className="whitespace-nowrap">{row.getValue("number")}</div>
			),
		},
		{
			accessorKey: "clientName",
			header: "Client",
		},
		{
			accessorKey: "invoiceNumber",
			header: "Invoice",
		},
		{
			accessorKey: "amount",
			header: "Amount",
			cell: ({ row }) => (
				<div className="whitespace-nowrap text-green-600">
					<small>KES</small> {row.getValue("amount")}
				</div>
			),
		},
		{
			accessorKey: "issueDate",
			header: "Issue Date",
		},
	]

	return (
		<>
			{/* Floating Section Start */}
			<div {...fabPosition}>
				<Button
					asChild
					className="h-14 min-w-14 rounded-full px-4 shadow-lg sm:px-6">
					<Link
						href="/deductions/create"
						variant="unstyled"
						aria-label="Create deduction"
						title="Create deduction">
						<Plus
							className="size-8"
							strokeWidth={1.3}
						/>
						<span className="hidden sm:inline">Create deduction</span>
					</Link>
				</Button>
			</div>
			{/* Floating Section End */}

			{/* Summary Cards Start */}
			<div className="grid gap-3 sm:grid-cols-2">
				<StatCard
					label="Count"
					value={props.deductions.meta?.total ?? 0}
					icon={FileMinus}
				/>
				<StatCard
					label="Total"
					value={
						<>
							<small>KES</small> {props.deductions.sum ?? "0.00"}
						</>
					}
					icon={Banknote}
				/>
			</div>
			{/* Summary Cards End */}

			{/* Filters Section Start */}
			<div className="rounded-2xl border bg-card px-4 py-4 shadow-xs">
				<div className="flex flex-wrap gap-2">
					{/* Number Start */}
					<div className="min-w-0 grow">
						<Input
							type="text"
							label="Number"
							value={props.number}
							onChange={(e) => props.setNumber(e.target.value)}
						/>
					</div>
					{/* Number End */}

					{/* Client Start */}
					<div className="min-w-0 grow">
						<SelectField
							label="Client"
							name="client"
							value={toSelect(props.clientId)}
							onValueChange={(value) => props.setClientId(fromSelect(value))}>
							<SelectItem value={ALL}>All clients</SelectItem>
							{props.clients.map((client) => (
								<SelectItem
									key={client.id}
									value={String(client.id)}>
									{client.name}
								</SelectItem>
							))}
						</SelectField>
					</div>
					{/* Client End */}

					{/* Status Start */}
					<div className="min-w-0 grow">
						<SelectField
							label="Status"
							name="status"
							value={toSelect(props.status)}
							onValueChange={(value) => props.setStatus(fromSelect(value))}>
							<SelectItem value={ALL}>All statuses</SelectItem>
							{STATUSES.map((status) => (
								<SelectItem
									key={status.id}
									value={status.id}>
									{status.name}
								</SelectItem>
							))}
						</SelectField>
					</div>
					{/* Status End */}

					<div className="flex grow gap-2">
						{/* Start Month Start */}
						<div className="grow">
							<SelectField
								label="Start At"
								value={toSelect(props.startMonth)}
								onValueChange={(value) => props.setStartMonth(fromSelect(value))}>
								<SelectItem value={ALL}>Any month</SelectItem>
								{app.months.slice(1).map((month, key) => (
									<SelectItem
										key={month}
										value={String(key + 1)}>
										{month}
									</SelectItem>
								))}
							</SelectField>
						</div>
						{/* Start Month End */}

						{/* Start Year Start */}
						<div className="grow">
							<SelectField
								label="Year"
								value={toSelect(props.startYear)}
								onValueChange={(value) => props.setStartYear(fromSelect(value))}>
								<SelectItem value={ALL}>Any year</SelectItem>
								{app.years.map((year) => (
									<SelectItem
										key={year}
										value={String(year)}>
										{year}
									</SelectItem>
								))}
							</SelectField>
						</div>
						{/* Start Year End */}
					</div>

					<div className="flex grow gap-2">
						{/* End Month Start */}
						<div className="grow">
							<SelectField
								label="End At"
								value={toSelect(props.endMonth)}
								onValueChange={(value) => props.setEndMonth(fromSelect(value))}>
								<SelectItem value={ALL}>Any month</SelectItem>
								{app.months.slice(1).map((month, key) => (
									<SelectItem
										key={month}
										value={String(key + 1)}>
										{month}
									</SelectItem>
								))}
							</SelectField>
						</div>
						{/* End Month End */}

						{/* End Year Start */}
						<div className="grow">
							<SelectField
								label="Year"
								value={toSelect(props.endYear)}
								onValueChange={(value) => props.setEndYear(fromSelect(value))}>
								<SelectItem value={ALL}>Any year</SelectItem>
								{app.years.map((year) => (
									<SelectItem
										key={year}
										value={String(year)}>
										{year}
									</SelectItem>
								))}
							</SelectField>
						</div>
						{/* End Year End */}
					</div>
				</div>
			</div>
			{/* Filters Section End */}

			{/* Deductions Table Section Start */}
			<div className="rounded-2xl border bg-card p-4 shadow-xs">
				<DataTable
					columns={columns}
					data={props.deductions.data ?? []}
					emptyMessage={app.loadingItems > 0 ? "Loading…" : "No deductions yet"}
					showHref={(deduction) => `/deductions/${deduction.id}/view`}
					editHref={(deduction) => `/deductions/${deduction.id}/edit`}
					onDelete={(deduction) => onDeleteDeduction(deduction.id)}
					onBulkDelete={(ids) => onDeleteDeduction(ids)}
					getItemLabel={(deduction) => `Deduction ${deduction.number}`}
					pagination={laravelPagination(
						props.deductions,
						(endpoint) => app.getPaginated(endpoint, props.setDeductions),
						props.setDeductions
					)}
					rowSelection={rowSelection}
					setRowSelection={setRowSelection}
				/>
			</div>
			{/* Deductions Table Section End */}
		</>
	)
}
