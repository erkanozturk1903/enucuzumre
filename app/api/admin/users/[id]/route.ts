import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// GET - Tek kullanıcı getir
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
    }

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("User GET error:", error);
    return NextResponse.json(
      { error: "Kullanıcı yüklenemedi" },
      { status: 500 }
    );
  }
}

// PUT - Kullanıcı güncelle
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { email, name, password, role, isActive } = body;

    // Mevcut kullanıcıyı kontrol et
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    // SUPER_ADMIN düzenlenemez
    if (existingUser.role === "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Süper Admin düzenlenemez" },
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

    // Email değiştirildiyse kontrol et
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email },
      });

      if (emailExists) {
        return NextResponse.json(
          { error: "Bu email adresi zaten kullanılıyor" },
          { status: 400 }
        );
      }
    }

    // Güncelleme verisi hazırla
    const updateData: {
      email?: string;
      name?: string;
      password?: string;
      role?: "ADMIN" | "EDITOR";
      isActive?: boolean;
    } = {};

    if (email) updateData.email = email;
    if (name) updateData.name = name;
    if (role) updateData.role = role;
    if (typeof isActive === "boolean") updateData.isActive = isActive;

    // Şifre değiştirilecekse hashle
    if (password && password.length >= 6) {
      updateData.password = await bcrypt.hash(password, 12);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("User PUT error:", error);
    return NextResponse.json(
      { error: "Kullanıcı güncellenemedi" },
      { status: 500 }
    );
  }
}

// DELETE - Kullanıcı sil
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
    }

    const { id } = await params;

    // Mevcut kullanıcıyı kontrol et
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    // SUPER_ADMIN silinemez
    if (existingUser.role === "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Süper Admin silinemez" },
        { status: 400 }
      );
    }

    // Kendini silemez
    if (existingUser.email === session.user.email) {
      return NextResponse.json(
        { error: "Kendinizi silemezsiniz" },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("User DELETE error:", error);
    return NextResponse.json(
      { error: "Kullanıcı silinemedi" },
      { status: 500 }
    );
  }
}
