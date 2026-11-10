"use client"

import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import CreditNoteList from "@/components/credit-notes/credit-note-list"
import type {
	ClientOption,
	CreditNoteListData,
} from "@/components/credit-notes/credit-note-list"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"
import { useApp } from "@/contexts/AppContext"
import { useFabPosition } from "@/hooks/use-fab-position"
import { Head, useLayout } from "@/lib/spa"

export default function CreditNotesIndex() {
	useLayout({
		breadcrumbs: [{ title: "Credit Notes", href: "/credit-notes" }],
	})

	const props = useApp()
	const fabPosition = useFabPosition()

	const [creditNotes, setCreditNotes] = useState<CreditNoteListData>(() =>
		props.getLocalStorage<CreditNoteListData>("creditNotes", {
			data: [],
			meta: { current_page: 1, last_page: 1, per_page: 10, total: 0 },
		})
	)
	const [clients, setClients] = useState<ClientOption[]>([])

	const [number, setNumber] = useState("")
	const [clientId, setClientId] = useState("")
	const [startMonth, setStartMonth] = useState("")
	const [startYear, setStartYear] = useState("")
	const [endMonth, setEndMonth] = useState("")
	const [endYear, setEndYear] = useState("")

	useEffect(() => {
		props.getPaginated(
			`credit-notes?number=${number}&clientId=${clientId}&status=&startMonth=${startMonth}&endMonth=${endMonth}&startYear=${startYear}&endYear=${endYear}`,
			setCreditNotes,
			"creditNotes"
		)

		props.get("users?idAndName=true&type=client", setClients)
	}, [number, clientId, startMonth, endMonth, startYear, endYear])

	return (
		<>
			<Head title="Credit Notes" />

			{/* Floating Section Start */}
			<div {...fabPosition}>
				<Button
					asChild
					className="h-14 min-w-14 rounded-full px-4 shadow-lg sm:px-6">
					<Link
						href="/credit-notes/create"
						variant="unstyled"
						aria-label="Create credit note"
						title="Create credit note">
						<Plus
							className="size-8"
							strokeWidth={1.3}
						/>
						<span className="hidden sm:inline">Create credit note</span>
					</Link>
				</Button>
			</div>
			{/* Floating Section End */}

			{/* Bottom padding keeps the last row clear of the floating button. */}
			<div className="flex flex-1 flex-col gap-2 pb-32 md:pb-24">
				{/* Page Header Section Start */}
				<PageHeader
					title="Credit Notes"
					description="Credits issued against your invoices."
				/>
				{/* Page Header Section End */}

				<CreditNoteList
					creditNotes={creditNotes}
					setCreditNotes={setCreditNotes}
					clients={clients}
					number={number}
					setNumber={setNumber}
					clientId={clientId}
					setClientId={setClientId}
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
