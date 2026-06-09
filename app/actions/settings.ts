"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

const settingsSchema = z.object({
  siteName: z.string().min(1, "Restaurant name is required"),
  logoUrl: z.string().min(1),
  phone: z.string().optional().default(""),
  primaryColor: z.string().regex(/^#([0-9a-fA-F]{6})$/, "Use a hex color like #b91c1c"),
  accentColor: z.string().regex(/^#([0-9a-fA-F]{6})$/, "Use a hex color like #f59e0b"),
})

export type SettingsActionState = { error?: string; success?: boolean } | undefined

export async function updateSettings(
  _prev: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }

  const parsed = settingsSchema.safeParse({
    siteName: formData.get("siteName"),
    logoUrl: formData.get("logoUrl"),
    phone: formData.get("phone") ?? "",
    primaryColor: formData.get("primaryColor"),
    accentColor: formData.get("accentColor"),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" }
  }

  const data = parsed.data
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: data,
    create: { id: "default", ...data },
  })

  revalidatePath("/")
  revalidatePath("/admin/settings")
  revalidatePath("/admin")
  return { success: true }
}
