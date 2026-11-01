import Link from "next/link"
import { Home, LogOut } from "lucide-react"
import { useState } from "react"
import {
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { UserInfo } from "@/components/user-info"
import { useAuth } from "@/hooks/auth"
import type { User } from "@/types"

export function UserMenuContent({ user }: { user: User }) {
	const { logout } = useAuth()
	const [loggingOut, setLoggingOut] = useState(false)

	const handleLogout = () => {
		setLoggingOut(true)
		logout().finally(() => setLoggingOut(false))
	}

	return (
		<>
			<DropdownMenuLabel className="p-0 font-normal">
				<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
					<UserInfo
						user={user}
						showEmail={true}
					/>
				</div>
			</DropdownMenuLabel>
			<DropdownMenuSeparator />
			<DropdownMenuGroup>
				<DropdownMenuItem asChild>
					<Link
						className="flex w-full cursor-pointer items-center"
						href="/">
						<Home className="mr-2 size-4" />
						Welcome Page
					</Link>
				</DropdownMenuItem>
			</DropdownMenuGroup>
			<DropdownMenuSeparator />
			<DropdownMenuItem asChild>
				<button
					className="flex w-full cursor-pointer items-center disabled:cursor-not-allowed disabled:opacity-50"
					onClick={handleLogout}
					disabled={loggingOut}>
					<LogOut className="mr-2 size-4" />
					Log out
				</button>
			</DropdownMenuItem>
		</>
	)
}
