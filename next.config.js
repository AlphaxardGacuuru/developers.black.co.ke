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

	// Experimental features for better performance
	experimental: {
		// Optimize package imports
		optimizePackageImports: [
			"lucide-react",
			"@radix-ui/react-popover",
			"@radix-ui/react-slot",
		],
	},

	// Disable powered by header
	poweredByHeader: false,
}

module.exports = nextConfig
