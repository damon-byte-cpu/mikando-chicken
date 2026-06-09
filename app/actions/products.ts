"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().default(""),
  price: z.coerce.number().min(0, "Price must be positive"),
  imageUrl: z.string().url().optional().or(z.literal("")),
  done: z.boolean().optional().default(false),
})

async function requireAuth() {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")
}

export type ProductActionState = { error?: string; success?: boolean } | undefined

export async function createProduct(
  _prev: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  await requireAuth()

  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") ?? "",
    price: formData.get("price"),
    imageUrl: formData.get("imageUrl") ?? "",
    done: formData.get("done") === "on" || formData.get("done") === "true",
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" }
  }

  const { name, description, price, imageUrl, done } = parsed.data
  await prisma.product.create({
    data: { name, description, price, imageUrl: imageUrl || null, done },
  })

  revalidatePath("/")
  revalidatePath("/admin")
  return { success: true }
}

export async function updateProduct(
  _prev: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  await requireAuth()

  const id = String(formData.get("id") ?? "")
  if (!id) return { error: "Missing product id" }

  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") ?? "",
    price: formData.get("price"),
    imageUrl: formData.get("imageUrl") ?? "",
    done: formData.get("done") === "on" || formData.get("done") === "true",
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" }
  }

  const { name, description, price, imageUrl, done } = parsed.data
  await prisma.product.update({
    where: { id },
    data: { name, description, price, imageUrl: imageUrl || null, done },
  })

  revalidatePath("/")
  revalidatePath("/admin")
  return { success: true }
}

export async function deleteProduct(formData: FormData) {
  await requireAuth()
  const id = String(formData.get("id") ?? "")
  if (!id) return
  await prisma.product.delete({ where: { id } })
  revalidatePath("/")
  revalidatePath("/admin")
}

export async function toggleProductDone(formData: FormData) {
  await requireAuth()
  const id = String(formData.get("id") ?? "")
  const done = formData.get("done") === "true"
  if (!id) return
  await prisma.product.update({ where: { id }, data: { done } })
  revalidatePath("/")
  revalidatePath("/admin")
}
