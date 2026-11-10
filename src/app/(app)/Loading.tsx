import ApplicationLogo from "@/components/ApplicationLogo"

const Loading = () => {
	return (
		<div className="flex min-h-screen w-full items-center justify-center bg-linear-to-br from-card to-background">
			<div className="text-center flex flex-col items-center">
				{/* Logo */}
				<div className="mb-3 pt-20 text-foreground">
					<ApplicationLogo />
				</div>

				{/* Spacer to push loader to bottom */}
				<div className="grow"></div>

				{/* Spinner at bottom - smaller */}
				<div className="pb-20">
					<div className="relative w-5 h-5 mx-auto mb-3">
						<div className="absolute inset-0 border-2 border-border rounded-full"></div>
						<div className="absolute inset-0 border-2 border-transparent border-t-white rounded-full animate-spin"></div>
					</div>

					{/* Loading Text */}
					<p className="text-foreground text-sm animate-pulse">
						Loading...
					</p>
				</div>
			</div>
		</div>
	)
}

export default Loading
