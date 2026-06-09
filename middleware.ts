import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl

  const isAuthPage = pathname === "/admin/login" || pathname === "/admin/signup"
  const isProtected = pathname.startsWith("/admin") && !isAuthPage

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl))
  }

  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/admin/:path*"],
}
