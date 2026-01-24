"use client"

import { useApp } from "@/contexts/AppContext"
import { useState, useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import Header from "@/app/(app)/Header"
import PaymentList from "@/components/Payments/PaymentList"

const Payments = (props) => {
	const appProps = useApp()

	// Add appProps to props
	props = { ...props, ...appProps }

	const [payments, setPayments] = useState([])

	const [startMonth, setStartMonth] = useState("")
	const [startYear, setStartYear] = useState("")
	const [endMonth, setEndMonth] = useState("")
	const [endYear, setEndYear] = useState("")

	useEffect(() => {
		// Fetch Payments
		props.getPaginated(
			`payments?startMonth=${startMonth}&
			endMonth=${endMonth}&
			startYear=${startYear}&
			endYear=${endYear}`,
			setPayments
		)
	}, [startMonth, endMonth, startYear, endYear])

	return (
		<>
			<Header title="Payments" />
			<div className="py-12 px-6">
				{/* Payments Tab */}
				<PaymentList
					{...props}
					payments={payments}
					setPayments={setPayments}
					startMonth={startMonth}
					setStartMonth={setStartMonth}
					endMonth={endMonth}
					setEndMonth={setEndMonth}
					startYear={startYear}
					setStartYear={setStartYear}
					endYear={endYear}
					setEndYear={setEndYear}
				/>
				{/* Payments Tab End */}
			</div>
		</>
	)
}

export default Payments
