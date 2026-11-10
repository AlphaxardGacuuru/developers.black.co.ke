"use client"

import { useEffect, useState } from "react"
import DeductionList from "@/components/deductions/deduction-list"
import type { DeductionsList } from "@/components/deductions/deduction-list"
import { PageHeader } from "@/components/page-header"
import { useApp } from "@/contexts/AppContext"
import { Head, useLayout } from "@/lib/spa"
import type { Client } from "@/types"

const EMPTY_LIST: DeductionsList = {
	data: [],
	meta: { current_page: 1, last_page: 1, per_page: 10, total: 0 },
}

export default function Deductions() {
	useLayout({
		breadcrumbs: [{ title: "Deductions", href: "/deductions" }],
	})

	const props = useApp()

	const [deductions, setDeductions] = useState<DeductionsList>(() =>
		props.getLocalStorage<DeductionsList>("deductions", EMPTY_LIST)
	)
	const [clients, setClients] = useState<Pick<Client, "id" | "name">[]>([])

	const [number, setNumber] = useState("")
	const [clientId, setClientId] = useState("")
	const [status, setStatus] = useState("")
	const [startMonth, setStartMonth] = useState("")
	const [startYear, setStartYear] = useState("")
	const [endMonth, setEndMonth] = useState("")
	const [endYear, setEndYear] = useState("")

	useEffect(() => {
		props.getPaginated(
			`deductions?
			number=${number}&
			clientId=${clientId}&
			status=${status}&
			startMonth=${startMonth}&
			endMonth=${endMonth}&
			startYear=${startYear}&
			endYear=${endYear}`,
			setDeductions,
			"deductions"
		)

		props.get("users?idAndName=true&type=client", setClients)
	}, [number, clientId, status, startMonth, endMonth, startYear, endYear])

	return (
		<>
			<Head title="Deductions" />

			{/* Bottom padding keeps the last row clear of the floating button. */}
			<div className="flex flex-1 flex-col gap-2 pb-32 md:pb-24">
				{/* Page Header Section Start */}
				<PageHeader
					title="Deductions"
					description="Amounts deducted from invoices, such as withholding taxes."
				/>
				{/* Page Header Section End */}

				<DeductionList
					deductions={deductions}
					setDeductions={setDeductions}
					clients={clients}
					number={number}
					setNumber={setNumber}
					clientId={clientId}
					setClientId={setClientId}
					status={status}
					setStatus={setStatus}
					startMonth={startMonth}
					setStartMonth={setStartMonth}
					startYear={startYear}
					setStartYear={setStartYear}
					endMonth={endMonth}
					setEndMonth={setEndMonth}
					endYear={endYear}
					setEndYear={setEndYear}
				/>
			</div>
		</>
	)
}
