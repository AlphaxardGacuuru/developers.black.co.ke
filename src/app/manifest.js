export default function manifest() {
	return {
		name: "Black Developers",
		short_name: "BlackDev",
		description: "Black Developers platform",
		start_url: "/",
		display: "standalone",
		background_color: "#232323",
		theme_color: "#232323",
		icons: [
			{
				src: "/android-chrome-192x192.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: "/android-chrome-512x512.png",
				sizes: "512x512",
				type: "image/png",
			},
		],
	}
}
