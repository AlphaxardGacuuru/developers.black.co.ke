import React, { useState, useRef } from "react"
import Axios from "@/lib/axios"

import Btn from "@/components/ui/button"
import MyLink from "@/components/ui/my-link"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { DataTable } from "@/components/ui/data-table"
import { laravelPagination } from "@/lib/laravel-pagination"

import HeroHeading from "@/components/core/HeroHeading"
import HeroIcon from "@/components/core/HeroIcon"

import PlusSVG from "@/svgs/PlusSVG"
import MoneySVG from "@/svgs/MoneySVG"
import DeductionSVG from "@/svgs/DeductionSVG"

const DeductionList = (props) => {
	const [loading, setLoading] = useState()
	const [rowSelection, setRowSelection] = useState({})

	/*
	 * Delete Deduction
	 */
	const onDeleteDeduction = (deductionId) => {
		setLoading(true)
		var deductionIds = Array.isArray(deductionId)
			? deductionId.join(",")
			: deductionId

		Axios.delete(`/api/deductions/${deductionIds}`)
			.then((res) => {
				setLoading(false)
				props.setMessages([res.data.message])
				// Remove row
				props.setDeductions({
					sum: props.deductions.sum,
					meta: props.deductions.meta,
					links: props.deductions.links,
					data: props.deductions.data.filter((deduction) => {
						if (Array.isArray(deductionId)) {
							return !deductionId.map(String).includes(String(deduction.id))
						} else {
							return deduction.id != deductionId
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
			<div className="bg-foreground/10 backdrop-blur-xl border border-border shadow-xs rounded-3xl mb-2 p-2 px-5 hover:bg-foreground/15 transition-all duration-500 grid grid-cols-1 sm:grid-cols-2 gap-4">
				{/* Count */}
				<div className="flex justify-between grow mx-2">
					<HeroHeading
						heading="Count"
						data={
							<span>
								<small>KES</small> {props.deductions.meta?.total}
							</span>
						}
					/>
					<HeroIcon>
						<DeductionSVG />
					</HeroIcon>
				</div>
				{/* Count End */}
				{/* Total */}
				<div className="flex justify-between grow mx-2">
					<HeroHeading
						heading="Total"
						data={
							<span>
								<small>KES</small> {props.deductions.sum}
							</span>
						}
					/>
					<HeroIcon>
						<MoneySVG />
					</HeroIcon>
				</div>
				{/* Total End */}
			</div>
			{/* Data End */}

			<br />

			{/* Filters */}
			<div className="bg-foreground/10 backdrop-blur-xl border border-border shadow-xs rounded-3xl px-4 pt-4 pb-3 mb-2 hover:bg-foreground/15 transition-all duration-500">
				<div className="flex flex-wrap gap-2">
					{/* Number */}
					<div className="grow min-w-0">
						<Input
							type="text"
							label="Number"
							placeholder="Search by Number"
							value={props.number}
							onChange={(e) => props.setNumber(e.target.value)}
						/>
					</div>
					{/* Number End */}
					{/* Client */}
					<div className="grow min-w-0">
						<Select
							label="Client"
							placeholder=""
							name="client"
							value={props.clientId}
							onChange={(e) => props.setClientId(e.target.value)}
							required>
							<option value=""></option>
							{props.clients.map((client, key) => (
								<option
									key={key}
									value={client.id}>
									{client.name}
								</option>
							))}
						</Select>
					</div>
					{/* Client End */}
					{/* Status */}
					<div className="grow min-w-0">
						<Select
							label="Status"
							placeholder=""
							name="status"
							value={props.status}
							onChange={(e) => props.setStatus(e.target.value)}
							required>
							{[
								{ id: "", name: "" },
								{ id: "not_paid", name: "Not Paid" },
								{ id: "partially_paid", name: "Partially Paid" },
								{ id: "paid", name: "Paid" },
								{ id: "overpaid", name: "Overpaid" },
							].map((client, key) => (
								<option
									key={key}
									value={client.id}>
									{client.name}
								</option>
							))}
						</Select>
					</div>
					{/* Status End */}

					{/* Start Date */}
					<div className="flex grow gap-2">
						<div className="grow">
							{/* Start Month */}
							<Select
								label="Start At"
								value={props.startMonth}
								// placeholder="Select Month"
								onChange={(e) => props.setStartMonth(e.target.value)}
								options={props.months}>
								{props.months.map((month, key) => (
									<option
										key={key}
										value={key}>
										{key == 0 ? "" : month}
									</option>
								))}
							</Select>
						</div>
						{/* Start Month End */}
						{/* Start Year */}
						<div className="grow">
							<Select
								label="Year"
								value={props.startYear}
								onChange={(e) => props.setStartYear(e.target.value)}>
								<option value=""></option>
								{props.years.map((year, key) => (
									<option
										key={key}
										value={year}>
										{year}
									</option>
								))}
							</Select>
						</div>
						{/* Start Year End */}
					</div>
					{/* Start Date End */}
					{/* End Date */}
					<div className="flex grow gap-2">
						{/* End Month */}
						<div className="grow">
							<Select
								label="End At"
								value={props.endMonth}
								onChange={(e) => props.setEndMonth(e.target.value)}>
								{props.months.map((month, key) => (
									<option
										key={key}
										value={key}>
										{key == 0 ? "" : month}
									</option>
								))}
							</Select>
						</div>
						{/* End Month End */}
						{/* End Year */}
						<div className="grow">
							<Select
								label="Year"
								value={props.endYear}
								onChange={(e) => props.setEndYear(e.target.value)}>
								<option value=""></option>
								{props.years.map((year, key) => (
									<option
										key={key}
										value={year}>
										{year}
									</option>
								))}
							</Select>
						</div>
						{/* End Year End */}
					</div>
					{/* End Date End */}
				</div>
			</div>
			{/* Filters End */}

			<br />

			{/* Data */}
			<div className="bg-foreground/10 backdrop-blur-xl border border-border rounded-3xl p-4 mb-5">
				{/* Create Deduction Link Start */}
				<div className="flex justify-end gap-2">
					<MyLink
						href={`/deductions/create`}
						icon={<PlusSVG />}
						text="create deduction"
					/>
				</div>
				{/* Create Deduction Link End */}

				{/* DataTable Start */}
				<DataTable
					columns={[
						{
							accessorKey: "",
							header: "#",
							cell: ({ row }) => (
								<div className="whitespace-nowrap">
									{props.iterator(row.index, props.deductions)}
								</div>
							),
						},
						{
							accessorKey: "number",
							header: "Number",
							cell: ({ row }) => (
								<div className="whitespace-nowrap">
									{row.getValue("number")}
								</div>
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
								<div className="text-green-600 whitespace-nowrap">
									<small>KES</small> {row.getValue("amount")}
								</div>
							),
						},
						{
							accessorKey: "issueDate",
							header: "Issue Date",
						},
					]}
					data={props.deductions.data || []}
					emptyMessage={
						props.loadingItems > 0 ? "Loading…" : "No deductions yet"
					}
					showHref={(deduction) => `/deductions/${deduction.id}/view`}
					editHref={(deduction) => `/deductions/${deduction.id}/edit`}
					onDelete={(deduction) => onDeleteDeduction(deduction.id)}
					onBulkDelete={(ids) => onDeleteDeduction(ids)}
					getItemLabel={(deduction) => `Deduction ${deduction.number}`}
					pagination={laravelPagination(
						props.deductions,
						props.getPaginated,
						props.setDeductions
					)}
					rowSelection={rowSelection}
					setRowSelection={setRowSelection}
				/>
			</div>
			{/* DataTable End */}
		</div>
	)
}

export default DeductionList
