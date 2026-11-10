export type Payment = {
	id: number
	userId: number
	userName: string
	userEmail: string
	invoiceId: number
	invoiceNumber: string
	number: string
	clientName: string
	clientEmail: string
	clientPhone: string | null
	amount: string
	paymentDate: string
	notes: string | null
	createdAt: string
	updatedAt: string
}
