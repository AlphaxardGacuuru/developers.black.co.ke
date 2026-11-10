"use client"

import { useState } from "react"
import type { FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useAuth } from "@/hooks/auth"
import { Head, useLayout } from "@/lib/spa"

export default function VerifyEmail() {
	useLayout({
		title: "Verify email",
		description:
			"Please verify your email address by clicking on the link we just emailed to you.",
	})

	const { logout, resendEmailVerification } = useAuth({
		middleware: "auth",
		redirectIfAuthenticated: "/dashboard",
	})

	const [processing, setProcessing] = useState(false)
	const [status, setStatus] = useState<string | null>(null)

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setProcessing(true)

		resendEmailVerification({
			setStatus: (status) => {
				setStatus(status)
				setProcessing(false)
			},
		})
	}

	return (
		<>
			<Head title="Email verification" />

			{status === "verification-link-sent" && (
				<div className="mb-4 text-center text-sm font-medium text-green-600">
					A new verification link has been sent to the email address you
					provided during registration.
				</div>
			)}

			<form
				onSubmit={handleSubmit}
				className="space-y-6 text-center">
				<Button
					disabled={processing}
					variant="secondary">
					Resend verification email
					{processing && <Spinner />}
				</Button>

				<Button
					type="button"
					variant="link"
					onClick={logout}
					className="mx-auto block text-sm">
					Log out
				</Button>
			</form>
		</>
	)
}
