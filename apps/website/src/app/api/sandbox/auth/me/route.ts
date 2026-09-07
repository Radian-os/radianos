import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { pool } from "@/lib/db"

export async function GET() {
	try {
		const session = await getCurrentUser()
		if (!session) {
			return NextResponse.json({ user: null })
		}

		// Verify user still exists in database and get up-to-date details
		const result = await pool.query(
			`SELECT 
				id,
				first_name AS "firstName",
				email
			FROM sandbox_users 
			WHERE id = $1 
			LIMIT 1`,
			[session.userId]
		)

		if (result.rows.length === 0) {
			return NextResponse.json({ user: null })
		}

		return NextResponse.json({ user: result.rows[0] })
	} catch (error) {
		console.error("Get me error:", error)
		return NextResponse.json({ user: null })
	}
}
