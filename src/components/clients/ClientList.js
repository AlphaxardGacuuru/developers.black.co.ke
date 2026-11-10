import React, { useState } from "react"
import Axios from "@/lib/axios"

import Btn from "@/components/legacy/button"
import MyLink from "@/components/legacy/my-link"
import { Input } from "@/components/legacy/input"
import { DataTable } from "@/components/ui/data-table"
import { laravelPagination } from "@/lib/laravel-pagination"

import HeroHeading from "@/components/core/HeroHeading"
import HeroIcon from "@/components/core/HeroIcon"

import PlusSVG from "@/svgs/PlusSVG"
import PeopleSVG from "@/svgs/PeopleSVG"

const ClientList = (props) => {
	const [loading, setLoading] = useState(false)
	const [rowSelection, setRowSelection] = useState({})

	/*
	 * Delete Client
	 */
	const onDeleteClient = (clientId) => {
		setLoading(true)
		var clientIds = Array.isArray(clientId) ? clientId.join(",") : clientId

		Axios.delete(`/api/clients/${clientIds}`)
			.then((res) => {
				setLoading(false)
				props.setMessages([res.data.message])
				// Remove row
				props.setClients({
					meta: props.clients.meta,
					links: props.clients.links,
					data: props.clients.data.filter((client) => {
						if (Array.isArray(clientId)) {
							return !clientId.map(String).includes(String(client.id))
						} else {
							return client.id != clientId
						}
					}),
				})
				setRowSelection({})
			})
			.catch((err) => {
				setLoading(false)
				props.getErrors(err)
				setRowSelection({})
			})
	}

	return (
		<div className={props.activeTab}>
			{/* Data */}
			<div className="bg-foreground/10 backdrop-blur-xl border border-border shadow-xs rounded-3xl mb-2 p-2 px-5 hover:bg-foreground/15 transition-all duration-500">
				{/* Total */}
				<div className="grid grid-cols-1 gap-4">
					{/* Total */}
					<div>
						<div className="flex justify-between grow mx-2">
							<HeroHeading
								heading="Total Clients"
								data={props.clients.meta?.total || 0}
							/>
							<HeroIcon>
								<PeopleSVG />
							</HeroIcon>
						</div>
					</div>
					{/* Total End */}
				</div>
				{/* Total End */}
			</div>
			{/* Data End */}

			<br />

			{/* Filters */}
			<div className="bg-foreground/10 backdrop-blur-xl border border-border shadow-xs rounded-3xl px-4 pt-4 pb-3 mb-2 hover:bg-foreground/15 transition-all duration-500">
				<div className="flex flex-wrap gap-2">
					{/* Name */}
					<div className="grow min-w-0">
						<Input
							type="text"
							label="Name"
							placeholder="Search by name"
							// value={props.name}
							onChange={(e) => props.setName(e.target.value)}
						/>
					</div>
					{/* Name End */}

					{/* Email */}
					<div className="grow min-w-0">
						<Input
							type="text"
							label="Email"
							placeholder="Search by email"
							// value={props.email}
							onChange={(e) => props.setEmail(e.target.value)}
						/>
					</div>
					{/* Email End */}

					{/* Phone */}
					<div className="grow min-w-0">
						<Input
							type="text"
							label="Phone"
							placeholder="Search by phone"
							// value={props.phone}
							onChange={(e) => props.setPhone(e.target.value)}
						/>
					</div>
					{/* Phone End */}
				</div>
			</div>
			{/* Filters End */}

			<br />

			{/* Data */}
			<div className="bg-foreground/10 backdrop-blur-xl border border-border rounded-3xl p-4 mb-5">
				{/* Create Client Link Start */}
				<div className="flex justify-end gap-2">
					<MyLink
						href={`/clients/create`}
						icon={<PlusSVG />}
						text="create client"
					/>
				</div>
				{/* Create Client Link End */}

				{/* DataTable Start */}
				<DataTable
					columns={[
						{
							accessorKey: "",
							header: "#",
							cell: ({ row }) => (
								<div className="whitespace-nowrap">
									{props.iterator(row.index, props.clients)}
								</div>
							),
						},
						{
							accessorKey: "name",
							header: "Name",
							cell: ({ row }) => (
								<MyLink
									href={`/clients/${row.original.id}/view`}
									text={row.getValue("name")}
								/>
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
					data={props.clients.data || []}
					emptyMessage={props.loadingItems > 0 ? "Loading…" : "No clients yet"}
					showHref={(client) => `/clients/${client.id}/view`}
					editHref={(client) => `/clients/${client.id}/edit`}
					onDelete={(client) => onDeleteClient(client.id)}
					onBulkDelete={(ids) => onDeleteClient(ids)}
					getItemLabel={(client) => client.name}
					pagination={laravelPagination(
						props.clients,
						props.getPaginated,
						props.setClients
					)}
					rowSelection={rowSelection}
					setRowSelection={setRowSelection}
				/>
			</div>
			{/* DataTable End */}
		</div>
	)
}

export default ClientList
