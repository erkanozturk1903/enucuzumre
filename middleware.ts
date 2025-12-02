import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Admin route kontrolü
  const isAdminRoute = pathname.startsWith("/admin")
  const isLoginPage = pathname.startsWith("/admin/login")
  const isApiAuthRoute = pathname.startsWith("/api/auth")

  // API auth route'larını bypass et
  if (isApiAuthRoute) {
    return NextResponse.next()
  }

  // Token kontrolü
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  })

  const isLoggedIn = !!token

  // Admin route'a giriş yapmadan erişim engelle
  if (isAdminRoute && !isLoginPage && !isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  // Giriş yapmışsa login sayfasına gitmesin
  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
