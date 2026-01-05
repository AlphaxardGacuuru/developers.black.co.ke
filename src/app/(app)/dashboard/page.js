import Header from "@/app/(app)/Header"

export const metadata = {
	title: `${process.env.NEXT_PUBLIC_APP_NAME || "Black Developers"} - Dashboard`,
}

const Dashboard = () => {
	return (
		<>
			<Header title="Dashboard" />
			<div className="py-12">
				<div className="max-w-7xl mx-auto px-6 lg:px-8">
					<div className="bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden rounded-3xl hover:border-white/20 transition-all duration-700">
						<div className="p-8 text-white">
							<h3 className="text-2xl font-light font-nunito mb-4">
								Welcome Back!
							</h3>
							<p className="text-gray-300 font-light font-nunito">
								You are logged in!
							</p>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default Dashboard
