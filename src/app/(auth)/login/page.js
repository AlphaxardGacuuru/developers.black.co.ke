"use client"

import Link from "next/link"
import { useAuth } from "@/hooks/auth"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AuthSessionStatus from "@/app/(auth)/AuthSessionStatus"
import { Input } from "@/components/legacy/input"
import { Btn } from "@/components/legacy/button"
import { Checkbox } from "@/components/ui/checkbox"

const Login = () => {
	const router = useRouter()

	const { login, authLoading } = useAuth({
		middleware: "guest",
		redirectIfAuthenticated: "/dashboard",
	})

	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [shouldRemember, setShouldRemember] = useState(false)
	const [errors, setErrors] = useState([])
	const [status, setStatus] = useState(null)

	useEffect(() => {
		if (router.reset?.length > 0 && errors.length === 0) {
			setStatus(atob(router.reset))
		} else {
			setStatus(null)
		}
	})

	const submitForm = async (event) => {
		event.preventDefault()

		login({
			email,
			password,
			remember: shouldRemember,
			setErrors,
			setStatus,
		})
	}

	return (
		<>
			<div className="text-center mb-8">
				<h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-primary mb-3">
					Welcome Back
				</h2>
				<p className="text-foreground/60 text-lg">
					Sign in to continue to Black Developers
				</p>
			</div>

			<AuthSessionStatus
				className="mb-4"
				status={status}
			/>

			<form
				onSubmit={submitForm}
				className="space-y-6">
				{/* Email Address */}
				<div className="space-y-2">
					<Input
						label="Email"
						id="email"
						type="email"
						value={email}
						placeholder="your@email.com"
						onChange={(event) => setEmail(event.target.value)}
						required
						autoFocus
					/>
					{errors.email && (
						<p className="text-sm text-red-400 ">
							{errors.email[0]}
						</p>
					)}
				</div>

				{/* Password */}
				<div className="space-y-2">
					<Input
						label="Password"
						id="password"
						type="password"
						value={password}
						placeholder="••••••••"
						onChange={(event) => setPassword(event.target.value)}
						required
						autoComplete="current-password"
					/>
					{errors.password && (
						<p className="text-sm text-red-400 ">
							{errors.password[0]}
						</p>
					)}
				</div>

				{/* Remember Me */}
				<div className="flex items-center justify-between">
					<label
						htmlFor="remember_me"
						className="flex items-center cursor-pointer gap-2">
						<Checkbox
							id="remember_me"
							name="remember"
							onCheckedChange={(checked) => setShouldRemember(checked === true)}
						/>
						<span className="text-sm text-foreground/60 ">
							Remember me
						</span>
					</label>

					<Link
						href="/forgot-password"
						className="text-sm text-foreground/60 hover:text-foreground transition-colors">
						Forgot password?
					</Link>
				</div>

				<Btn
					type="submit"
					className="w-full"
					text="Sign In"
					loading={authLoading}
				/>

				<div className="text-center">
					<p className="text-foreground/60 text-sm">
						Don't have an account?{" "}
						<Link
							href="/register"
							className="text-foreground hover:text-foreground/80 transition-colors">
							Sign up
						</Link>
					</p>
				</div>
			</form>
		</>
	)
}

export default Login
