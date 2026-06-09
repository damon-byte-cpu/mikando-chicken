import { getSiteSettings } from "@/lib/settings"
import { SettingsForm } from "@/components/settings-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export default async function SettingsPage() {
  const settings = await getSiteSettings()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Customize your restaurant branding</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Branding</CardTitle>
          <CardDescription>These changes apply to your public menu page.</CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsForm settings={settings} />
        </CardContent>
      </Card>
    </div>
  )
}
