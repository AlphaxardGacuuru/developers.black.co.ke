"use client"

import { isAxiosError } from "axios"
import { useRouter } from "next/navigation"
import type { FormEvent } from "react"
import { useState } from "react"
import { ClientForm } from "@/components/clients/client-form"
import type { ClientErrors, ClientFields } from "@/components/clients/client-form"
import { PageHeader } from "@/components/page-header"
import { useApp } from "@/contexts/AppContext"
import Axios from "@/lib/axios"
import { Head, useLayout } from "@/lib/spa"
import { toast } from "@/lib/toast"

export default function CreateClient() {
	const props = useApp()
	const router = useRouter()

	useLayout({
		breadcrumbs: [
			{ title: "Clients", href: "/clients" },
			{ title: "Create", href: "/clients/create" },
		],
	})

	const [values, setValues] = useState<ClientFields>({
		name: "",
		email: "",
		phone: "",
	})
	const [errors, setErrors] = useState<ClientErrors>({})
	const [loading, setLoading] = useState(false)

	const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
		event.preventDefault()
		setErrors({})
		setLoading(true)

		Axios.post("/api/users", { ...values, type: "client" })
			.then((response) => {
				toast.success(response.data.message)
				setTimeout(() => router.push("/clients"), 500)
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
			<Head title="Create Client" />

			<div className="flex flex-1 flex-col gap-6 p-4">
				{/* Page Header Section Start */}
				<PageHeader
					title="Create Client"
					description="Add a client you can invoice."
				/>
				{/* Page Header Section End */}

				{/* Client Form Section Start */}
				<ClientForm
					values={values}
					onChange={setValues}
					errors={errors}
					loading={loading}
					submitLabel="Create Client"
					emailRequired
					onSubmit={onSubmit}
				/>
				{/* Client Form Section End */}
			</div>
		</>
	)
}
