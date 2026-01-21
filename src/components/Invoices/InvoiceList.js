import React, { useState, useRef, useEffect } from "react"
import Axios from "@/lib/axios"

import Btn from "@/components/ui/button"
import MyLink from "@/components/ui/my-link"
import DeleteModal from "@/components/core/DeleteModal"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { DataTable } from "@/components/Invoices/DataTable"
import Modal from "@/components/ui/modal"

import PaginationLinks from "@/components/core/PaginationLinks"

import HeroHeading from "@/components/core/HeroHeading"
import HeroIcon from "@/components/core/HeroIcon"
import NoData from "@/components/core/NoData"

import ViewSVG from "@/svgs/ViewSVG"
import EditSVG from "@/svgs/EditSVG"
import DeleteSVG from "@/svgs/DeleteSVG"
import PlusSVG from "@/svgs/PlusSVG"
import InvoiceSVG from "@/svgs/InvoiceSVG"
import PaymentSVG from "@/svgs/PaymentSVG"
import BalanceSVG from "@/svgs/BalanceSVG"
import EmailSentSVG from "@/svgs/EmailSentSVG"
import SendEmailSVG from "@/svgs/SendEmailSVG"
import SMSSVG from "@/svgs/SMSSVG"
import ChatSVG from "@/svgs/ChatSVG"
import ChatSendSVG from "@/svgs/ChatSendSVG"
import CloseSVG from "@/svgs/CloseSVG"
import MoneySVG from "@/svgs/MoneySVG"
import CoinSVG from "@/svgs/CoinSVG"

const InvoiceList = (props) => {
	const [deleteIds, setDeleteIds] = useState([])
	const [loading, setLoading] = useState()
	const [loadingSMS, setLoadingSMS] = useState()
	const [loadingEmail, setLoadingEmail] = useState()
	const [rowSelection, setRowSelection] = useState({})
	const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false)

	// Timer states
	const [emailCountdown, setEmailCountdown] = useState(0)
	const [smsCountdown, setSmsCountdown] = useState(0)
	const [canSendEmail, setCanSendEmail] = useState(true)
	const [canSendSms, setCanSendSms] = useState(true)

	const invoiceModalBtnClose = useRef()

	// Timer effects
	useEffect(() => {
		let timer

		if (emailCountdown > 0) {
			timer = setTimeout(() => {
				setEmailCountdown(emailCountdown - 1)
			}, 1000)
		} else if (emailCountdown === 0 && !canSendEmail) {
			setCanSendEmail(true)
		}

		return () => clearTimeout(timer)
	}, [emailCountdown, canSendEmail])

	useEffect(() => {
		let timer

		if (smsCountdown > 0) {
			timer = setTimeout(() => {
				setSmsCountdown(smsCountdown - 1)
			}, 1000)
		} else if (smsCountdown === 0 && !canSendSms) {
			setCanSendSms(true)
		}

		return () => clearTimeout(timer)
	}, [smsCountdown, canSendSms])

	const [invoiceToSend, setInvoiceToSend] = useState({})

	/*
	 * Send Email
	 */
	const onSendEmail = (invoiceId) => {
		if (!canSendEmail || loadingEmail) return

		setLoadingEmail(true)
		setCanSendEmail(false)
		setEmailCountdown(60) // 60 second cooldown

		Axios.post(`api/invoices/send-email/${invoiceId}`)
			.then((res) => {
				setLoadingEmail(false)
				props.setMessages([res.data.message])
				// Clode Modal
				invoiceModalBtnClose.current.click()
			})
			.catch((err) => {
				setLoadingEmail(false)
				props.getErrors(err)
				// Reset timer on error
				setCanSendEmail(true)
				setEmailCountdown(0)
			})
	}

	/*
	 * Send SMS
	 */
	const onSendSMS = (invoiceId) => {
		if (!canSendSms || loadingSMS) return

		setLoadingSMS(true)
		setCanSendSms(false)
		setSmsCountdown(60) // 60 second cooldown

		Axios.post(`api/invoices/send-sms/${invoiceId}`)
			.then((res) => {
				setLoadingSMS(false)
				props.setMessages([res.data.message])
				// Clode Modal
				invoiceModalBtnClose.current.click()
			})
			.catch((err) => {
				setLoadingSMS(false)
				props.getErrors(err)
				// Reset timer on error
				setCanSendSms(true)
				setSmsCountdown(0)
			})
	}

	/*
	 * Handle DeleteId checkboxes
	 */
	const handleSetDeleteIds = (invoiceId) => {
		var exists = deleteIds.includes(invoiceId)

		var newDeleteIds = exists
			? deleteIds.filter((item) => item != invoiceId)
			: [...deleteIds, invoiceId]

		setDeleteIds(newDeleteIds)
	}

	/*
	 * Delete Invoice
	 */
	const onDeleteInvoice = (invoiceId) => {
		setLoading(true)
		var invoiceIds = Array.isArray(invoiceId) ? invoiceId.join(",") : invoiceId

		Axios.delete(`/api/invoices/${invoiceIds}`)
			.then((res) => {
				setLoading(false)
				props.setMessages([res.data.message])
				// Remove row
				props.setInvoices({
					sum: props.invoices.sum,
					paid: props.invoices.paid,
					balance: props.invoices.balance,
					meta: props.invoices.meta,
					links: props.invoices.links,
					data: props.invoices.data.filter((invoice) => {
						if (Array.isArray(invoiceId)) {
							return !invoiceId.map(String).includes(String(invoice.id))
						} else {
							return invoice.id != invoiceId
						}
					}),
				})
				// Clear DeleteIds
				setDeleteIds([])
				setRowSelection({})
			})
			.catch((err) => {
				setLoading(false)
				props.getErrors(err)
				// Clear DeleteIds
				setDeleteIds([])
				setRowSelection({})
			})
	}

	return (
		<div className={props.activeTab}>
			{/* Bulk Delete Confirmation Modal Start */}
			<Modal
				open={showBulkDeleteDialog}
				onOpenChange={setShowBulkDeleteDialog}
				title="Delete Selected Invoices"
				className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-sm rounded-3xl text-white data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top"
				footer={
					<div className="flex justify-between w-full">
						<Btn
							type="button"
							text="Cancel"
							onClick={() => setShowBulkDeleteDialog(false)}
						/>
						<Btn
							icon={<DeleteSVG />}
							text="Delete"
							className="btn-2"
							onClick={() => {
								onDeleteInvoice(Object.keys(rowSelection))
								setShowBulkDeleteDialog(false)
							}}
							loading={loading}
						/>
					</div>
				}>
				<div className="text-white">
					Are you sure you want to delete {Object.keys(rowSelection).length}{" "}
					selected invoice{Object.keys(rowSelection).length > 1 ? "s" : ""}?
					This action cannot be undone.
				</div>
			</Modal>
			{/* Bulk Delete Confirmation Modal End */}

			{/* Confirm Invoice Modal End */}
			<div
				className="fixed inset-0 bg-black bg-opacity-50 hidden"
				id={`invoiceModal`}
				tabIndex="-1"
				aria-labelledby="invoiceModalLabel"
				aria-hidden="true">
				<div className="flex items-center justify-center min-h-screen p-4">
					<div className="bg-blue-600 max-w-md w-full">
						<div className="p-4 border-b-0">
							<h1
								id="invoiceModalLabel"
								className="text-white text-xl">
								Send Invoice {invoiceToSend.number}
							</h1>

							{/* Close Start */}
							<span
								type="button"
								className="text-white cursor-pointer"
								data-bs-dismiss="modal">
								<CloseSVG />
							</span>
							{/* Close End */}
						</div>
						<div className="p-4 text-left text-white border-0">
							Are you sure you want to send an Invoice to{" "}
							{invoiceToSend.tenantName}.
						</div>
						<div className="p-4 flex justify-between items-center border-0">
							<button
								ref={invoiceModalBtnClose}
								type="button"
								className="mysonar-btn btn-2"
								data-bs-dismiss="modal">
								Close
							</button>

							<div className="flex gap-2">
								<Btn
									icon={<SMSSVG />}
									text={
										smsCountdown > 0
											? `send sms in ${smsCountdown}s`
											: `send sms ${
													invoiceToSend.smsesSent
														? `${invoiceToSend.smsesSent}`
														: ""
												}`
									}
									className={`hidden ${
										invoiceToSend.smsesSent ? `btn-green` : `btn-2`
									} ${!canSendSms ? "opacity-50 cursor-not-allowed" : ""}`}
									onClick={() => onSendSMS(invoiceToSend.id)}
									loading={loadingSMS}
									disabled={!canSendSms || loadingSMS}
								/>

								<Btn
									icon={<SendEmailSVG />}
									text={
										emailCountdown > 0
											? `send email in ${emailCountdown}s`
											: `send email ${
													invoiceToSend.emailsSent
														? `(${invoiceToSend.emailsSent})`
														: ""
												}`
									}
									className={`${
										invoiceToSend.emailsSent ? `btn-green` : `btn-2`
									} ${!canSendEmail ? "opacity-50 cursor-not-allowed" : ""}`}
									onClick={() => onSendEmail(invoiceToSend.id)}
									loading={loadingEmail}
									disabled={!canSendEmail || loadingEmail}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* Confirm Invoice Modal End */}

			{/* Data */}
			<div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-sm rounded-3xl mb-2 p-2 hover:bg-white/15 transition-all duration-500">
				{/* Total */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
					{/* Total */}
					<div>
						<div className="flex justify-between flex-grow mx-2">
							<HeroHeading
								heading="Total"
								data={
									<span>
										<small>KES</small> {props.invoices.sum}
									</span>
								}
							/>
							<HeroIcon>
								<MoneySVG />
							</HeroIcon>
						</div>
					</div>
					{/* Total End */}
					{/* Balance */}
					<div>
						<div className="flex justify-between flex-grow mx-2">
							<HeroHeading
								heading="Balance"
								data={
									<span>
										<small>KES</small> {props.invoices.balance}
									</span>
								}
							/>
							<HeroIcon>
								<BalanceSVG />
							</HeroIcon>
						</div>
					</div>
					{/* Balance End */}
					{/* Paid */}
					<div>
						<div className="flex justify-between flex-grow mx-2">
							<HeroHeading
								heading="Paid"
								data={
									<span>
										<small>KES</small> {props.invoices.paid}
									</span>
								}
							/>
							<HeroIcon>
								<CoinSVG />
							</HeroIcon>
						</div>
					</div>
					{/* Paid End */}
				</div>
				{/* Total End */}
			</div>
			{/* Data End */}

			<br />

			{/* Filters */}
			<div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-sm rounded-3xl px-4 pt-4 pb-3 mb-2 hover:bg-white/15 transition-all duration-500">
				<div className="flex flex-wrap gap-2">
					{/* Code */}
					<div className="flex-grow min-w-0">
						<Input
							type="text"
							label="Code"
							placeholder="Search by Code"
							value={props.number}
							onChange={(e) => props.setNumber(e.target.value)}
						/>
					</div>
					{/* Code End */}
					{/* Tenant */}
					<div className="flex-grow min-w-0">
						<Input
							type="text"
							label="Tenant"
							placeholder="Search by Tenant"
							value={props.tenant}
							onChange={(e) => props.setTenant(e.target.value)}
						/>
					</div>
					{/* Tenant End */}
					{/* Unit */}
					<div className="flex-grow min-w-0">
						<Input
							type="text"
							label="Unit"
							placeholder="Search by Unit"
							value={props.unit}
							onChange={(e) => props.setUnit(e.target.value)}
						/>
					</div>
					{/* Unit End */}
					{/* Status */}
					<div className="flex-grow min-w-0">
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
				</div>
			</div>

			<div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-sm rounded-3xl py-2 px-4 hover:bg-white/15 transition-all duration-500">
				<div className="flex justify-end flex-wrap gap-2">
					<div className="flex flex-grow gap-2">
						{/* Start Date */}
						<div className="flex-grow">
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
						<div className="flex-grow">
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
					<div className="flex flex-grow gap-2">
						{/* End Month */}
						<div className="flex-grow">
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
						<div className="flex-grow">
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

			{/* DataTable */}
			<div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-4 mb-5">
				{/* Create Invoice Link Start */}
				<div className="flex justify-end gap-2">
					{Object.keys(rowSelection).length > 0 && (
						<Btn
							icon={<DeleteSVG />}
							text={`Delete Selected (${Object.keys(rowSelection).length})`}
							onClick={() => setShowBulkDeleteDialog(true)}
						/>
					)}
					<MyLink
						href={`/invoices/create`}
						icon={<PlusSVG />}
						text="create invoice"
					/>
				</div>
				{/* Create Invoice Link End */}

				<DataTable
					rowSelection={rowSelection}
					setRowSelection={setRowSelection}
					columns={[
						{
							id: "select",
							header: ({ table }) => (
								<input
									type="checkbox"
									checked={table.getIsAllPageRowsSelected()}
									onChange={(e) =>
										table.toggleAllPageRowsSelected(!!e.target.checked)
									}
								/>
							),
							cell: ({ row }) => (
								<input
									type="checkbox"
									checked={row.getIsSelected()}
									onChange={row.getToggleSelectedHandler()}
								/>
							),
							enableSorting: false,
							enableHiding: false,
						},
						{
							accessorKey: "",
							header: "#",
							cell: ({ row }) => (
								<div className="whitespace-nowrap">
									{props.iterator(row.index, props.invoices)}
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
							accessorKey: "amount",
							header: "Amount",
							cell: ({ row }) => (
								<div className="text-green-600 whitespace-nowrap">
									<small>KES</small> {row.getValue("amount")}
								</div>
							),
						},
						{
							accessorKey: "paid",
							header: "Paid",
						},
						{
							accessorKey: "balance",
							header: "Balance",
						},
						{
							accessorKey: "status",
							header: "Status",
							cell: ({ row }) => {
								const status = row.getValue("status")
								return (
									<span
										className={`
											${
												status == "not_paid"
													? "bg-red-600 text-white"
													: status == "partially_paid"
														? "bg-yellow-500 text-gray-900"
														: status == "paid"
															? "bg-green-600 text-white"
															: "bg-gray-600 text-white"
											}
											py-1 px-3 rounded capitalize whitespace-nowrap
										`}>
										{status
											.split("_")
											.map(
												(word) => word.charAt(0).toUpperCase() + word.slice(1)
											)
											.join(" ")}
									</span>
								)
							},
						},
						{
							accessorKey: "createdAt",
							header: "Created At",
						},
						{
							id: "actions",
							header: "Action",
							cell: ({ row }) => {
								const invoice = row.original
								return (
									<div className="flex items-center gap-2">
										{parseFloat(invoice.balance?.replace(/,/g, "")) > 0 && (
											<Btn
												icon={<ChatSendSVG />}
												text={`send invoice ${
													invoice.smsesSent || invoice.emailsSent
														? `(${invoice.smsesSent + invoice.emailsSent})`
														: ""
												}`}
												className={`${
													invoice.smsesSent || invoice.emailsSent
														? "btn-green"
														: ""
												}`}
												dataBsToggle="modal"
												dataBsTarget={`#invoiceModal`}
												onClick={() => setInvoiceToSend(invoice)}
											/>
										)}
										<MyLink
											href={`/invoices/${invoice.id}/show`}
											icon={<ViewSVG />}
											// text="view"
										/>
										<DeleteModal
											index={`invoice-dt-${invoice.id}`}
											model={invoice}
											modelName="Invoice"
											onDelete={onDeleteInvoice}
										/>
									</div>
								)
							},
						},
					]}
					data={props.invoices.data || []}
					pagination={{
						getPaginated: props.getPaginated,
						setState: props.setInvoices,
						list: props.invoices,
					}}
				/>
			</div>
			{/* DataTable End */}
		</div>
	)
}

export default InvoiceList
