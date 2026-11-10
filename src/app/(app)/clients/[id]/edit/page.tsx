"use client"

import { isAxiosError } from "axios"
import { useParams } from "next/navigation"
import type { FormEvent } from "react"
import { useEffect, useState } from "react"
import { ClientForm } from "@/components/clients/client-form"
import type { ClientErrors, ClientFields } from "@/components/clients/client-form"
import { PageHeader } from "@/components/page-header"
import { Spinner } from "@/components/ui/spinner"
import { useApp } from "@/contexts/AppContext"
import Axios from "@/lib/axios"
import { Head, useLayout } from "@/lib/spa"
import { toast } from "@/lib/toast"
import type { Client } from "@/types"

export default function EditClient() {
	const props = useApp()
	const { id } = useParams<{ id: string }>()

	useLayout({
		breadcrumbs: [
			{ title: "Clients", href: "/clients" },
			{ title: "Edit", href: `/clients/${id}/edit` },
		],
	})

	const [values, setValues] = useState<ClientFields>({
		name: "",
		email: "",
		phone: "",
	})
	const [errors, setErrors] = useState<ClientErrors>({})
	const [loading, setLoading] = useState(false)
	const [loadingClient, setLoadingClient] = useState(true)

	useEffect(() => {
		Axios.get<{ data: Client }>(`/api/users/${id}`)
			.then((response) => {
				const client = response.data.data

				setValues({
					name: client.name || "",
					email: client.email || "",
					phone: client.phone || "",
				})
			})
			.catch((error: unknown) => {
				if (isAxiosError(error)) {
					props.getErrors(error)
				}
			})
			.finally(() => setLoadingClient(false))
	}, [id])

	const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
		event.preventDefault()
		setErrors({})
		setLoading(true)

		Axios.put(`/api/users/${id}`, values)
			.then((response) => {
				toast.success(response.data.message)
			})
			.catch((error: unknown) => {
				if (isAxiosError(error) && error.response?.status === 422) {
					const fieldErrors = error.response.data?.errors ?? {}

					setErrors({
						name: props.getFieldError(fieldErrors.name),
						email: props.getFieldError(fieldErrors.email),
						phone: props.getFieldError(fieldErrors.phone),
					})

					return
				}

				if (isAxiosError(error)) {
					props.getErrors(error)
				}
			})
			.finally(() => setLoading(false))
	}

	return (
		<>
			<Head title="Edit Client" />

			<div className="flex flex-1 flex-col gap-6 p-4">
				{/* Page Header Section Start */}
				<PageHeader
					title="Edit Client"
					description="Update this client's contact details."
				/>
				{/* Page Header Section End */}

				{/* Client Form Section Start */}
				{loadingClient ? (
					<div className="flex justify-center py-12 text-muted-foreground">
						<Spinner />
					</div>
				) : (
					<ClientForm
						values={values}
						onChange={setValues}
						errors={errors}
						loading={loading}
						submitLabel="Update Client"
						onSubmit={onSubmit}
					/>
				)}
				{/* Client Form Section End */}
			</div>
		</>
	)
}
