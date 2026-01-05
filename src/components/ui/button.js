import * as React from "react"
import { cn } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"

const buttonVariants = ({ variant = "default", size = "default" }) => {
	return cn(
		"inline-flex items-center justify-center p-1 px-5 rounded-3xl font-light font-nunito text-base text-white",
		"bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-700 ease-out group",
		"focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2",
		"disabled:pointer-events-none disabled:opacity-50",
		variant === "ghost" && "bg-transparent hover:bg-white/10",
		size === "sm" && "p-0.5 px-3",
		size === "lg" && "p-2 px-8",
		size === "icon" && "p-2 aspect-square"
	)
}

const Button = React.forwardRef(
	(
		{
			className,
			variant = "default",
			size = "default",
			icon,
			iconFront,
			text,
			loading,
			children,
			disabled,
			...props
		},
		ref
	) => {
		return (
			<button
				className={cn(buttonVariants({ variant, size }), className)}
				ref={ref}
				disabled={disabled || loading}
				{...props}>
				{/* Icon Start */}
				{icon && <span className="text-inherit">{icon}</span>}

				{/* Text or Children */}
				{text ? (
					<span className="mx-1 text-inherit font-light font-nunito">
						{text}
					</span>
				) : (
					children
				)}

				{/* Icon Front */}
				{iconFront && <span className="text-inherit">{iconFront}</span>}

				{/* Loading Spinner */}
				{loading && (
					<div className="flex items-center justify-center ml-2">
						<Spinner />
					</div>
				)}
			</button>
		)
	}
)

Button.displayName = "Button"

export { Button, buttonVariants }
export default Button
