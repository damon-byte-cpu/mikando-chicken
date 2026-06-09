"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { isAuthenticated } from "@/lib/auth"
import { saveImage } from "@/lib/upload"
import { CATEGORIES } from "@/config/site"

export type DishState = { error?: string; success?: boolean }

async function requireAuth() {
  if (!(await isAuthenticated())) {
    throw new Error("Not authorized")
  }
}

function parseDishForm(formData: FormData) {
  const name = String(formData.get("name") || "").trim()
  const priceRaw = String(formData.get("price") || "").trim()
  const description = String(formData.get("description") || "").trim()
  const category = String(formData.get("category") || "Main").trim()
  const available = formData.get("available") === "on"

  const errors: string[] = []
  if (!name) errors.push("Name is required.")
  const price = Number(priceRaw)
  if (!priceRaw || Number.isNaN(price) || price < 0) {
    errors.push("Enter a valid price in UGX.")
  }
  if (!CATEGORIES.includes(category as (typeof CATEGORIES)[number])) {
    errors.push("Invalid category.")
  }

  return { name, price: Math.round(price), description, category, available, errors }
}

export async function createDish(
  _prev: DishState,
  formData: FormData,
): Promise<DishState> {
  await requireAuth()
  const { name, price, description, category, available, errors } =
    parseDishForm(formData)
  if (errors.length) return { error: errors.join(" ") }

  let imageUrl: string | null = null
  const image = formData.get("image")
  if (image instanceof File && image.size > 0) {
    try {
      imageUrl = await saveImage(image)
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Image upload failed." }
    }
  }

  await prisma.dish.create({
    data: { name, price, description, category, available, imageUrl },
  })

  revalidatePath("/")
  revalidatePath("/admin")
  return { success: true }
}

export async function updateDish(
  id: number,
  _prev: DishState,
  formData: FormData,
): Promise<DishState> {
  await requireAuth()
  const { name, price, description, category, available, errors } =
    parseDishForm(formData)
  if (errors.length) return { error: errors.join(" ") }

  let imageUrl: string | undefined
  const image = formData.get("image")
  if (image instanceof File && image.size > 0) {
    try {
      imageUrl = await saveImage(image)
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Image upload failed." }
    }
  }

  await prisma.dish.update({
    where: { id },
    data: { name, price, description, category, available, ...(imageUrl ? { imageUrl } : {}) },
  })

  revalidatePath("/")
  revalidatePath("/admin")
  return { success: true }
}

export async function toggleAvailable(id: number, available: boolean) {
  await requireAuth()
  await prisma.dish.update({ where: { id }, data: { available } })
  revalidatePath("/")
  revalidatePath("/admin")
}

export async function deleteDish(id: number) {
  await requireAuth()
  await prisma.dish.delete({ where: { id } })
  revalidatePath("/")
  revalidatePath("/admin")
}
