import { cookies } from "next/headers"
import { createHmac, timingSafeEqual } from "crypto"

// ─────────────────────────────────────────────────────────────────────────
// Simple password-based admin auth.
// The single admin password lives in the ADMIN_PASSWORD env var.
// On successful login we set a signed, http-only cookie so the session
// can't be forged from the client.
// ─────────────────────────────────────────────────────────────────────────

const COOKIE_NAME = "mikando_admin"

function getSecret() {
  // Falls back to ADMIN_PASSWORD so a separate secret is optional.
  return process.env.AUTH_SECRET || process.env.ADMIN_PASSWORD || "mikando-dev-secret"
}

// Deterministic token derived from the password + secret.
function makeToken() {
  return createHmac("sha256", getSecret()).update("authenticated").digest("hex")
}

export function verifyPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) return false
  const a = Buffer.from(input)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

export async function createSession() {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, makeToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function destroySession() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return false
  const expected = makeToken()
  const a = Buffer.from(token)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}
