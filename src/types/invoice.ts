export type InvoiceItem = {
	id?: number
	invoice_id?: number
	item?: string
	description: string
	quantity: number
	rate: number
	amount: number
}

// Money values come back already formatted (number_format), so they're strings.
export type Invoice = {
	id: number
	number: string
	clientId: number
	clientName: string
	clientEmail: string
	amount: string
	withholdingTax: number | string | null
	paid: string
	balance: string
	credits: string
	deductions: string
	status: string
	emailsSent: number
	issueDate: string
	dueDate: string
	notes: string | null
	terms: string | null
	invoiceItems: InvoiceItem[]
	createdAt: string
	updatedAt: string
}
