"use client"

import { useApp } from "@/contexts/AppContext"
import { useState, useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import Header from "@/app/(app)/Header"
import CreditNoteList from "@/components/CreditNotes/CreditNoteList"

const CreditNotes = (props) => {
	const appProps = useApp()

	// Add appProps to props
	props = { ...props, ...appProps }

	const [creditNotes, setCreditNotes] = useState([])

	const [number, setNumber] = useState("")
	const [clientName, setClientName] = useState("")
	const [status, setStatus] = useState("")
	const [startMonth, setStartMonth] = useState("")
	const [startYear, setStartYear] = useState("")
	const [endMonth, setEndMonth] = useState("")
	const [endYear, setEndYear] = useState("")

	useEffect(() => {
		// Fetch Credit Notes
		props.getPaginated(
			`credit-notes?
			number=${number}&
			clientName=${clientName}&
			status=${status}&
			startMonth=${startMonth}&
			endMonth=${endMonth}&
			startYear=${startYear}&
			endYear=${endYear}`,
			setCreditNotes
		)
	}, [number, clientName, status, startMonth, endMonth, startYear, endYear])

	return (
		<>
			<Header title="Credit Notes" />
			
			<div className="py-12 px-6">
				{/* Credit Notes Tab */}
				<CreditNoteList
					{...props}
					creditNotes={creditNotes}
					setCreditNotes={setCreditNotes}
					number={number}
					setNumber={setNumber}
					clientName={clientName}
					setClientName={setClientName}
					status={status}
					setStatus={setStatus}
					startMonth={startMonth}
					setStartMonth={setStartMonth}
					endMonth={endMonth}
					setEndMonth={setEndMonth}
					startYear={startYear}
					setStartYear={setStartYear}
					endYear={endYear}
					setEndYear={setEndYear}
				/>
			</div>
		</>
	)
}

export default CreditNotes
