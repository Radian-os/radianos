"use client"

import React, { useEffect, useRef, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Button } from "@/registry/ui/button"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/registry/ui/form"
import { Input, InputWrapper } from "@/registry/ui/input"
import { Spinner } from "@/registry/ui/spinner"
import { useAuth } from "./auth-context"

const FormSchema = z
	.object({
		firstName: z.string(),
		email: z.string(),
		password: z.string(),
	})
	.superRefine((data, ctx) => {
		if (!data.firstName || data.firstName.trim().length === 0) {
			ctx.addIssue({
				code: "custom",
				message: "First name is required",
				path: ["firstName"],
			})
			return
		}

		if (!data.email || data.email.trim().length === 0) {
			ctx.addIssue({
				code: "custom",
				message: "Email is required",
				path: ["email"],
			})
			return
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(data.email)) {
			ctx.addIssue({
				code: "custom",
				message: "Please enter a valid email address",
				path: ["email"],
			})
			return
		}

		if (!data.password || data.password.trim().length === 0) {
			ctx.addIssue({
				code: "custom",
				message: "Password is required",
				path: ["password"],
			})
			return
		}

		if (data.password.length < 8) {
			ctx.addIssue({
				code: "custom",
				message: "Password must be at least 8 characters long",
				path: ["password"],
			})
			return
		}
	})

export default function SignUpForm() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const { signUp, user } = useAuth()

	const [isLoading, setIsLoading] = useState(false)
	const [serverError, setServerError] = useState<string | null>(null)
	const [showPassword, setShowPassword] = useState(false)
	const inputRef = useRef<HTMLInputElement>(null)

	// Redirect to sandbox if already authenticated
	useEffect(() => {
		if (user) {
			const callbackUrl = searchParams.get("callbackUrl") || "/sandbox"
			router.push(callbackUrl)
		}
	}, [user, router, searchParams])

	function togglePasswordVisibility(e: React.MouseEvent) {
		e.preventDefault()
		e.stopPropagation()
		setShowPassword(!showPassword)
	}

	const IconComponent = showPassword ? <Eye /> : <EyeOff />

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		mode: "onSubmit",
		reValidateMode: "onChange",
		defaultValues: {
			firstName: "",
			email: "",
			password: "",
		},
	})

	const onSubmit = async (data: z.infer<typeof FormSchema>) => {
		setServerError(null)
		setIsLoading(true)

		try {
			const res = await signUp(data.firstName, data.email, data.password)
			if (res.success) {
				toast.success("Account created successfully!")
				const callbackUrl = searchParams.get("callbackUrl") || "/sandbox"
				router.push(callbackUrl)
			} else {
				setServerError(res.error || "Failed to create account")
				toast.error(res.error || "Failed to create account")
			}
		} catch (err) {
			setServerError("Something went wrong. Please try again.")
			toast.error("Something went wrong. Please try again.")
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="bg-bg relative flex min-h-screen w-screen items-center justify-center px-5 py-12">
			<div className="border-border bg-bg w-full max-w-md rounded-2xl border px-6 py-8 shadow-sm">
				<div className="flex flex-1 flex-col gap-6">
					<div className="flex flex-col gap-2">
						<h1 className="heading-5 font-semibold">Sign Up</h1>
						<p className="text-fg-secondary text-sm">
							Already have an account?{" "}
							<Button variant="link" asChild color="primary">
								<Link href="/sandbox/auth/sign-in">Sign in</Link>
							</Button>
						</p>
					</div>

					{serverError && (
						<div className="border-danger/30 bg-danger/10 text-danger rounded-lg border p-3 text-xs">
							{serverError}
						</div>
					)}

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<div className="flex flex-col gap-6">
								<div className="flex flex-col gap-4">
									<FormField
										control={form.control}
										name="firstName"
										render={({ field }) => (
											<FormItem>
												<FormLabel>First Name</FormLabel>
												<FormControl>
													<Input size="36" type="text" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="email"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email Address</FormLabel>
												<FormControl>
													<Input size="36" type="email" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="password"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Password</FormLabel>
												<FormControl>
													<InputWrapper>
														<Input
															{...field}
															id="toggle-visible-password"
															ref={inputRef}
															className="peer"
															type={showPassword ? "text" : "password"}
														/>
														{React.cloneElement(IconComponent, {
															className:
																"hover:text-fg peer-disabled:text-fg-disabled cursor-pointer peer-disabled:pointer-events-none",
															onMouseDown: togglePasswordVisibility,
														})}
													</InputWrapper>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<div className="flex flex-col gap-4">
									<Button className="w-full" type="submit" disabled={isLoading}>
										{isLoading ? (
											<Spinner variant="default" />
										) : (
											"Create account"
										)}
									</Button>
								</div>
							</div>
						</form>
					</Form>
				</div>
			</div>
		</div>
	)
}
