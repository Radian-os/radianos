import type { Metadata } from "next"
import SignUpForm from "../sign-up"

export const metadata: Metadata = {
	title: "Sign Up — Sandbox Playground",
	description: "Create an account for the Radian OS Sandbox playground.",
}

export default function SignUpPage() {
	return <SignUpForm />
}
