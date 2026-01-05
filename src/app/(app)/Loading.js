const Loading = () => {
	return (
		<div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-[#232323] to-[#1a1a1a]">
			<div className="text-center">
				{/* Spinner */}
				<div className="relative w-20 h-20 mx-auto mb-6">
					<div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
					<div className="absolute inset-0 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
				</div>

				{/* Loading Text */}
				<p className="text-white text-lg font-light font-nunito animate-pulse">
					Loading...
				</p>
			</div>
		</div>
	)
}

export default Loading
