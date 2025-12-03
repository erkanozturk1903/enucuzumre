import type { NextAuthConfig } from "next-auth"

/**
 * Edge Runtime uyumlu NextAuth konfigürasyonu
 * Bu dosya Prisma veya veritabanı importları İÇERMEZ
 * Middleware bu dosyayı kullanır
 */
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isAdminRoute = nextUrl.pathname.startsWith("/admin")
      const isLoginPage = nextUrl.pathname.startsWith("/admin/login")

      // Admin route'a giriş yapmadan erişim engelle
      if (isAdminRoute && !isLoginPage && !isLoggedIn) {
        return false // NextAuth otomatik olarak signIn sayfasına yönlendirir
      }

      // Giriş yapmışsa login sayfasına gitmesin
      if (isLoginPage && isLoggedIn) {
        return Response.redirect(new URL("/admin", nextUrl))
      }

      return true
    },
    jwt({ token, user }) {
      if (user) {
        token.role = user.role as string
        token.id = user.id as string
      }
      return token
    },
    session({ session, token }) {
      if (session.user && token) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    },
  },
  providers: [], // Providers auth.ts'de tanımlanır (Prisma gerektirir)
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  trustHost: true,
}
