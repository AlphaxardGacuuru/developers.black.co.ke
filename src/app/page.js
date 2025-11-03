"use client"

import LoginLinks from "@/app/LoginLinks"
import Link from "next/link"
import ApplicationLogo from "@/components/ApplicationLogo"
import { useState, useEffect } from "react"

const Home = () => {
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
	const [scrollY, setScrollY] = useState(0)

	useEffect(() => {
		const handleMouseMove = (e) => {
			setMousePosition({ x: e.clientX, y: e.clientY })
		}

		const handleScroll = () => {
			setScrollY(window.scrollY)
		}

		window.addEventListener("mousemove", handleMouseMove)
		window.addEventListener("scroll", handleScroll)

		return () => {
			window.removeEventListener("mousemove", handleMouseMove)
			window.removeEventListener("scroll", handleScroll)
		}
	}, [])

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#000000] via-[#1a1a1a] to-[#232323] overflow-x-hidden relative">
			<LoginLinks />

			{/* Animated background gradients */}
			<div className="fixed inset-0 overflow-hidden pointer-events-none">
				<div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-[#232323]/20 to-[#3a3a3a]/30 rounded-full blur-3xl animate-pulse" />
				<div className="absolute top-1/3 -right-40 w-80 h-80 bg-gradient-to-l from-[#3a3a3a]/30 to-[#232323]/20 rounded-full blur-3xl animate-pulse animation-delay-1000" />
				<div className="absolute bottom-20 left-1/4 w-64 h-64 bg-gradient-to-t from-[#4a4a4a]/30 to-[#232323]/20 rounded-full blur-2xl animate-pulse animation-delay-2000" />
			</div>

			{/* Mouse follower gradient - Light Effect */}
			<div
				className="fixed w-[500px] h-[500px] bg-gradient-radial from-white/30 via-blue-200/40 to-transparent rounded-full pointer-events-none blur-3xl transition-all duration-700 ease-out -translate-x-1/2 -translate-y-1/2 z-10"
				style={{
					left: mousePosition.x,
					top: mousePosition.y,
				}}
			/>

			{/* Hero Section */}
			<section className="relative min-h-screen flex items-center justify-center px-6 lg:px-8">
				<div
					className="absolute inset-0 bg-gradient-to-b from-transparent via-[#232323]/10 to-[#232323]/20"
					style={{
						transform: `translateY(${scrollY * 0.5}px)`,
					}}
				/>

				{/* Hero decorative elements */}
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					<div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse" />
					<div className="absolute bottom-32 right-16 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl animate-pulse animation-delay-1000" />
					<div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-400/8 rounded-full blur-xl animate-pulse animation-delay-2000" />
				</div>

				<div className="relative z-10 text-center max-w-6xl mx-auto">
					{/* Company Logo - Clean & Minimal */}
					<div className="mb-5 relative">
						{/* Subtle glow effect behind logo */}
						<div className="absolute inset-0 flex items-center justify-center">
							<div className="w-96 h-32 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-2xl" />
						</div>

						{/* Logo standalone */}
						<div className="relative transform hover:scale-110 transition-all duration-700 ease-out group cursor-pointer">
							<div className="mx-auto w-80 h-20 flex items-center justify-center">
								<div className="text-white opacity-90 group-hover:opacity-100 transition-opacity duration-500 text-3xl">
									<ApplicationLogo />
								</div>
							</div>
						</div>
					</div>

					{/* Main Headlines */}
					<div className="space-y-8 mb-16">
						<div className="relative">
							<h2 className="text-2xl sm:text-3xl lg:text-4xl font-thin text-gray-400 tracking-wide font-nunito">
								Crafting Digital Excellence
							</h2>
							<div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-[#232323] to-transparent" />
						</div>

						{/* Lead Developer Info */}
						<div className="mt-20 p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-700 ease-out group">
							<div className="flex items-center justify-center space-x-4 mb-4">
								<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#232323] to-[#1a1a1a] flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
									<span className="text-lg font-light text-white font-roboto">
										AG
									</span>
								</div>
								<div className="text-left">
									<h3 className="text-xl font-light text-white font-nunito">
										Alphaxard Gacuuru
									</h3>
									<p className="text-[#232323] font-light font-nunito">
										Lead Developer & Founder
									</p>
								</div>
							</div>
							<p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
								Leading a team of exceptional developers to create innovative
								solutions that transform businesses and elevate digital
								experiences.
							</p>
						</div>
					</div>

					{/* CTA Buttons */}
					{/* Scroll indicator */}
					<div className="flex justify-center bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
						<div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center bg-white/20 backdrop-blur-sm">
							<div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse" />
						</div>
					</div>
				</div>
			</section>

			{/* Services Section */}
			<section
				id="services"
				className="py-32 relative bg-gradient-to-b from-[#000000] via-[#1a1a1a] to-[#232323]">
				<div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent" />

				{/* Service section decorative elements */}
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					<div className="absolute top-10 right-20 w-40 h-40 bg-white/20 rounded-full blur-3xl animate-pulse" />
					<div className="absolute bottom-20 left-16 w-56 h-56 bg-blue-400/20 rounded-full blur-3xl animate-pulse animation-delay-1000" />
					<div className="absolute top-1/2 right-1/3 w-32 h-32 bg-purple-400/15 rounded-full blur-2xl animate-pulse animation-delay-2000" />
				</div>

				<div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
					<div className="text-center mb-20">
						<h2 className="text-5xl sm:text-6xl font-extralight text-white mb-6 tracking-tight font-roboto drop-shadow-sm">
							Our{" "}
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-purple-400 font-light">
								Services
							</span>
						</h2>
						<p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light font-nunito">
							We deliver cutting-edge digital solutions that drive innovation
							and transform businesses across industries.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{/* Service 1 */}
						<div className="group relative p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 hover:border-white/40 hover:shadow-2xl hover:shadow-white/10 transition-all duration-700 hover:scale-110 hover:rotate-2">
							<div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/15 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-500" />
							<div className="absolute -inset-1 bg-gradient-to-r from-white/20 via-blue-400/30 to-purple-400/30 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
							<div className="relative z-10">
								<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#232323] to-gray-700 flex items-center justify-center mb-6 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-700 shadow-lg">
									<svg
										className="w-8 h-8 text-white"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
										/>
									</svg>
								</div>
								<h3 className="text-2xl font-light text-white mb-4 font-nunito">
									Full-Stack Development
								</h3>
								<p className="text-gray-300 leading-relaxed mb-6 font-light font-nunito">
									End-to-end web applications with modern frameworks, scalable
									architecture, and exceptional user experiences.
								</p>
								<div className="flex flex-wrap gap-2">
									<span className="px-3 py-1 text-xs font-light bg-[#232323] text-white rounded-full">
										React
									</span>
									<span className="px-3 py-1 text-xs font-light bg-[#232323] text-white rounded-full">
										Next.js
									</span>
									<span className="px-3 py-1 text-xs font-light bg-[#232323] text-white rounded-full">
										Laravel
									</span>
								</div>
							</div>
						</div>

						{/* Service 2 */}
						<div className="group relative p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 hover:border-white/50 transition-all duration-700 hover:scale-105 hover:-rotate-1">
							<div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-500" />
							<div className="relative z-10">
								<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#232323] to-[#1a1a1a] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
									<svg
										className="w-8 h-8 text-white"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
										/>
									</svg>
								</div>
								<h3 className="text-2xl font-light text-white mb-4 font-nunito">
									Mobile Applications
								</h3>
								<p className="text-gray-300 leading-relaxed mb-6 font-light font-nunito">
									Cross-platform mobile solutions with native performance,
									intuitive interfaces, and seamless user experiences.
								</p>
								<div className="flex flex-wrap gap-2">
									<span className="px-3 py-1 text-xs font-light bg-[#232323] text-white rounded-full">
										React Native
									</span>
									<span className="px-3 py-1 text-xs font-light bg-[#232323] text-white rounded-full">
										Flutter
									</span>
									<span className="px-3 py-1 text-xs font-light bg-[#232323] text-white rounded-full">
										Swift
									</span>
								</div>
							</div>
						</div>

						{/* Service 3 */}
						<div className="group relative p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 hover:border-white/50 transition-all duration-700 hover:scale-105 hover:rotate-1">
							<div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-500" />
							<div className="relative z-10">
								<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#232323] to-[#1a1a1a] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
									<svg
										className="w-8 h-8 text-white"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
										/>
									</svg>
								</div>
								<h3 className="text-2xl font-light text-white mb-4 font-nunito">
									Cloud Solutions
								</h3>
								<p className="text-gray-300 leading-relaxed mb-6 font-light font-nunito">
									Scalable cloud infrastructure, DevOps automation, and
									enterprise-grade deployment solutions.
								</p>
								<div className="flex flex-wrap gap-2">
									<span className="px-3 py-1 text-xs font-light bg-[#232323] text-white rounded-full">
										AWS
									</span>
									<span className="px-3 py-1 text-xs font-light bg-[#232323] text-white rounded-full">
										Docker
									</span>
									<span className="px-3 py-1 text-xs font-light bg-[#232323] text-white rounded-full">
										Kubernetes
									</span>
								</div>
							</div>
						</div>

						{/* Service 4 */}
						<div className="group relative p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 hover:border-white/50 transition-all duration-700 hover:scale-105 hover:-rotate-1">
							<div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-500" />
							<div className="relative z-10">
								<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#232323] to-[#1a1a1a] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
									<svg
										className="w-8 h-8 text-white"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M13 10V3L4 14h7v7l9-11h-7z"
										/>
									</svg>
								</div>
								<h3 className="text-2xl font-light text-white mb-4 font-nunito">
									API Development
								</h3>
								<p className="text-gray-300 leading-relaxed mb-6 font-light font-nunito">
									Robust RESTful APIs, GraphQL endpoints, and microservices
									architecture for seamless integrations.
								</p>
								<div className="flex flex-wrap gap-2">
									<span className="px-3 py-1 text-xs font-light bg-[#232323] text-white rounded-full">
										Node.js
									</span>
									<span className="px-3 py-1 text-xs font-light bg-[#232323] text-white rounded-full">
										GraphQL
									</span>
									<span className="px-3 py-1 text-xs font-light bg-[#232323] text-white rounded-full">
										REST
									</span>
								</div>
							</div>
						</div>

						{/* Service 5 */}
						<div className="group relative p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 hover:border-white/50 transition-all duration-700 hover:scale-105 hover:rotate-1">
							<div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-500" />
							<div className="relative z-10">
								<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#232323] to-[#1a1a1a] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
									<svg
										className="w-8 h-8 text-white"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
										/>
									</svg>
								</div>
								<h3 className="text-2xl font-light text-white mb-4 font-nunito">
									UI/UX Design
								</h3>
								<p className="text-gray-300 leading-relaxed mb-6 font-light font-nunito">
									User-centered design, prototyping, and interface development
									that converts visitors into customers.
								</p>
								<div className="flex flex-wrap gap-2">
									<span className="px-3 py-1 text-xs font-light bg-[#232323] text-white rounded-full">
										Figma
									</span>
									<span className="px-3 py-1 text-xs font-light bg-[#232323] text-white rounded-full">
										Adobe XD
									</span>
									<span className="px-3 py-1 text-xs font-light bg-[#232323] text-white rounded-full">
										Tailwind
									</span>
								</div>
							</div>
						</div>

						{/* Service 6 */}
						<div className="group relative p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 hover:border-white/50 transition-all duration-700 hover:scale-105 hover:-rotate-1">
							<div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-500" />
							<div className="relative z-10">
								<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#232323] to-[#1a1a1a] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
									<svg
										className="w-8 h-8 text-white"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
										/>
									</svg>
								</div>
								<h3 className="text-2xl font-light text-white mb-4 font-nunito">
									Technical Consulting
								</h3>
								<p className="text-gray-300 leading-relaxed mb-6 font-light font-nunito">
									Strategic technology guidance, architecture reviews, and
									digital transformation consulting.
								</p>
								<div className="flex flex-wrap gap-2">
									<span className="px-3 py-1 text-xs font-light bg-[#232323] text-white rounded-full">
										Strategy
									</span>
									<span className="px-3 py-1 text-xs font-light bg-[#232323] text-white rounded-full">
										Architecture
									</span>
									<span className="px-3 py-1 text-xs font-light bg-[#232323] text-white rounded-full">
										Scaling
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Portfolio Section */}
			<section
				id="portfolio"
				className="py-32 bg-gradient-to-b from-purple-50/30 via-white to-blue-50/40 relative">
				{/* Portfolio decorative elements */}
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					<div className="absolute top-20 left-10 w-64 h-64 bg-[#232323]/5 rounded-full blur-3xl animate-pulse animate-float" />
					<div className="absolute bottom-32 right-20 w-80 h-80 bg-purple-300/15 rounded-full blur-3xl animate-pulse animation-delay-1000" />
					<div className="absolute top-1/2 left-1/3 w-40 h-40 bg-blue-300/20 rounded-full blur-2xl animate-pulse animation-delay-2000" />
				</div>

				<div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
					<div className="text-center mb-20">
						<h2 className="text-5xl sm:text-6xl font-extralight text-[#232323] mb-6 tracking-tight font-roboto drop-shadow-sm">
							Latest{" "}
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-[#232323] to-blue-600 font-light">
								Work
							</span>
						</h2>
						<p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light font-nunito">
							Discover our recent projects that showcase innovation, technical
							excellence, and transformative digital solutions.
						</p>
					</div>
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
						{/* Project 1 */}
						<div className="group relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur-xl border border-[#232323]/20 hover:border-[#232323]/50 transition-all duration-700 hover:scale-105">
							<div className="aspect-video bg-gradient-to-br from-[#232323] to-[#1a1a1a] relative overflow-hidden">
								<div className="absolute inset-0 bg-gradient-to-br from-[#232323]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
								<div className="absolute inset-0 flex items-center justify-center">
									<div className="w-24 h-24 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
										<svg
											className="w-12 h-12 text-white"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
											/>
										</svg>
									</div>
								</div>
							</div>
							<div className="p-8">
								<div className="flex items-center gap-2 mb-4">
									<span className="px-3 py-1 text-xs font-light bg-[#232323] text-white rounded-full">
										E-Commerce
									</span>
									<span className="px-3 py-1 text-xs font-light bg-[#3a3a3a] text-white rounded-full">
										Full-Stack
									</span>
								</div>
								<h3 className="text-2xl font-light text-[#232323] mb-4 font-nunito">
									Enterprise E-Commerce Platform
								</h3>
								<p className="text-gray-300 leading-relaxed mb-6">
									Complete e-commerce solution with advanced inventory
									management, payment processing, analytics dashboard, and
									multi-vendor support. Built with modern technologies for
									scalability and performance.
								</p>
								<div className="flex items-center justify-between">
									<div className="flex -space-x-2">
										<div className="w-8 h-8 rounded-full bg-[#232323] border-2 border-black flex items-center justify-center text-xs text-white font-light font-nunito">
											R
										</div>
										<div className="w-8 h-8 rounded-full bg-[#3a3a3a] border-2 border-black flex items-center justify-center text-xs text-white font-light font-nunito">
											N
										</div>
										<div className="w-8 h-8 rounded-full bg-[#4a4a4a] border-2 border-black flex items-center justify-center text-xs text-white font-light font-nunito">
											L
										</div>
									</div>
									<button className="text-[#232323] hover:text-white transition-colors font-light font-nunito">
										View Case Study →
									</button>
								</div>
							</div>
						</div>

						{/* Project 2 */}
						<div className="group relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur-xl border border-[#232323]/20 hover:border-[#232323]/50 transition-all duration-700 hover:scale-105">
							<div className="aspect-video bg-gradient-to-br from-[#232323] to-[#1a1a1a] relative overflow-hidden">
								<div className="absolute inset-0 bg-gradient-to-br from-[#232323]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
								<div className="absolute inset-0 flex items-center justify-center">
									<div className="w-24 h-24 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
										<svg
											className="w-12 h-12 text-white"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
											/>
										</svg>
									</div>
								</div>
							</div>
							<div className="p-8">
								<div className="flex items-center gap-2 mb-4">
									<span className="px-3 py-1 text-xs font-light bg-[#232323] text-white rounded-full">
										Mobile
									</span>
									<span className="px-3 py-1 text-xs font-light bg-[#3a3a3a] text-white rounded-full">
										Cross-Platform
									</span>
								</div>
								<h3 className="text-2xl font-light text-[#232323] mb-4 font-nunito">
									Healthcare Management App
								</h3>
								<p className="text-gray-300 leading-relaxed mb-6">
									Revolutionary healthcare management system with patient
									portals, appointment scheduling, telemedicine integration, and
									real-time health monitoring. HIPAA compliant and secure.
								</p>
								<div className="flex items-center justify-between">
									<div className="flex -space-x-2">
										<div className="w-8 h-8 rounded-full bg-[#232323] border-2 border-black flex items-center justify-center text-xs text-white font-light font-nunito">
											RN
										</div>
										<div className="w-8 h-8 rounded-full bg-[#3a3a3a] border-2 border-black flex items-center justify-center text-xs text-white font-light font-nunito">
											F
										</div>
										<div className="w-8 h-8 rounded-full bg-[#4a4a4a] border-2 border-black flex items-center justify-center text-xs text-white font-light font-nunito">
											A
										</div>
									</div>
									<button className="text-[#232323] hover:text-white transition-colors font-light font-nunito">
										View Case Study →
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Contact Section */}
			<section
				id="contact"
				className="py-32 bg-gradient-to-b from-[#232323]/20 to-[#232323]">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="text-center mb-20">
						<h2 className="text-5xl sm:text-6xl font-extralight text-white mb-6 tracking-tight font-roboto">
							Let's Build{" "}
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-white font-thin">
								Together
							</span>
						</h2>
						<p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light font-nunito">
							Ready to transform your ideas into reality? Let's discuss your
							next project and create something extraordinary.
						</p>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
						{/* Contact Info */}
						<div className="space-y-8">
							<div className="group p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-500">
								<div className="flex items-center space-x-4 mb-4">
									<div className="w-12 h-12 rounded-2xl bg-[#232323] flex items-center justify-center">
										<svg
											className="w-6 h-6 text-white"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
											/>
										</svg>
									</div>
									<div>
										<h3 className="text-lg font-light font-nunito text-white">
											Email Us
										</h3>
										<p className="text-gray-400">alphaxardgacuuru@gmail.com</p>
									</div>
								</div>
							</div>

							<div className="group p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-500">
								<div className="flex items-center space-x-4 mb-4">
									<div className="w-12 h-12 rounded-2xl bg-[#232323] flex items-center justify-center">
										<svg
											className="w-6 h-6 text-white"
											fill="currentColor"
											viewBox="0 0 24 24">
											<path
												fillRule="evenodd"
												d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
												clipRule="evenodd"></path>
										</svg>
									</div>
									<div>
										<h3 className="text-lg font-light font-nunito text-white">
											GitHub
										</h3>
										<p className="text-gray-400">@AlphaxardGacuuru</p>
									</div>
								</div>
							</div>

							<div className="group p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-500">
								<div className="flex items-center space-x-4 mb-4">
									<div className="w-12 h-12 rounded-2xl bg-[#232323] flex items-center justify-center">
										<svg
											className="w-6 h-6 text-white"
											fill="currentColor"
											viewBox="0 0 24 24">
											<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
										</svg>
									</div>
									<div>
										<h3 className="text-lg font-light font-nunito text-white">
											LinkedIn
										</h3>
										<p className="text-gray-400">Connect with us</p>
									</div>
								</div>
							</div>
						</div>

						{/* CTA Card */}
						<div className="relative">
							<div className="absolute inset-0 bg-gradient-to-br from-[#232323] to-[#1a1a1a] rounded-3xl transform rotate-3" />
							<div className="relative p-12 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20">
								<h3 className="text-3xl font-light font-nunito text-white mb-6">
									Ready to Start?
								</h3>
								<p className="text-gray-300 mb-8 leading-relaxed">
									Whether you need a complete digital transformation, a custom
									application, or technical consulting, we're here to help bring
									your vision to life.
								</p>
								<div className="space-y-4">
									<Link
										href="mailto:alphaxardgacuuru@gmail.com"
										className="block w-full px-8 py-4 bg-white text-[#232323] rounded-2xl font-light font-nunito text-center hover:bg-gray-100 transition-colors text-lg">
										Start Your Project
									</Link>
									<Link
										href="#services"
										className="block w-full px-8 py-4 border-2 border-white text-white rounded-2xl font-light font-nunito text-center hover:bg-white hover:text-[#232323] transition-colors text-lg">
										View Our Services
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-[#232323] border-t border-white/10">
				<div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
						<div className="md:col-span-2">
							<div className="flex items-center space-x-4 mb-6">
								<div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white to-gray-300 flex items-center justify-center">
									<span className="text-lg font-light text-[#232323] font-roboto">
										BD
									</span>
								</div>
								<div>
									<h3 className="text-2xl font-light text-white font-nunito">
										Black Developers
									</h3>
									<p className="text-gray-400">Crafting Digital Excellence</p>
								</div>
							</div>
							<p className="text-gray-300 leading-relaxed max-w-md">
								Led by Alphaxard Gacuuru, we're a team of passionate developers
								creating innovative digital solutions that transform businesses
								and elevate user experiences.
							</p>
						</div>

						<div>
							<h4 className="text-white font-light font-nunito mb-4">
								Services
							</h4>
							<ul className="space-y-2 text-gray-400">
								<li>
									<a
										href="#"
										className="hover:text-white transition-colors">
										Full-Stack Development
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-white transition-colors">
										Mobile Applications
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-white transition-colors">
										Cloud Solutions
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-white transition-colors">
										Technical Consulting
									</a>
								</li>
							</ul>
						</div>

						<div>
							<h4 className="text-white font-light font-nunito mb-4">
								Connect
							</h4>
							<ul className="space-y-2 text-gray-400">
								<li>
									<a
										href="#"
										className="hover:text-white transition-colors">
										GitHub
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-white transition-colors">
										LinkedIn
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-white transition-colors">
										Twitter
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-white transition-colors">
										Email
									</a>
								</li>
							</ul>
						</div>
					</div>

					<div className="border-t border-white/10 mt-12 pt-8 text-center">
						<p className="text-gray-400">
							&copy; 2024 Black Developers. All rights reserved. | Designed &
							Developed by Alphaxard Gacuuru
						</p>
					</div>
				</div>
			</footer>
		</div>
	)
}

export default Home
