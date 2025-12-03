import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { authConfig } from "@/auth.config"

/**
 * Tam NextAuth konfigürasyonu - Prisma ile
 * API routes ve Server Components bu dosyayı kullanır
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        try {
          const email = credentials?.email as string
          const password = credentials?.password as string

          if (!email || !password) {
            return null
          }

          // Veritabanından kullanıcıyı bul
          const user = await prisma.user.findUnique({
            where: { email }
          })

          if (!user || !user.isActive) {
            return null
          }

          // Şifre kontrolü
          const isValid = await bcrypt.compare(password, user.password)

          if (!isValid) {
            return null
          }

          // Son giriş zamanını güncelle
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
          })

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      }
    })
  ],
})

// Type augmentation for NextAuth v5
declare module "next-auth" {
  interface User {
    role?: string
  }
  interface Session {
    user: {
      id?: string
      role?: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role?: string
    id?: string
  }
}
