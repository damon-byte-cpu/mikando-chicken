"use client"

import { useActionState, useEffect, useState } from "react"
import Image from "next/image"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { updateSettings } from "@/app/actions/settings"
import { UploadButton } from "@/lib/uploadthing"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { SiteSettings } from "@/lib/settings"

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl)
  const [primaryColor, setPrimaryColor] = useState(settings.primaryColor)
  const [accentColor, setAccentColor] = useState(settings.accentColor)
  const [state, formAction, pending] = useActionState(updateSettings, undefined)

  useEffect(() => {
    if (state?.success) toast.success("Settings saved")
    else if (state?.error) toast.error(state.error)
  }, [state])

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <input type="hidden" name="logoUrl" value={logoUrl} />
      <input type="hidden" name="primaryColor" value={primaryColor} />
      <input type="hidden" name="accentColor" value={accentColor} />

      <div className="flex flex-col gap-2">
        <Label htmlFor="siteName">Restaurant name</Label>
        <Input id="siteName" name="siteName" defaultValue={settings.siteName} required />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="phone">Phone number</Label>
        <Input id="phone" name="phone" type="tel" defaultValue={settings.phone} placeholder="+1 555 123 4567" />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Logo</Label>
        <div className="flex items-center gap-4">
          <span className="relative size-16 overflow-hidden rounded-full border border-border bg-muted">
            <Image src={logoUrl || "/logo.png"} alt="Logo preview" fill className="object-contain p-1" />
          </span>
          <UploadButton
            endpoint="logoImage"
            onClientUploadComplete={(res) => {
              if (res?.[0]?.ufsUrl) {
                setLogoUrl(res[0].ufsUrl)
                toast.success("Logo uploaded")
              }
            }}
            onUploadError={(err) => {
              toast.error(err.message)
            }}
            appearance={{ button: "bg-primary text-primary-foreground text-sm" }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="primaryColor">Primary color</Label>
          <div className="flex items-center gap-3">
            <input
              id="primaryColor"
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="size-10 cursor-pointer rounded border border-border bg-transparent"
              aria-label="Primary color"
            />
            <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="font-mono" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="accentColor">Accent color</Label>
          <div className="flex items-center gap-3">
            <input
              id="accentColor"
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="size-10 cursor-pointer rounded border border-border bg-transparent"
              aria-label="Accent color"
            />
            <Input value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="font-mono" />
          </div>
        </div>
      </div>

      <div>
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
          Save settings
        </Button>
      </div>
    </form>
  )
}
