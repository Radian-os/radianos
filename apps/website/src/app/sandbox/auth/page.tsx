import { redirect } from "next/navigation"

export default function AuthIndexPage() {
	redirect("/sandbox/auth/sign-in")
}
