import crypto from "crypto"
import { cookies } from "next/headers"
import { pool } from "@/lib/db"

export const AUTH_COOKIE_NAME = "sandbox_auth_token"
const AUTH_SECRET =
	process.env.AUTH_SECRET ||
	process.env.SESSION_SECRET ||
	"radian-os-sandbox-auth-secret-key-32chars"

export interface SandboxUserSession {
	userId: string
	firstName: string
	email: string
}

let isUsersTableInitialized = false

export async function ensureUsersTable() {
	if (isUsersTableInitialized) return
	try {
		await pool.query(`
			CREATE TABLE IF NOT EXISTS sandbox_users (
				id TEXT PRIMARY KEY,
				first_name TEXT NOT NULL,
				email TEXT NOT NULL UNIQUE,
				password_hash TEXT NOT NULL,
				salt TEXT NOT NULL,
				created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
			);
			CREATE INDEX IF NOT EXISTS idx_sandbox_users_email ON sandbox_users(email);
		`)
		isUsersTableInitialized = true
	} catch (err) {
		console.error("Failed to auto-ensure sandbox_users table:", err)
	}
}

export function hashPassword(password: string): { hash: string; salt: string } {
	const salt = crypto.randomBytes(16).toString("hex")
	const hash = crypto.scryptSync(password, salt, 64).toString("hex")
	return { hash, salt }
}

export function verifyPassword(
	password: string,
	hash: string,
	salt: string
): boolean {
	try {
		const derivedHash = crypto.scryptSync(password, salt, 64).toString("hex")
		const hashBuf = Buffer.from(hash, "hex")
		const derivedBuf = Buffer.from(derivedHash, "hex")
		if (hashBuf.length !== derivedBuf.length) return false
		return crypto.timingSafeEqual(hashBuf, derivedBuf)
	} catch (e) {
		return false
	}
}

export function createSessionToken(user: {
	id: string
	firstName: string
	email: string
}): string {
	const payload = {
		userId: user.id,
		firstName: user.firstName,
		email: user.email,
		exp: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
	}
	const data = Buffer.from(JSON.stringify(payload)).toString("base64url")
	const signature = crypto
		.createHmac("sha256", AUTH_SECRET)
		.update(data)
		.digest("base64url")
	return `${data}.${signature}`
}

export function verifySessionToken(token: string): SandboxUserSession | null {
	try {
		const [data, signature] = token.split(".")
		if (!data || !signature) return null

		const expectedSignature = crypto
			.createHmac("sha256", AUTH_SECRET)
			.update(data)
			.digest("base64url")

		const sigBuf = Buffer.from(signature)
		const expBuf = Buffer.from(expectedSignature)
		if (sigBuf.length !== expBuf.length) return null
		if (!crypto.timingSafeEqual(sigBuf, expBuf)) return null

		const json = Buffer.from(data, "base64url").toString("utf8")
		const payload = JSON.parse(json)

		if (typeof payload.exp === "number" && payload.exp < Date.now()) {
			return null // Token expired
		}

		if (
			!payload.userId ||
			typeof payload.firstName !== "string" ||
			typeof payload.email !== "string"
		) {
			return null
		}

		return {
			userId: payload.userId,
			firstName: payload.firstName,
			email: payload.email,
		}
	} catch (err) {
		return null
	}
}

export async function getCurrentUser(): Promise<SandboxUserSession | null> {
	try {
		const cookieStore = await cookies()
		const token = cookieStore.get(AUTH_COOKIE_NAME)?.value
		if (!token) return null
		return verifySessionToken(token)
	} catch (err) {
		return null
	}
}
