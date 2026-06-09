import Link from "next/link"
import { UtensilsCrossed, Settings, LogOut } from "lucide-react"
import { logoutAction } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/40">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/admin" className="flex items-center gap-2 font-heading font-semibold">
            <UtensilsCrossed className="size-5 text-primary" aria-hidden="true" />
            Menu Admin
          </Link>
          <nav className="flex items-center gap-2">
            <Button render={<Link href="/admin">Products</Link>} variant="ghost" size="sm" />
            <Button
              render={
                <Link href="/admin/settings">
                  <Settings className="size-4" aria-hidden="true" />
                  Settings
                </Link>
              }
              variant="ghost"
              size="sm"
            />
            <Button render={<Link href="/" target="_blank">View site</Link>} variant="ghost" size="sm" />
            <form action={logoutAction}>
              <Button type="submit" variant="outline" size="sm">
                <LogOut className="size-4" aria-hidden="true" />
                Sign out
              </Button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  )
}
