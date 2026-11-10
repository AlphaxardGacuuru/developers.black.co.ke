"use client"

import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import InputError from "@/components/input-error"
import PasswordInput from "@/components/password-input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "@/components/ui/link"
import { Spinner } from "@/components/ui/spinner"
import { useAuth } from "@/hooks/auth"
import { firstErrors } from "@/lib/form-errors"
import { Head, useLayout } from "@/lib/spa"

export default function Login() {
	useLayout({
		title: "Log in to your account",
		description: "Enter your email and password below to log in",
	})

	const { login, authLoading } = useAuth({
		middleware: "guest",
		redirectIfAuthenticated: "/dashboard",
	})

	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [remember, setRemember] = useState(false)
	const [errors, setErrors] = useState<Record<string, string>>({})
	const [status, setStatus] = useState<string | null>(null)

	// A password reset lands here with its status in ?reset=, base64 encoded.
	useEffect(() => {
		const reset = new URLSearchParams(window.location.search).get("reset")

		if (reset) {
			setStatus(atob(reset))
		}
	}, [])

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()

		login({
			email,
			password,
			remember,
			setErrors: (errors) => setErrors(firstErrors(errors)),
			setStatus,
		})
	}

	return (
		<>
			<Head title="Log in" />

			<form
				onSubmit={handleSubmit}
				className="flex flex-col gap-6"
				aria-busy={authLoading}>
				<div className="grid gap-6">
					{/* Email Start */}
					<div className="grid gap-2">
						<Input
							id="email"
							label="Email Address"
							type="email"
							name="email"
							required
							autoFocus
							tabIndex={1}
							autoComplete="email"
							onChange={(e) => setEmail(e.target.value)}
						/>
						<InputError message={errors.email} />
					</div>
					{/* Email End */}

					{/* Password Start */}
					<div className="grid gap-2">
						<PasswordInput
							id="password"
							name="password"
							required
							tabIndex={2}
							autoComplete="current-password"
							onChange={(e) => setPassword(e.target.value)}
						/>
						<InputError message={errors.password} />
						<div className="flex items-center">
							<Link
								href="/forgot-password"
								variant="text"
								size="none"
								className="ml-auto text-sm"
								tabIndex={5}>
								Forgot password?
							</Link>
						</div>
					</div>
					{/* Password End */}

					{/* Remember Start */}
					<div className="flex items-center space-x-3">
						<Checkbox
							id="remember"
							name="remember"
							tabIndex={3}
							checked={remember}
							onCheckedChange={(checked) => setRemember(checked === true)}
						/>
						<Label htmlFor="remember">Remember me</Label>
					</div>
					{/* Remember End */}

					<Button
						type="submit"
						className="mt-4 w-full"
						tabIndex={4}
						disabled={authLoading}
						data-test="login-button">
						Log in
						{authLoading && <Spinner />}
					</Button>
				</div>

				<div className="text-center text-sm text-muted-foreground">
					Don't have an account?{" "}
					<Link
						href="/register"
						variant="text"
						size="none"
						tabIndex={5}>
						Sign up
					</Link>
				</div>
			</form>

			{status && (
				<div className="mb-4 text-center text-sm font-medium text-green-600">
					{status}
				</div>
			)}
		</>
	)
}
