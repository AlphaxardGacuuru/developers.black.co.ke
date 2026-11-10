"use client"

import type { PropsWithChildren } from "react"
import SettingsLayout from "@/layouts/settings/layout"

export default function Layout({ children }: PropsWithChildren) {
	return <SettingsLayout>{children}</SettingsLayout>
}
