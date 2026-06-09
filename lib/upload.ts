import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { randomUUID } from "crypto"

// ─────────────────────────────────────────────────────────────────────────
// Saves an uploaded image to /public/uploads and returns its public path.
// NOTE: Vercel's serverless filesystem is read-only at runtime, so local
// uploads will NOT persist there. This works locally and on hosts with a
// writable/persistent disk. To deploy on Vercel, swap this for a blob store
// (e.g. Vercel Blob) — only this file needs to change.
// ─────────────────────────────────────────────────────────────────────────

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads")
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"]
const MAX_BYTES = 4 * 1024 * 1024 // 4MB

export async function saveImage(file: File): Promise<string> {
  if (!ALLOWED.includes(file.type)) {
    throw new Error("Unsupported image type. Use JPG, PNG, WEBP, or GIF.")
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Image too large. Maximum size is 4MB.")
  }

  await mkdir(UPLOAD_DIR, { recursive: true })

  const ext = file.name.split(".").pop()?.toLowerCase() || "png"
  const filename = `${randomUUID()}.${ext}`
  const bytes = Buffer.from(await file.arrayBuffer())
  await writeFile(path.join(UPLOAD_DIR, filename), bytes)

  return `/uploads/${filename}`
}
