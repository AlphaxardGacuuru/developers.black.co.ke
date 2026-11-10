import * as React from "react"
import { useState, useEffect, forwardRef } from "react"
import { cn } from "@/lib/utils"
import { InputWrapper } from "./input-wrapper"

const Select = forwardRef(
	(
		{
			className,
			label,
			error,
			helperText,
			options = [],
			placeholder,
			children,
			...props
		},
		ref
	) => {
		const [hasValue, setHasValue] = useState(false)

		// Check for initial value on mount and when value prop changes
		useEffect(() => {
			if (props.value !== undefined && props.value !== "") {
				setHasValue(true)
			} else if (
				props.defaultValue !== undefined &&
				props.defaultValue !== ""
			) {
				setHasValue(true)
			}
		}, [props.value, props.defaultValue])

		const handleChange = (e) => {
			setHasValue(e.target.value !== "")
			props.onChange?.(e)
		}

		const isActive =
			hasValue ||
			(props.value !== undefined && props.value !== "") ||
			(props.defaultValue !== undefined && props.defaultValue !== "")

		return (
			<div className={cn("relative w-full", className)}>
				<InputWrapper error={error}>
					{({ focused, handleFocus, handleBlur }) => {
						const isActiveWithFocus = focused || isActive

						return (
							<>
								<select
									className={cn(
										"relative flex h-14 w-full rounded-lg border bg-transparent px-4 pt-5 pb-1 text-foreground   text-base transition-all appearance-none cursor-pointer",
										error
											? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
											: "border-border focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10",
										"focus:outline-hidden",
										"disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-foreground/5",
										"[&>option]:bg-gray-900 [&>option]:text-foreground"
									)}
									ref={ref}
									onFocus={(e) => {
										handleFocus(e)
										props.onFocus?.(e)
									}}
									onBlur={(e) => {
										handleBlur(e)
										setHasValue(e.target.value !== "")
										props.onBlur?.(e)
									}}
									onChange={handleChange}
									{...props}>
									<option
										value=""
										disabled
										hidden>
										{placeholder}
									</option>
									{children ||
										options.map((option, index) => (
											<option
												key={index}
												value={option.value}>
												{option.label}
											</option>
										))}
								</select>

								{label && (
									<label
										className={cn(
											"absolute left-4 transition-all duration-200 pointer-events-none   z-10",
											isActiveWithFocus
												? "top-1.5 text-xs text-foreground/60"
												: "top-4 text-base text-foreground/40",
											error && isActiveWithFocus && "text-red-400"
										)}>
										{label}
									</label>
								)}
							</>
						)
					}}
				</InputWrapper>

				{(error || helperText) && (
					<p
						className={cn(
							"mt-1.5 px-4 text-xs  ",
							error ? "text-red-400" : "text-foreground/40"
						)}>
						{error || helperText}
					</p>
				)}
			</div>
		)
	}
)

Select.displayName = "Select"

export { Select }
