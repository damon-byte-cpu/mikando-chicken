"use server"

import { z } from "zod"
import bcrypt from "bcryptjs"
import { AuthError } from "next-auth"
import { prisma } from "@/lib/prisma"
import { signIn, signOut } from "@/lib/auth"

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export type AuthActionState = { error?: string } | undefined

export async function signupAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" }
  }

  const { name, email, password } = parsed.data

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return { error: "An account with this email already exists" }
  }

  const hashed = await bcrypt.hash(password, 10)
  await prisma.user.create({ data: { name, email, password: hashed } })

  try {
    await signIn("credentials", { email, password, redirectTo: "/admin" })
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Account created, but sign-in failed. Try logging in." }
    }
    throw error
  }
}

export async function loginAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "")
  const password = String(formData.get("password") ?? "")

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  try {
    await signIn("credentials", { email, password, redirectTo: "/admin" })
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password" }
    }
    throw error
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/admin/login" })
}
