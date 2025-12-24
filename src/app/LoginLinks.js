"use client"

import Link from "next/link"
import { useAuth } from "@/hooks/auth"

const LoginLinks = () => {
	const { user } = useAuth({ middleware: "guest" })

	return (
		<div className="hidden fixed top-0 right-0 px-6 py-4 sm:block z-10">
			{user ? (
				<Link
					href="/dashboard"
					className="ml-4 text-sm text-gray-700 underline">
					Dashboard
				</Link>
			) : (
				<>
					<Link
						href="/login"
						className="mt-20 p-1 px-5 rounded-3xl text-white bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-700 ease-out group">
						Login
					</Link>

					<Link
						href="/register"
						className="ml-4 mt-20 p-1 px-5 rounded-3xl text-white bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-700 ease-out group">
						Register
					</Link>
				</>
			)}
		</div>
	)
}

export default LoginLinks
