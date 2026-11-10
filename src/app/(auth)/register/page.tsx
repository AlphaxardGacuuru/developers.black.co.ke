"use client"

import { useState } from "react"
import type { FormEvent } from "react"
import InputError from "@/components/input-error"
import PasswordInput from "@/components/password-input"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link } from "@/components/ui/link"
import { Spinner } from "@/components/ui/spinner"
import { useAuth } from "@/hooks/auth"
import { firstErrors } from "@/lib/form-errors"
import { Head, useLayout } from "@/lib/spa"

export default function Register() {
	useLayout({
		title: "Create an account",
		description: "Enter your details below to create your account",
	})

	const { register, authLoading } = useAuth({
		middleware: "guest",
		redirectIfAuthenticated: "/dashboard",
	})

	const [name, setName] = useState("")
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [passwordConfirmation, setPasswordConfirmation] = useState("")
	const [errors, setErrors] = useState<Record<string, string>>({})

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()

		register({
			name,
			email,
			password,
			password_confirmation: passwordConfirmation,
			setErrors: (errors) => setErrors(firstErrors(errors)),
		})
	}

	return (
		<>
			<Head title="Register" />

			<form
				onSubmit={handleSubmit}
				className="flex flex-col gap-6"
				aria-busy={authLoading}>
				<div className="grid gap-6">
					{/* Name Start */}
					<div className="grid gap-2">
						<Input
							id="name"
							label="Name"
							type="text"
							required
							autoFocus
							tabIndex={1}
							autoComplete="name"
							name="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
						<InputError
							message={errors.name}
							className="mt-2"
						/>
					</div>
					{/* Name End */}

					{/* Email Start */}
					<div className="grid gap-2">
						<Input
							id="email"
							label="Email address"
							type="email"
							required
							tabIndex={2}
							autoComplete="email"
							name="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<InputError message={errors.email} />
					</div>
					{/* Email End */}

					{/* Password Start */}
					<div className="grid gap-2">
						<PasswordInput
							id="password"
							required
							tabIndex={3}
							autoComplete="new-password"
							name="password"
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
							label="Confirm Password"
							required
							tabIndex={4}
							autoComplete="new-password"
							name="password_confirmation"
							value={passwordConfirmation}
							onChange={(e) => setPasswordConfirmation(e.target.value)}
						/>
						<InputError message={errors.password_confirmation} />
					</div>
					{/* Confirm Password End */}

					<Button
						type="submit"
						className="mt-2 w-full"
						tabIndex={5}
						disabled={authLoading}
						data-test="register-user-button">
						Create account
						{authLoading && <Spinner />}
					</Button>
				</div>

				<div className="text-center text-sm text-muted-foreground">
					Already have an account?{" "}
					<Link
						href="/login"
						variant="text"
						size="none"
						tabIndex={6}>
						Log in
					</Link>
				</div>
			</form>
		</>
	)
}
