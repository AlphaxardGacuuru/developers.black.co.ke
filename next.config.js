const withPWA = require("@ducanh2912/next-pwa").default({
	dest: "public",
	cacheOnFrontEndNav: true,
	aggressiveFrontEndNavCaching: true,
	reloadOnOnline: true,
	swcMinify: true,
	disable: process.env.NODE_ENV === "development",
	// The built-in start URL rule has no network timeout, so it's replaced by
	// the "start-url" rule below
	dynamicStartUrl: false,
	extendDefaultRuntimeCaching: true,
	workboxOptions: {
		disableDevLogs: true,
		// After the phone has been idle the first request often stalls instead
		// of failing, which left a blank screen until a reload, so pages fall
		// back to their cached copy if the network hasn't answered in 3 seconds
		runtimeCaching: [
			{
				urlPattern: "/",
				handler: "NetworkFirst",
				options: {
					cacheName: "start-url",
					networkTimeoutSeconds: 3,
					plugins: [
						{
							// Keeps a redirect from the start URL usable offline
							cacheWillUpdate: async ({ response }) =>
								response && response.type === "opaqueredirect"
									? new Response(response.body, {
											status: 200,
											statusText: "OK",
											headers: response.headers,
										})
									: response,
						},
					],
				},
			},
			{
				urlPattern: ({ request, url: { pathname }, sameOrigin }) =>
					request.mode === "navigate" &&
					sameOrigin &&
					!pathname.startsWith("/api/"),
				handler: "NetworkFirst",
				options: {
					cacheName: "navigation",
					networkTimeoutSeconds: 3,
					expiration: {
						maxEntries: 32,
						maxAgeSeconds: 30 * 24 * 60 * 60,
					},
				},
			},
		],
	},
})

/** @type {import('next').NextConfig} */
const nextConfig = {
	// Optimize production builds
	reactStrictMode: true,

	// Enable SWC minification for faster builds
	swcMinify: true,

	// Optimize images
	images: {
		formats: ["image/avif", "image/webp"],
		minimumCacheTTL: 60,
	},

	// Compiler optimizations
	compiler: {
		// Remove console.log in production
		removeConsole:
			process.env.NODE_ENV === "production"
				? {
						exclude: ["error", "warn"],
					}
				: false,
	},

	// Lint runs separately with `npm run lint`, not inside the build, to keep
	// the build within the memory the server has free
	eslint: {
		ignoreDuringBuilds: true,
	},

	// Experimental features for better performance
	experimental: {
		// One build worker, so builds fit in the server's free memory
		cpus: 1,
		// Optimize package imports
		optimizePackageImports: [
			"lucide-react",
			"@radix-ui/react-popover",
			"@radix-ui/react-slot",
		],
	},

	// Disable powered by header
	poweredByHeader: false,

	// Development optimizations
	...(process.env.NODE_ENV === "development" && {
		// Reduce memory usage in development
		onDemandEntries: {
			// Period (in ms) where the server will keep pages in the buffer
			maxInactiveAge: 25 * 1000,
			// Number of pages that should be kept simultaneously
			pagesBufferLength: 2,
		},
	}),
}

module.exports = withPWA(nextConfig)
