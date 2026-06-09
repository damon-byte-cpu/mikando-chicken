import { prisma } from "@/lib/prisma"
import { siteConfig } from "@/config/site"

export async function getSiteSettings() {
  try {
    const settings = await prisma.siteSettings.upsert({
      where: { id: "default" },
      update: {},
      create: { id: "default" },
    })
    return {
      siteName: settings.siteName || siteConfig.siteName,
      logoUrl: settings.logoUrl || siteConfig.logo,
      phone: settings.phone || siteConfig.phone,
      primaryColor: settings.primaryColor || siteConfig.primaryColor,
      accentColor: settings.accentColor || siteConfig.accentColor,
    }
  } catch {
    // DB unavailable — fall back to static defaults so the app still renders.
    return {
      siteName: siteConfig.siteName,
      logoUrl: siteConfig.logo,
      phone: siteConfig.phone,
      primaryColor: siteConfig.primaryColor,
      accentColor: siteConfig.accentColor,
    }
  }
}

export type SiteSettings = Awaited<ReturnType<typeof getSiteSettings>>
