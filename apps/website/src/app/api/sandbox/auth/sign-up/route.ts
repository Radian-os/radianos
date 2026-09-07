import { NextResponse } from "next/server"
import {
	AUTH_COOKIE_NAME,
	createSessionToken,
	ensureUsersTable,
	hashPassword,
} from "@/lib/auth"
import { pool } from "@/lib/db"

export async function POST(request: Request) {
	try {
		await ensureUsersTable()
		const body = await request.json()
		const { firstName, email, password } = body

		if (!firstName || typeof firstName !== "string" || !firstName.trim()) {
			return NextResponse.json(
				{ error: "First name is required" },
				{ status: 400 }
			)
		}

		if (
			!email ||
			typeof email !== "string" ||
			!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
		) {
			return NextResponse.json(
				{ error: "A valid email is required" },
				{ status: 400 }
			)
		}

		if (!password || typeof password !== "string" || password.length < 8) {
			return NextResponse.json(
				{ error: "Password must be at least 8 characters long" },
				{ status: 400 }
			)
		}

		const cleanEmail = email.trim().toLowerCase()
		const cleanFirstName = firstName.trim()

		// Check if user already exists
		const existingUser = await pool.query(
			"SELECT id FROM sandbox_users WHERE LOWER(email) = LOWER($1) LIMIT 1",
			[cleanEmail]
		)

		if (existingUser.rows.length > 0) {
			return NextResponse.json(
				{ error: "An account with this email already exists" },
				{ status: 400 }
			)
		}

		// Hash password and insert
		const { hash, salt } = hashPassword(password)
		const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`

		await pool.query(
			`INSERT INTO sandbox_users (
				id,
				first_name,
				email,
				password_hash,
				salt,
				created_at
			) VALUES ($1, $2, $3, $4, $5, NOW())`,
			[userId, cleanFirstName, cleanEmail, hash, salt]
		)

		const userObj = {
			id: userId,
			firstName: cleanFirstName,
			email: cleanEmail,
		}

		const token = createSessionToken(userObj)

		const response = NextResponse.json(
			{
				success: true,
				user: userObj,
			},
			{ status: 201 }
		)

		// Set HTTP-only session cookie
		response.cookies.set({
			name: AUTH_COOKIE_NAME,
			value: token,
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			path: "/",
			maxAge: 30 * 24 * 60 * 60, // 30 days
		})

		return response
	} catch (error) {
		console.error("Sign up error:", error)
		const details = error instanceof Error ? error.message : String(error)
		return NextResponse.json(
			{ error: "Failed to sign up", details },
			{ status: 500 }
		)
	}
}
