import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// GET - Tüm kullanıcıları listele (sadece SUPER_ADMIN)
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
      },
      orderBy: [
        { role: "asc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Users GET error:", error);
    return NextResponse.json(
      { error: "Kullanıcılar yüklenemedi" },
      { status: 500 }
    );
  }
}

// POST - Yeni kullanıcı ekle (sadece SUPER_ADMIN)
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
    }

    const body = await request.json();
    const { email, name, password, role, isActive } = body;

    // Validasyon
    if (!email || !name || !password) {
      return NextResponse.json(
        { error: "Email, ad ve şifre zorunludur" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Şifre en az 6 karakter olmalıdır" },
        { status: 400 }
      );
    }

    // SUPER_ADMIN rolü atanamaz
    if (role === "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Süper Admin rolü atanamaz" },
        { status: 400 }
      );
    }

    // Email kontrolü
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Bu email adresi zaten kullanılıyor" },
        { status: 400 }
      );
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 12);

    // Kullanıcı oluştur
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: role || "ADMIN",
        isActive: isActive ?? true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Users POST error:", error);
    return NextResponse.json(
      { error: "Kullanıcı oluşturulamadı" },
      { status: 500 }
    );
  }
}
