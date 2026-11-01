"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"

// Gallery's Toaster. This app has no appearance setting, so the theme follows
// the system like the inline appearance script in the root layout.
function Toaster({ ...props }: ToasterProps) {
	return (
		<Sonner
			theme="system"
			className="toaster group"
			position="top-center"
			style={
				{
					"--normal-bg": "var(--popover)",
					"--normal-text": "var(--popover-foreground)",
					"--normal-border": "var(--border)",
				} as React.CSSProperties
			}
			{...props}
		/>
	)
}

export { Toaster }
