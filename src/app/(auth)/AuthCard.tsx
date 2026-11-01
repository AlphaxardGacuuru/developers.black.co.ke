import { Braces, Code, FileText, Terminal } from "lucide-react"
import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"

// The auth screen the other Black apps use (gallery's auth-simple-layout):
// a glass card over a soft, animated backdrop.
const AuthCard = ({
	logo,
	children,
}: {
	logo: ReactNode
	children: ReactNode
}) => (
	<div className="relative flex min-h-svh flex-col items-center justify-center gap-6 overflow-hidden bg-primary/5 p-6 md:p-10">
		{/* START: Page Backdrop Elements */}
		<div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
			<div className="absolute -left-40 -top-28 h-80 w-80 rounded-full bg-primary/36 blur-3xl dark:bg-primary/28" />
			<div className="absolute -right-24 top-36 h-96 w-96 rounded-full bg-secondary/70 blur-3xl dark:bg-secondary/35" />
			<div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-foreground/18 blur-3xl dark:bg-foreground/12" />
			<div className="bg-motion-drift bg-motion-delay-1 absolute left-[43%] top-[7%] flex h-20 w-20 -translate-x-1/2 items-center justify-center rounded-[1.75rem] border border-white/60 bg-white/58 text-primary shadow-lg backdrop-blur-sm dark:border-white/20 dark:bg-white/10">
				<Code
					className="size-9"
					strokeWidth={1.5}
				/>
			</div>
			<div className="bg-motion-rotate bg-motion-delay-2 absolute right-[3%] top-[15%] flex h-16 w-16 rotate-12 items-center justify-center rounded-3xl border border-white/60 bg-secondary/85 text-secondary-foreground shadow-lg backdrop-blur-sm dark:border-white/20 dark:bg-secondary/40">
				<Terminal
					className="size-7 -rotate-12"
					strokeWidth={1.5}
				/>
			</div>
			<div className="bg-motion-float bg-motion-delay-3 absolute bottom-[38%] left-[36%] flex h-24 w-24 -rotate-12 items-center justify-center rounded-full border border-white/60 bg-primary/46 text-primary-foreground shadow-lg backdrop-blur-sm dark:border-white/20 dark:bg-primary/34">
				<Braces
					className="size-10 rotate-12"
					strokeWidth={1.5}
				/>
			</div>
			<div className="bg-motion-drift absolute bottom-[12%] right-[20%] flex h-28 w-28 items-center justify-center rounded-[3rem] border border-white/60 bg-secondary/60 text-secondary-foreground shadow-lg backdrop-blur-sm dark:border-white/20 dark:bg-secondary/25">
				<FileText
					className="size-11"
					strokeWidth={1.5}
				/>
			</div>
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,color-mix(in_oklab,var(--primary)_18%,transparent),transparent_35%),radial-gradient(circle_at_88%_14%,color-mix(in_oklab,var(--secondary)_18%,transparent),transparent_40%),linear-gradient(to_bottom,transparent,color-mix(in_oklab,var(--primary)_8%,transparent),transparent)] dark:bg-[radial-gradient(circle_at_12%_10%,color-mix(in_oklab,var(--primary)_22%,transparent),transparent_35%),radial-gradient(circle_at_88%_14%,color-mix(in_oklab,var(--secondary)_22%,transparent),transparent_40%),linear-gradient(to_bottom,transparent,color-mix(in_oklab,var(--primary)_12%,transparent),transparent)]" />
			<div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.75)_1px,transparent_1px)] bg-size-[16px_16px] opacity-[0.12] dark:opacity-[0.05]" />
			<div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(15,23,42,0.1)_0_1px,transparent_1px_12px)] opacity-[0.5] dark:opacity-[0.12]" />
			<div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(15,23,42,0.1)_0_1px,transparent_1px_12px)] opacity-[0.5] dark:opacity-[0.12]" />
		</div>
		{/* END: Page Backdrop Elements */}

		<div className="relative z-10 w-full max-w-md">
			<Card className="gap-0 border-white/55 bg-white/32 py-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_20px_45px_-28px_rgba(15,23,42,0.45)] dark:border-white/20 dark:bg-slate-950/18">
				<CardContent className="flex flex-col gap-8 px-7 sm:px-8">
					<div className="flex justify-center text-primary">{logo}</div>
					{children}
				</CardContent>
			</Card>
		</div>
	</div>
)

export default AuthCard
