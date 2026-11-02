"use client"

import { useRef, useState } from "react"
import type { FormEvent } from "react"
import Heading from "@/components/heading"
import InputError from "@/components/input-error"
import PasswordInput from "@/components/password-input"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import axios from "@/lib/axios"
import { validationErrors } from "@/lib/form-errors"
import toast from "@/lib/toast"

export default function Security() {
	const passwordInput = useRef<HTMLInputElement>(null)
	const currentPasswordInput = useRef<HTMLInputElement>(null)
	const [processing, setProcessing] = useState(false)
	const [errors, setErrors] = useState<Record<string, string>>({})

	function clearPasswords(form: HTMLFormElement) {
		form
			.querySelectorAll<HTMLInputElement>(
				'input[name$="password"], input[name="password_confirmation"]'
			)
			.forEach((input) => {
				input.value = ""
			})
	}

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		const form = event.currentTarget
		setProcessing(true)
		setErrors({})

		axios
			.put("/api/settings/password", Object.fromEntries(new FormData(form)))
			.then((response) => {
				toast.success(response.data.message ?? "Password Updated")
				clearPasswords(form)
			})
			.catch((error: unknown) => {
				const fieldErrors = validationErrors(error)

				if (!fieldErrors) {
					toast.error("Couldn't update your password")

					return
				}

				setErrors(fieldErrors)

				if (fieldErrors.current_password) {
					currentPasswordInput.current?.focus()
				} else if (fieldErrors.password) {
					passwordInput.current?.focus()
				}
			})
			.finally(() => setProcessing(false))
	}

	return (
		<>
			<h1 className="sr-only">Security settings</h1>

			<div className="space-y-6">
				<Heading
					variant="small"
					title="Update password"
					description="Ensure your account is using a long, random password to stay secure"
				/>

				<form
					onSubmit={handleSubmit}
					className="space-y-6">
					<div className="grid gap-2">
						<PasswordInput
							id="current_password"
							ref={currentPasswordInput}
							name="current_password"
							className="mt-1 block w-full"
							autoComplete="current-password"
							label="Current password"
						/>

						<InputError message={errors.current_password} />
					</div>

					<div className="grid gap-2">
						<PasswordInput
							id="password"
							ref={passwordInput}
							name="password"
							className="mt-1 block w-full"
							autoComplete="new-password"
							label="New password"
						/>

						<InputError message={errors.password} />
					</div>

					<div className="grid gap-2">
						<PasswordInput
							id="password_confirmation"
							name="password_confirmation"
							className="mt-1 block w-full"
							autoComplete="new-password"
							label="Confirm password"
						/>

						<InputError message={errors.password_confirmation} />
					</div>

					<div className="flex items-center gap-4">
						<Button
							disabled={processing}
							data-test="update-password-button">
							{processing && <Spinner className="size-4" />}
							Save password
						</Button>
					</div>
				</form>
			</div>
		</>
	)
}
