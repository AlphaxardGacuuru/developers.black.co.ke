"use client"

import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import InputError from "@/components/input-error"
import PasswordInput from "@/components/password-input"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { useAuth } from "@/hooks/auth"
import { firstErrors } from "@/lib/form-errors"
import { Head, useLayout } from "@/lib/spa"

export default function ResetPassword() {
	useLayout({
		title: "Reset password",
		description: "Please enter your new password below",
	})

	const { resetPassword } = useAuth({ middleware: "guest" })

	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [passwordConfirmation, setPasswordConfirmation] = useState("")
	const [processing, setProcessing] = useState(false)
	const [errors, setErrors] = useState<Record<string, string>>({})

	// The reset email links here with the address in ?email=.
	useEffect(() => {
		setEmail(new URLSearchParams(window.location.search).get("email") ?? "")
	}, [])

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setProcessing(true)

		resetPassword({
			email,
			password,
			password_confirmation: passwordConfirmation,
			setErrors: (errors) => setErrors(firstErrors(errors)),
			setStatus: () => {},
		}).finally(() => setProcessing(false))
	}

	return (
		<>
			<Head title="Reset password" />

			<form onSubmit={handleSubmit}>
				<div className="grid gap-6">
					{/* Email Start */}
					<div className="grid gap-2">
						<Input
							id="email"
							label="Email"
							type="email"
							name="email"
							autoComplete="email"
							value={email}
							className="mt-1 block w-full"
							readOnly
						/>
						<InputError
							message={errors.email}
							className="mt-2"
						/>
					</div>
					{/* Email End */}

					{/* Password Start */}
					<div className="grid gap-2">
						<PasswordInput
							id="password"
							label="Password"
							name="password"
							autoComplete="new-password"
							className="mt-1 block w-full"
							autoFocus
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<InputError message={errors.password} />
					</div>
					{/* Password End */}

					{/* Confirm Password Start */}
					<div className="grid gap-2">
						<PasswordInput
							id="password_confirmation"
							label="Confirm password"
							name="password_confirmation"
							autoComplete="new-password"
							className="mt-1 block w-full"
							placeholder="Confirm password"
							value={passwordConfirmation}
							onChange={(e) => setPasswordConfirmation(e.target.value)}
						/>
						<InputError
							message={errors.password_confirmation}
							className="mt-2"
						/>
					</div>
					{/* Confirm Password End */}

					<Button
						type="submit"
						className="mt-4 w-full"
						disabled={processing}
						data-test="reset-password-button">
						Reset password
						{processing && <Spinner />}
					</Button>
				</div>
			</form>
		</>
	)
}
