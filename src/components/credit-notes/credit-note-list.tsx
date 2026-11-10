import { useState } from "react"
import type { Dispatch, SetStateAction } from "react"
import type { RowSelectionState } from "@tanstack/react-table"
import type { AxiosError } from "axios"
import { FilePlus, Wallet } from "lucide-react"
import { StatCard } from "@/components/stat-card"
import { DataTable } from "@/components/ui/data-table"
import { Input } from "@/components/ui/input"
import { SelectField, SelectItem } from "@/components/ui/select"
import { useApp } from "@/contexts/AppContext"
import Axios from "@/lib/axios"
import { laravelPagination } from "@/lib/laravel-pagination"
import { toast } from "@/lib/toast"
import type { CreditNote, PaginatedResponse } from "@/types"
import type { ErrorResponse } from "@/types/app-context"

export type CreditNoteListData = PaginatedResponse<CreditNote> & {
	sum?: string
}

export type ClientOption = {
	id: number
	name: string
}

// Radix selects can't hold an empty value, so "any" stands in for no filter.
const ANY = "any"

const toFilter = (value: string): string => (value === ANY ? "" : value)

type Props = {
	creditNotes: CreditNoteListData
	setCreditNotes: Dispatch<SetStateAction<CreditNoteListData>>
	clients: ClientOption[]
	number: string
	setNumber: (value: string) => void
	clientId: string
	setClientId: (value: string) => void
	startMonth: string
	setStartMonth: (value: string) => void
	startYear: string
	setStartYear: (value: string) => void
	endMonth: string
	setEndMonth: (value: string) => void
	endYear: string
	setEndYear: (value: string) => void
}

export default function CreditNoteList(props: Props) {
	const app = useApp()
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

	const onDeleteCreditNote = (creditNoteId: string | number | (string | number)[]) => {
		const creditNoteIds = Array.isArray(creditNoteId)
			? creditNoteId.join(",")
			: creditNoteId
		const deletedIds = (Array.isArray(creditNoteId) ? creditNoteId : [creditNoteId]).map(String)

		Axios.delete(`/api/credit-notes/${creditNoteIds}`)
			.then((response) => {
				toast.success(response.data.message)
				// Remove the deleted rows
				props.setCreditNotes((current) => ({
					...current,
					data: current.data.filter(
						(creditNote) => !deletedIds.includes(String(creditNote.id))
					),
				}))
			})
			.catch((error: AxiosError<ErrorResponse>) => app.getErrors(error))
			.finally(() => setRowSelection({}))
	}

	const monthItems = app.months.map((month, key) => (
		<SelectItem
			key={key}
			value={key === 0 ? ANY : String(key)}>
			{key === 0 ? "Any" : month}
		</SelectItem>
	))

	const yearItems = [
		<SelectItem
			key={ANY}
			value={ANY}>
			Any
		</SelectItem>,
		...app.years.map((year) => (
			<SelectItem
				key={year}
				value={String(year)}>
				{year}
			</SelectItem>
		)),
	]

	return (
		<div className="flex flex-col gap-2">
			{/* Totals Section Start */}
			<div className="grid gap-2 sm:grid-cols-2">
				<StatCard
					label="Count"
					value={props.creditNotes.meta?.total ?? 0}
					icon={FilePlus}
				/>
				<StatCard
					label="Total"
					value={
						<>
							<small>KES</small> {props.creditNotes.sum ?? 0}
						</>
					}
					icon={Wallet}
				/>
			</div>
			{/* Totals Section End */}

			{/* Filters Section Start */}
			<div className="rounded-2xl border bg-card p-4 shadow-xs">
				<div className="flex flex-wrap gap-2">
					{/* Number Start */}
					<div className="min-w-0 grow">
						<Input
							type="text"
							label="Number"
							value={props.number}
							onChange={(event) => props.setNumber(event.target.value)}
						/>
					</div>
					{/* Number End */}

					{/* Client Start */}
					<div className="min-w-0 grow">
						<SelectField
							label="Client"
							name="client"
							value={props.clientId || ANY}
							onValueChange={(value) => props.setClientId(toFilter(value))}>
							<SelectItem value={ANY}>Any</SelectItem>
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

					<div className="flex grow gap-2">
						{/* Start Month Start */}
						<div className="grow">
							<SelectField
								label="Start At"
								value={props.startMonth || ANY}
								onValueChange={(value) => props.setStartMonth(toFilter(value))}>
								{monthItems}
							</SelectField>
						</div>
						{/* Start Month End */}

						{/* Start Year Start */}
						<div className="grow">
							<SelectField
								label="Year"
								value={props.startYear || ANY}
								onValueChange={(value) => props.setStartYear(toFilter(value))}>
								{yearItems}
							</SelectField>
						</div>
						{/* Start Year End */}
					</div>

					<div className="flex grow gap-2">
						{/* End Month Start */}
						<div className="grow">
							<SelectField
								label="End At"
								value={props.endMonth || ANY}
								onValueChange={(value) => props.setEndMonth(toFilter(value))}>
								{monthItems}
							</SelectField>
						</div>
						{/* End Month End */}

						{/* End Year Start */}
						<div className="grow">
							<SelectField
								label="Year"
								value={props.endYear || ANY}
								onValueChange={(value) => props.setEndYear(toFilter(value))}>
								{yearItems}
							</SelectField>
						</div>
						{/* End Year End */}
					</div>
				</div>
			</div>
			{/* Filters Section End */}

			{/* Credit Notes Table Section Start */}
			<div className="rounded-2xl border bg-card p-4 shadow-xs">
				<DataTable
					columns={[
						{
							id: "index",
							header: "#",
							cell: ({ row }) => (
								<div className="whitespace-nowrap">
									{app.iterator(row.index, props.creditNotes)}
								</div>
							),
						},
						{
							accessorKey: "number",
							header: "Number",
							cell: ({ row }) => (
								<div className="whitespace-nowrap">{row.original.number}</div>
							),
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
								<div className="whitespace-nowrap text-green-600">
									<small>KES</small> {row.original.amount}
								</div>
							),
						},
						{
							accessorKey: "issueDate",
							header: "Issue Date",
						},
					]}
					data={props.creditNotes.data ?? []}
					emptyMessage={
						app.loadingItems > 0 ? "Loading…" : "No credit notes yet"
					}
					showHref={(creditNote) => `/credit-notes/${creditNote.id}/view`}
					editHref={(creditNote) => `/credit-notes/${creditNote.id}/edit`}
					onDelete={(creditNote) => onDeleteCreditNote(creditNote.id)}
					onBulkDelete={(ids) => onDeleteCreditNote(ids)}
					getItemLabel={(creditNote) => `Credit Note ${creditNote.number}`}
					pagination={laravelPagination(
						props.creditNotes,
						(endpoint) => app.getPaginated(endpoint, props.setCreditNotes),
						props.setCreditNotes
					)}
					rowSelection={rowSelection}
					setRowSelection={setRowSelection}
				/>
			</div>
			{/* Credit Notes Table Section End */}
		</div>
	)
}
