import Link from "next/link"
import AuthCard from "@/app/(auth)/AuthCard"
import ApplicationLogo from "@/components/ApplicationLogo"

export const metadata = {
	title: `${process.env.NEXT_PUBLIC_APP_NAME || "Black Developers"} - Login`,
}

const Layout = ({ children }) => {
	return (
		<AuthCard
			logo={
				<Link
					href="/"
					className="flex items-center justify-center transition-opacity hover:opacity-80">
					<ApplicationLogo className="h-12 w-auto" />
				</Link>
			}>
			{children}
		</AuthCard>
	)
}

export default Layout
