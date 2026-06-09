import { AuthForm } from "@/components/auth-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getSiteSettings } from "@/lib/settings"

export default async function SignupPage() {
  const settings = await getSiteSettings()

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted px-6 py-12">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create admin account</CardTitle>
          <CardDescription>Set up access to {settings.siteName}</CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm mode="signup" />
        </CardContent>
      </Card>
    </main>
  )
}
