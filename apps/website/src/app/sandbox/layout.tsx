import type { ReactNode } from "react"
import { SandboxAuthProvider } from "./auth/auth-context"

export default function SandboxLayout({ children }: { children: ReactNode }) {
	return <SandboxAuthProvider>{children}</SandboxAuthProvider>
}
