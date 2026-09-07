import { NextResponse } from "next/server"
import {
	AUTH_COOKIE_NAME,
	createSessionToken,
	ensureUsersTable,
	verifyPassword,
} from "@/lib/auth"
import { pool } from "@/lib/db"

export async function POST(request: Request) {
	try {
		await ensureUsersTable()
		const body = await request.json()
		const { email, password } = body

		if (
			!email ||
			typeof email !== "string" ||
			!password ||
			typeof password !== "string"
		) {
			return NextResponse.json(
				{ error: "Email and password are required" },
				{ status: 400 }
			)
		}

		const cleanEmail = email.trim().toLowerCase()

		const userResult = await pool.query(
			`SELECT 
				id,
				first_name AS "firstName",
				email,
				password_hash AS "passwordHash",
				salt
			FROM sandbox_users 
			WHERE LOWER(email) = LOWER($1) 
			LIMIT 1`,
			[cleanEmail]
		)

		if (userResult.rows.length === 0) {
			return NextResponse.json(
				{ error: "Invalid email or password" },
				{ status: 401 }
			)
		}

		const user = userResult.rows[0]
		const isValid = verifyPassword(password, user.passwordHash, user.salt)

		if (!isValid) {
			return NextResponse.json(
				{ error: "Invalid email or password" },
				{ status: 401 }
			)
		}

		const userObj = {
			id: user.id,
			firstName: user.firstName,
			email: user.email,
		}

		const token = createSessionToken(userObj)

		const response = NextResponse.json(
			{
				success: true,
				user: userObj,
			},
			{ status: 200 }
		)

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
		console.error("Sign in error:", error)
		const details = error instanceof Error ? error.message : String(error)
		return NextResponse.json(
			{ error: "Failed to sign in", details },
			{ status: 500 }
		)
	}
}
