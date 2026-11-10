"use client"

import { Link } from "@/components/ui/link"
import { useAuth } from "@/hooks/auth"

export default function LoginLinks() {
	const { user } = useAuth({ middleware: "guest" })

	return (
		<div className="fixed top-0 right-0 z-20 px-6 py-4 sm:block">
			{user ? (
				<Link href="/dashboard">Dashboard</Link>
			) : (
				<>
					<Link href="/login">Login</Link>

					<Link
						href="/register"
						className="ml-4">
						Register
					</Link>
				</>
			)}
		</div>
	)
}
