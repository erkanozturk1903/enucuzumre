import NextAuth from "next-auth"
import { authConfig } from "@/auth.config"

/**
 * NextAuth v5 Middleware
 * Edge Runtime'da çalışır - Prisma importu YOK
 * authConfig.callbacks.authorized fonksiyonu ile auth kontrolü yapar
 */
export default NextAuth(authConfig).auth

export const config = {
  matcher: ["/admin/:path*"],
}
