// ─────────────────────────────────────────────────────────────────────────
// SITE CONFIG — Edit these values to update contact details site-wide.
// The owner can change the menu from the /admin dashboard, but these
// business details live here in code.
// ─────────────────────────────────────────────────────────────────────────

export const siteConfig = {
  name: "Mikando Chicken & Take Away",
  tagline: "Dine-In & Takeaway | Crispy Chips, Juicy Chicken",
  about: "Fast, fresh chicken in the heart of Masaka. Dine in or takeaway.",

  // ▼▼▼ REPLACE PHONE NUMBER HERE ▼▼▼
  // Use full international format without the leading 0 (Uganda = +256).
  phone: "+256704147415", // displayed: 0704 147415
  phoneDisplay: "0704 147415",

  // ▼▼▼ REPLACE WHATSAPP NUMBER HERE ▼▼▼
  // Digits only, country code first, no "+" (wa.me format).
  whatsapp: "256704147415",

  // ▼▼▼ LOCATION / DIRECTIONS ▼▼▼
  address: "Near Prayer Palace Church, Masaka Taxi Park, Mwani, Masaka",
  hours: "Open 24 Hours, Mon–Sun",

  // ▼▼▼ REPLACE GOOGLE MAPS EMBED HERE ▼▼▼
  // Go to Google Maps → search your business → Share → "Embed a map" →
  // copy the URL inside the iframe `src="..."` and paste it below.
  mapEmbedUrl:
    "https://www.google.com/maps?q=Mikando+Chicken+%26+Takeaway+Masaka+Uganda&output=embed",
  // Plain link used by the "Get Directions" button.
  mapLink:
    "https://www.google.com/maps/search/?api=1&query=Mikando+Chicken+%26+Takeaway+Masaka+Uganda",

  // Social links (leave "#" to hide-by-intent or replace with real URLs).
  socials: {
    facebook: "#",
    instagram: "#",
    tiktok: "#",
  },
} as const

export const CATEGORIES = ["Main", "Sides", "Drinks"] as const
export type Category = (typeof CATEGORIES)[number]
