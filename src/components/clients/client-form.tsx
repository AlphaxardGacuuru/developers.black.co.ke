import { ArrowLeft } from "lucide-react"
import type { FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link } from "@/components/ui/link"
import { Spinner } from "@/components/ui/spinner"

export type ClientFields = {
	name: string
	email: string
	phone: string
}

export type ClientErrors = Partial<Record<keyof ClientFields, string>>

type Props = {
	values: ClientFields
	onChange: (values: ClientFields) => void
	errors: ClientErrors
	loading: boolean
	submitLabel: string
	emailRequired?: boolean
	onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

/** The client fields shared by the create and edit pages. */
export function ClientForm({
	values,
	onChange,
	errors,
	loading,
	submitLabel,
	emailRequired = false,
	onSubmit,
}: Props) {
	return (
		<form
			onSubmit={onSubmit}
			className="space-y-6">
			{/* Client Details Section Start */}
			<div className="grid gap-6 sm:grid-cols-2">
				{/* Name Start */}
				<Input
					label="Name"
					id="name"
					name="name"
					value={values.name}
					onChange={(event) => onChange({ ...values, name: event.target.value })}
					required
					error={errors.name}
				/>
				{/* Name End */}

				{/* Email Start */}
				<Input
					label="Email"
					id="email"
					type="email"
					name="email"
					value={values.email}
					onChange={(event) => onChange({ ...values, email: event.target.value })}
					required={emailRequired}
					error={errors.email}
				/>
				{/* Email End */}
			</div>

			<div className="grid gap-6 sm:grid-cols-2">
				{/* Phone Start */}
				<Input
					label="Phone"
					id="phone"
					type="tel"
					name="phone"
					value={values.phone}
					onChange={(event) => onChange({ ...values, phone: event.target.value })}
					error={errors.phone}
				/>
				{/* Phone End */}
			</div>
			{/* Client Details Section End */}

			{/* Form Actions Section Start */}
			<div className="flex justify-between">
				<Button
					variant="outline"
					asChild>
					<Link
						href="/clients"
						variant="unstyled"
						size="none">
						<ArrowLeft className="size-4" />
						Back to Clients
					</Link>
				</Button>

				<Button
					type="submit"
					disabled={loading}>
					{submitLabel}
					{loading && <Spinner />}
				</Button>
			</div>
			{/* Form Actions Section End */}
		</form>
	)
}
