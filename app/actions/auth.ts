"use server"

import { redirect } from "next/navigation"
import { createSession, destroySession, verifyPassword } from "@/lib/auth"

export type LoginState = { error?: string }

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = String(formData.get("password") || "")

  if (!password) {
    return { error: "Please enter the password." }
  }
  if (!process.env.ADMIN_PASSWORD) {
    return { error: "ADMIN_PASSWORD is not set on the server." }
  }
  if (!verifyPassword(password)) {
    return { error: "Incorrect password. Try again." }
  }

  await createSession()
  redirect("/admin")
}

export async function logoutAction() {
  await destroySession()
  redirect("/admin/login")
}
