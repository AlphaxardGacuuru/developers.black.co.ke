"use client"

import { LoaderCircle } from "lucide-react"
import { useState } from "react"
import type { FormEvent } from "react"
import DeleteUser from "@/components/delete-user"
import Heading from "@/components/heading"
import InputError from "@/components/input-error"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AUTH_QUERY_KEY, useAuth } from "@/hooks/auth"
import axios from "@/lib/axios"
import { validationErrors } from "@/lib/form-errors"
import { queryClient } from "@/lib/query-client"
import toast from "@/lib/toast"

export default function Profile() {
	// Already loaded by the app layout's useAuth
	const { user } = useAuth()
	const [processing, setProcessing] = useState(false)
	const [errors, setErrors] = useState<Record<string, string>>({})

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setProcessing(true)
		setErrors({})

		axios
			.patch(
				"/api/settings/profile",
				Object.fromEntries(new FormData(event.currentTarget))
			)
			.then((response) => {
				toast.success(response.data.message ?? "Profile Updated")
				queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY })
			})
			.catch((error: unknown) => {
				const fieldErrors = validationErrors(error)

				if (fieldErrors) {
					setErrors(fieldErrors)
				} else {
					toast.error("Couldn't update your profile")
				}
			})
			.finally(() => setProcessing(false))
	}

	if (!user) {
		return null
	}

	return (
		<>
			<h1 className="sr-only">Profile settings</h1>

			<div className="space-y-6">
				<Heading
					variant="small"
					title="Profile information"
					description="Update your name and email address"
				/>

				<form
					onSubmit={handleSubmit}
					className="space-y-6">
					<div className="grid gap-2">
						<Input
							id="name"
							label="Full name"
							className="mt-1 block w-full"
							defaultValue={user.name}
							name="name"
							required
							autoComplete="name"
						/>

						<InputError
							className="mt-2"
							message={errors.name}
						/>
					</div>

					<div className="grid gap-2">
						<Input
							id="email"
							label="Email address"
							type="email"
							className="mt-1 block w-full"
							defaultValue={user.email}
							name="email"
							required
							autoComplete="username"
						/>

						<InputError
							className="mt-2"
							message={errors.email}
						/>
					</div>

					<div className="flex items-center justify-end gap-4">
						<Button
							disabled={processing}
							data-test="update-profile-button">
							Save
							{processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
						</Button>
					</div>
				</form>
			</div>

			<DeleteUser />
		</>
	)
}
