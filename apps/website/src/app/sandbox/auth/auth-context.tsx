"use client"

import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react"

export interface SandboxUser {
	id: string
	firstName: string
	email: string
}

interface AuthContextValue {
	user: SandboxUser | null
	isLoading: boolean
	signIn: (
		email: string,
		password: string
	) => Promise<{ success: boolean; error?: string }>
	signUp: (
		firstName: string,
		email: string,
		password: string
	) => Promise<{ success: boolean; error?: string }>
	signOut: () => Promise<void>
	refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function SandboxAuthProvider({
	children,
}: {
	children: React.ReactNode
}) {
	const [user, setUser] = useState<SandboxUser | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	const refreshUser = useCallback(async () => {
		try {
			const res = await fetch("/api/sandbox/auth/me", {
				cache: "no-store",
			})
			if (res.ok) {
				const data = await res.json()
				setUser(data.user || null)
			} else {
				setUser(null)
			}
		} catch (err) {
			console.error("Failed to fetch current user:", err)
			setUser(null)
		} finally {
			setIsLoading(false)
		}
	}, [])

	useEffect(() => {
		refreshUser()
	}, [refreshUser])

	const signIn = async (email: string, password: string) => {
		try {
			const res = await fetch("/api/sandbox/auth/sign-in", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			})
			const data = await res.json()
			if (res.ok && data.success) {
				setUser(data.user)
				return { success: true }
			}
			return { success: false, error: data.error || "Failed to sign in" }
		} catch (err) {
			return {
				success: false,
				error: err instanceof Error ? err.message : "Network error",
			}
		}
	}

	const signUp = async (firstName: string, email: string, password: string) => {
		try {
			const res = await fetch("/api/sandbox/auth/sign-up", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ firstName, email, password }),
			})
			const data = await res.json()
			if (res.ok && data.success) {
				setUser(data.user)
				return { success: true }
			}
			return { success: false, error: data.error || "Failed to sign up" }
		} catch (err) {
			return {
				success: false,
				error: err instanceof Error ? err.message : "Network error",
			}
		}
	}

	const signOut = async () => {
		try {
			await fetch("/api/sandbox/auth/sign-out", { method: "POST" })
		} catch (err) {
			console.error("Failed to sign out:", err)
		} finally {
			setUser(null)
		}
	}

	return (
		<AuthContext.Provider
			value={{
				user,
				isLoading,
				signIn,
				signUp,
				signOut,
				refreshUser,
			}}>
			{children}
		</AuthContext.Provider>
	)
}

export function useAuth(): AuthContextValue {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error("useAuth must be used within a SandboxAuthProvider")
	}
	return context
}
