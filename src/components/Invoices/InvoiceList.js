import React, { useState, useRef, useEffect } from "react"
import Axios from "@/lib/axios"

import Btn from "@/components/ui/button"
import MyLink from "@/components/ui/my-link"
import DeleteModal from "@/components/core/DeleteModal"

import PaginationLinks from "@/components/core/PaginationLinks"

import HeroHeading from "@/components/core/HeroHeading"
import HeroIcon from "@/components/core/HeroIcon"
import NoData from "@/components/core/NoData"

import ViewSVG from "@/svgs/ViewSVG"
import EditSVG from "@/svgs/EditSVG"
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
							return !invoiceIds.includes(invoice.id)
						} else {
							return invoice.id != invoiceId
						}
					}),
				})
				// Clear DeleteIds
				setDeleteIds([])
			})
			.catch((err) => {
				setLoading(false)
				props.getErrors(err)
				// Clear DeleteIds
				setDeleteIds([])
			})
	}

	return (
		<div className={props.activeTab}>
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
					<div className="flex-grow min-w-0 mb-2">
						<label
							htmlFor="name"
							className="text-white">
							Code
						</label>
						<input
							type="text"
							placeholder="Search by Code"
							className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded text-white placeholder-white/50 focus:outline-none focus:border-white/60 focus:bg-white/20 transition-all"
							onChange={(e) => props.setNumber(e.target.value)}
						/>
					</div>
					{/* Code End */}
					{/* Tenant */}
					<div className="flex-grow min-w-0 mb-2">
						<label
							htmlFor="name"
							className="text-white">
							Tenant
						</label>
						<input
							type="text"
							placeholder="Search by Tenant"
							className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded text-white placeholder-white/50 focus:outline-none focus:border-white/60 focus:bg-white/20 transition-all"
							onChange={(e) => props.setTenant(e.target.value)}
						/>
					</div>
					{/* Tenant End */}
					{/* Unit */}
					<div className="flex-grow min-w-0 mb-2">
						<label
							htmlFor="name"
							className="text-white">
							Unit
						</label>
						<input
							type="text"
							placeholder="Search by Unit"
							className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded text-white placeholder-white/50 focus:outline-none focus:border-white/60 focus:bg-white/20 transition-all"
							onChange={(e) => props.setUnit(e.target.value)}
						/>
					</div>
					{/* Unit End */}
					{/* Type */}
					<div className="flex-grow min-w-0 mb-2">
						<label
							htmlFor="name"
							className="text-white">
							Type
						</label>
						<select
							type="text"
							name="type"
							className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded capitalize text-white focus:outline-none focus:border-white/60 focus:bg-white/20 transition-all"
							onChange={(e) => props.setType(e.target.value)}
							required={true}>
							{[
								{ id: "", name: "All" },
								{ id: "rent", name: "Rent" },
								{ id: "water", name: "Water" },
								{ id: "service_charge", name: "Service Charge" },
							].map((type, key) => (
								<option
									key={key}
									value={type.id}>
									{type.name}
								</option>
							))}
						</select>
					</div>
					{/* Type End */}
					{/* Status */}
					<div className="flex-grow min-w-0 mb-2">
						<label
							htmlFor="name"
							className="text-white">
							Status
						</label>
						<select
							type="text"
							name="status"
							className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded capitalize text-white focus:outline-none focus:border-white/60 focus:bg-white/20 transition-all"
							onChange={(e) => props.setStatus(e.target.value)}
							required={true}>
							{[
								{ id: "", name: "All" },
								{ id: "not_paid", name: "Not Paid" },
								{ id: "partially_paid", name: "Partially Paid" },
								{ id: "paid", name: "Paid" },
								{ id: "overpaid", name: "Overpaid" },
							].map((status, key) => (
								<option
									key={key}
									value={status.id}>
									{status.name}
								</option>
							))}
						</select>
					</div>
					{/* Status End */}
				</div>
			</div>

			<div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-sm rounded-3xl py-2 px-4 hover:bg-white/15 transition-all duration-500">
				<div className="flex justify-end flex-wrap">
					<div className="flex flex-grow gap-2">
						{/* Start Date */}
						<div className="flex-grow mb-2">
							<label
								htmlFor=""
								className="text-white">
								Start At
							</label>
							{/* Start Month */}
							<select
								className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded text-white focus:outline-none focus:border-white/60 focus:bg-white/20 transition-all"
								onChange={(e) => props.setStartMonth(e.target.value)}>
								{props.months.map((month, key) => (
									<option
										key={key}
										value={key}>
										{month}
									</option>
								))}
							</select>
						</div>
						{/* Start Month End */}
						{/* Start Year */}
						<div className="flex-grow mb-2">
							<label
								htmlFor=""
								className="invisible">
								Start At
							</label>
							<select
								className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded text-white focus:outline-none focus:border-white/60 focus:bg-white/20 transition-all"
								onChange={(e) => props.setStartYear(e.target.value)}>
								<option value="">Select Year</option>
								{props.years.map((year, key) => (
									<option
										key={key}
										value={year}>
										{year}
									</option>
								))}
							</select>
						</div>
						{/* Start Year End */}
					</div>
					{/* Start Date End */}
					{/* End Date */}
					<div className="flex flex-grow gap-2">
						{/* End Month */}
						<div className="flex-grow mb-2">
							<label
								htmlFor=""
								className="text-white">
								End At
							</label>
							<select
								className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded text-white focus:outline-none focus:border-white/60 focus:bg-white/20 transition-all"
								onChange={(e) => props.setEndMonth(e.target.value)}>
								{props.months.map((month, key) => (
									<option
										key={key}
										value={key}>
										{month}
									</option>
								))}
							</select>
						</div>
						{/* End Month End */}
						{/* End Year */}
						<div className="flex-grow mb-2">
							<label
								htmlFor=""
								className="invisible">
								End At
							</label>
							<select
								className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded text-white focus:outline-none focus:border-white/60 focus:bg-white/20 transition-all"
								onChange={(e) => props.setStartYear(e.target.value)}>
								<option value="">Select Year</option>
								{props.years.map((year, key) => (
									<option
										key={key}
										value={year}>
										{year}
									</option>
								))}
							</select>
						</div>
						{/* End Year End */}
					</div>
					{/* End Date End */}
				</div>
			</div>
			{/* Filters End */}

			<br />

			{/* Table */}
			<div className="overflow-x-auto mb-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl">
				<table className="min-w-full table-auto text-white">
					<thead>
						<tr>
							<th colSpan="8"></th>
							<th
								colSpan="2"
								className="text-right">
								<div className="flex justify-end gap-2">
									{deleteIds.length > 0 && (
										<Btn
											text={`delete ${deleteIds.length}`}
											onClick={() => onDeleteInvoice(deleteIds)}
											loading={loading}
										/>
									)}

									<MyLink
										href={`/invoices/create`}
										icon={<PlusSVG />}
										text="create invoice"
									/>
								</div>
							</th>
						</tr>
						<tr>
							<th className="px-4 py-2">
								<input
									type="checkbox"
									checked={
										deleteIds.length == props.invoices.data?.length &&
										deleteIds.length != 0
									}
									onClick={() =>
										setDeleteIds(
											deleteIds.length == props.invoices.data.length
												? []
												: props.invoices.data.map((invoice) => invoice.id)
										)
									}
								/>
							</th>
							<th className="px-4 py-2">INV</th>
							<th className="px-4 py-2">Tenant</th>
							<th className="px-4 py-2">Unit</th>
							<th className="px-4 py-2">Type</th>
							<th className="px-4 py-2">Month</th>
							<th className="px-4 py-2">Year</th>
							<th className="px-4 py-2">Amount</th>
							{/* <th>Paid</th> */}
							{/* <th>Balance</th> */}
							<th className="px-4 py-2">Status</th>
							<th className="px-4 py-2 text-center">Action</th>
						</tr>
					</thead>
					{props.invoices.data?.length > 0 ? (
						<tbody>
							{props.invoices.data?.map((invoice, key) => (
								<tr
									key={key}
									className="hover:bg-white/10 transition-all border-b border-white/10">
									<td className="px-4 py-2">
										<input
											type="checkbox"
											checked={deleteIds.includes(invoice.id)}
											onClick={() => handleSetDeleteIds(invoice.id)}
										/>
									</td>
									{/* <td>{props.iterator(key, invoices)}</td> */}
									<td className="px-4 py-2 whitespace-nowrap">
										{invoice.number}
									</td>
									<td className="px-4 py-2">{invoice.tenantName}</td>
									<td className="px-4 py-2">{invoice.unitName}</td>
									<td className="px-4 py-2 capitalize">
										{invoice.type
											.split("_")
											.map(
												(word) => word.charAt(0).toUpperCase() + word.slice(1)
											)
											.join(" ")}
									</td>
									<td className="px-4 py-2 capitalize">
										{props.months[invoice.month]}
									</td>
									<td className="px-4 py-2">{invoice.year}</td>
									<td className="px-4 py-2 text-green-600 whitespace-nowrap">
										<small>KES</small> {invoice.amount}
									</td>
									{/* <td className="text-success">
										<small>KES</small> {invoice.paid}
									</td> */}
									{/* <td className="text-success">
										<small>KES</small> {invoice.balance}
									</td> */}
									<td className="px-4 py-2 capitalize whitespace-nowrap">
										<span
											className={`
									${
										invoice.status == "not_paid"
											? "bg-red-100"
											: invoice.status == "partially_paid"
												? "bg-yellow-100"
												: invoice.status == "paid"
													? "bg-green-100"
													: "bg-gray-100"
									}
								 py-1 px-3 rounded`}>
											{invoice.status
												.split("_")
												.map(
													(word) => word.charAt(0).toUpperCase() + word.slice(1)
												)
												.join(" ")}
										</span>
									</td>
									<td className="px-4 py-2">
										<div className="flex justify-center gap-2">
											{/* Button trigger modal */}
											<React.Fragment>
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
											</React.Fragment>
											{/* Button trigger modal End */}

											<MyLink
												href={`/invoices/${invoice.id}/show`}
												icon={<ViewSVG />}
											/>

											<div>
												<DeleteModal
													index={`invoice${key}`}
													model={invoice}
													modelName="Invoice"
													onDelete={onDeleteInvoice}
												/>
											</div>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					) : (
						<tbody>
							<tr>
								<td
									colSpan="10"
									className="p-0">
									<NoData />
								</td>
							</tr>
						</tbody>
					)}
				</table>
				{/* Pagination Links */}
				<PaginationLinks
					list={props.invoices}
					getPaginated={props.getPaginated}
					setState={props.setInvoices}
				/>
				{/* Pagination Links End */}
			</div>
			{/* Table End */}
		</div>
	)
}

export default InvoiceList
