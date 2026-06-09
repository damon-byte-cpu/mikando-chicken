import Image from "next/image"
import Link from "next/link"
import { Phone } from "lucide-react"
import { getProducts } from "@/lib/products"
import { getSiteSettings } from "@/lib/settings"
import { MenuCard } from "@/components/menu-card"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const [products, settings] = await Promise.all([getProducts(), getSiteSettings()])

  return (
    <div
      style={
        {
          "--brand-primary": settings.primaryColor,
          "--brand-accent": settings.accentColor,
        } as React.CSSProperties
      }
      className="min-h-screen bg-background"
    >
      <header
        className="border-b border-border"
        style={{ backgroundColor: "var(--brand-primary)" }}
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-10 text-center text-white sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-4">
            <span className="relative size-14 overflow-hidden rounded-full bg-white/10 ring-1 ring-white/20">
              <Image
                src={settings.logoUrl || "/logo.png"}
                alt={`${settings.siteName} logo`}
                fill
                className="object-contain p-1"
              />
            </span>
            <div>
              <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
                {settings.siteName}
              </h1>
              <p className="text-sm text-white/80">Fresh flavors, made to order</p>
            </div>
          </div>

          {settings.phone && (
            <a
              href={`tel:${settings.phone}`}
              className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/25"
            >
              <Phone className="size-4" aria-hidden="true" />
              {settings.phone}
            </a>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <h2 className="mb-6 font-heading text-xl font-semibold text-foreground">Our Menu</h2>

        {products.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-20 text-center">
            <p className="text-muted-foreground">No menu items yet.</p>
            <Link
              href="/admin"
              className="mt-2 inline-block text-sm font-medium text-primary underline underline-offset-4"
            >
              Add items in the admin dashboard
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <MenuCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {settings.siteName}.{" "}
            <Link href="/admin" className="underline underline-offset-4 hover:text-foreground">
              Admin
            </Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
