import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

// The other Black apps' button (gallery's ui/button), plus this app's
// text/icon/iconFront/loading shorthands.
const btnVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive capitalize cursor-pointer",
	{
		variants: {
			variant: {
				default: "bg-primary text-secondary shadow-xs hover:bg-primary/90",
				destructive:
					"bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
				outline:
					"border border-primary text-primary shadow-xs hover:bg-primary hover:text-primary-foreground",
				secondary:
					"bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
				ghost: "hover:bg-accent hover:text-accent-foreground",
				link: "text-primary underline-offset-4 hover:underline",
				glass:
					"text-card-foreground rounded-xl border border-white/50 bg-transparent shadow-md backdrop-blur-xl backdrop-saturate-150 dark:border-white/16 dark:bg-transparent hover:backdrop-blur-3xl hover:shadow-xs",
			},
			size: {
				default: "h-9 px-4 py-2 has-[>svg]:px-3",
				sm: "h-8 rounded-md px-3 has-[>svg]:px-2.5",
				lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
				icon: "size-9",
				"icon-sm": "size-8",
				"icon-lg": "size-10",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	}
)

type BtnProps = React.ComponentProps<"button"> &
	VariantProps<typeof btnVariants> & {
		asChild?: boolean
		text?: React.ReactNode
		icon?: React.ReactNode
		iconFront?: React.ReactNode
		loading?: boolean
	}

const Btn = React.forwardRef<HTMLButtonElement, BtnProps>(
	(
		{
			className,
			variant = "default",
			size = "default",
			asChild = false,
			text,
			icon,
			iconFront,
			loading,
			children,
			...props
		},
		ref
	) => {
		const Comp = asChild ? Slot : "button"

		return (
			<Comp
				ref={ref}
				data-slot="button"
				data-variant={variant}
				data-size={size}
				disabled={loading || props.disabled}
				className={cn(btnVariants({ variant, size, className }))}
				{...props}>
				{asChild ? (
					// Slot takes exactly one child, so the extras are left out
					children
				) : (
					<>
						{loading && (
							<div className="size-4 animate-spin rounded-full border-2 border-current/30 border-t-current" />
						)}
						{!loading && icon && <span className="text-inherit">{icon}</span>}
						{text ? <span className="text-inherit">{text}</span> : children}
						{!loading && iconFront && (
							<span className="text-inherit">{iconFront}</span>
						)}
					</>
				)}
			</Comp>
		)
	}
)

Btn.displayName = "Btn"

export { Btn, Btn as Button, btnVariants }
export default Btn
