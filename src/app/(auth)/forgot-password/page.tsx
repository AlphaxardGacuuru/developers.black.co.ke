"use client"

import { useState } from "react"
import type { FormEvent } from "react"
import InputError from "@/components/input-error"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link } from "@/components/ui/link"
import { Spinner } from "@/components/ui/spinner"
import { useAuth } from "@/hooks/auth"
import { firstErrors } from "@/lib/form-errors"
import { Head, useLayout } from "@/lib/spa"

export default function ForgotPassword() {
	useLayout({
		title: "Forgot password",
		description: "Enter your email to receive a password reset link",
	})

	const { forgotPassword } = useAuth({
		middleware: "guest",
		redirectIfAuthenticated: "/dashboard",
	})

	const [email, setEmail] = useState("")
	const [processing, setProcessing] = useState(false)
	const [errors, setErrors] = useState<Record<string, string>>({})
	const [status, setStatus] = useState<string | null>(null)

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setProcessing(true)

		forgotPassword({
			email,
			setErrors: (errors) => setErrors(firstErrors(errors)),
			setStatus,
		}).finally(() => setProcessing(false))
	}

	return (
		<>
			<Head title="Forgot password" />

			{status && (
				<div className="mb-4 text-center text-sm font-medium text-green-600">
					{status}
				</div>
			)}

			<div className="space-y-6">
				<form onSubmit={handleSubmit}>
					{/* Email Start */}
					<div className="grid gap-2">
						<Input
							id="email"
							label="Email"
							type="email"
							name="email"
							autoComplete="off"
							autoFocus
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>

						<InputError message={errors.email} />
					</div>
					{/* Email End */}

					<div className="my-6 flex items-center justify-start">
						<Button
							className="w-full"
							disabled={processing}
							data-test="email-password-reset-link-button">
							Email password reset link
							{processing && <Spinner />}
						</Button>
					</div>
				</form>

				<div className="space-x-1 text-center text-sm text-muted-foreground">
					<span>Or, return to</span>
					<Link
						href="/login"
						variant="text"
						size="none">
						log in
					</Link>
				</div>
			</div>
		</>
	)
}
