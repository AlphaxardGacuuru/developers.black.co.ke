"use client"

import type { RowSelectionState } from "@tanstack/react-table"
import { isAxiosError } from "axios"
import { Plus, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { PageHeader } from "@/components/page-header"
import { StatCard } from "@/components/stat-card"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Input } from "@/components/ui/input"
import { Link } from "@/components/ui/link"
import { useApp } from "@/contexts/AppContext"
import { useFabPosition } from "@/hooks/use-fab-position"
import Axios from "@/lib/axios"
import { laravelPagination } from "@/lib/laravel-pagination"
import { Head, useLayout } from "@/lib/spa"
import { toast } from "@/lib/toast"
import type { Client, PaginatedResponse } from "@/types"

type ClientList = Partial<PaginatedResponse<Client>>

export default function ClientsIndex() {
	const props = useApp()
	const fabPosition = useFabPosition()

	useLayout({ breadcrumbs: [{ title: "Clients", href: "/clients" }] })

	const [clients, setClients] = useState<ClientList>(() =>
		props.getLocalStorage<ClientList>("clients", {})
	)
	const [name, setName] = useState("")
	const [email, setEmail] = useState("")
	const [phone, setPhone] = useState("")
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

	useEffect(() => {
		props.getPaginated(
			`users?type=client&name=${name}&email=${email}&phone=${phone}`,
			setClients,
			"clients"
		)
	}, [name, email, phone])

	const onDeleteClient = (clientId: Client["id"] | (string | number)[]): void => {
		const clientIds = Array.isArray(clientId) ? clientId.join(",") : clientId
		const deletedIds = (Array.isArray(clientId) ? clientId : [clientId]).map(String)

		Axios.delete(`/api/clients/${clientIds}`)
			.then((response) => {
				toast.success(response.data.message)
				setClients((current) => ({
					...current,
					data: current.data?.filter(
						(client) => !deletedIds.includes(String(client.id))
					),
				}))
			})
			.catch((error: unknown) => {
				if (isAxiosError(error)) {
					props.getErrors(error)
				}
			})
			.finally(() => setRowSelection({}))
	}

	return (
		<>
			<Head title="Clients" />

			{/* Floating Section Start */}
			<div {...fabPosition}>
				<Button
					asChild
					className="h-14 min-w-14 rounded-full px-4 shadow-lg sm:px-6">
					<Link
						href="/clients/create"
						variant="unstyled"
						aria-label="Create client"
						title="Create client">
						<Plus
							className="size-8"
							strokeWidth={1.3}
						/>
						<span className="hidden sm:inline">Create client</span>
					</Link>
				</Button>
			</div>
			{/* Floating Section End */}

			{/* Bottom padding keeps the last row clear of the floating button. */}
			<div className="flex flex-1 flex-col gap-2 pb-32 md:pb-24">
				{/* Page Header Section Start */}
				<PageHeader
					title="Clients"
					description="The people and companies you invoice."
				/>
				{/* Page Header Section End */}

				{/* Summary Cards Section Start */}
				<div className="grid gap-2 sm:grid-cols-3">
					<StatCard
						label="Total Clients"
						value={clients.meta?.total ?? 0}
						icon={Users}
					/>
				</div>
				{/* Summary Cards Section End */}

				{/* Filters Section Start */}
				<div className="grid gap-2 rounded-2xl border bg-card p-4 shadow-xs sm:grid-cols-3">
					{/* Name Start */}
					<Input
						type="text"
						label="Name"
						onChange={(event) => setName(event.target.value)}
					/>
					{/* Name End */}

					{/* Email Start */}
					<Input
						type="text"
						label="Email"
						onChange={(event) => setEmail(event.target.value)}
					/>
					{/* Email End */}

					{/* Phone Start */}
					<Input
						type="text"
						label="Phone"
						onChange={(event) => setPhone(event.target.value)}
					/>
					{/* Phone End */}
				</div>
				{/* Filters Section End */}

				{/* Clients Table Section Start */}
				<div className="rounded-2xl border bg-card p-4 shadow-xs">
					<DataTable<Client, unknown>
						columns={[
							{
								accessorKey: "",
								header: "#",
								cell: ({ row }) => (
									<div className="whitespace-nowrap">
										{clients.meta
											? props.iterator(row.index, { meta: clients.meta })
											: row.index + 1}
									</div>
								),
							},
							{
								accessorKey: "name",
								header: "Name",
								cell: ({ row }) => (
									<Link
										href={`/clients/${row.original.id}/view`}
										variant="text"
										size="none">
										{row.original.name}
									</Link>
								),
							},
							{
								accessorKey: "email",
								header: "Email",
							},
							{
								accessorKey: "phone",
								header: "Phone",
							},
						]}
						data={clients.data ?? []}
						emptyMessage={props.loadingItems > 0 ? "Loading…" : "No clients yet"}
						showHref={(client) => `/clients/${client.id}/view`}
						editHref={(client) => `/clients/${client.id}/edit`}
						onDelete={(client) => onDeleteClient(client.id)}
						onBulkDelete={(ids) => onDeleteClient(ids)}
						getItemLabel={(client) => client.name}
						pagination={laravelPagination(
							clients,
							(endpoint, setList) =>
								props.getPaginated<ClientList>(endpoint, (list) =>
									setList(list as ClientList)
								),
							setClients
						)}
						rowSelection={rowSelection}
						setRowSelection={setRowSelection}
					/>
				</div>
				{/* Clients Table Section End */}
			</div>
		</>
	)
}
