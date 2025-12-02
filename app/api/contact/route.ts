import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Lütfen tüm zorunlu alanları doldurun" },
        { status: 400 }
      );
    }

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject,
        message,
      },
    });

    return NextResponse.json(
      { success: true, message: "Mesajınız başarıyla gönderildi", data: contactMessage },
      { status: 201 }
    );
  } catch (error) {
    console.error("İletişim mesajı kaydetme hatası:", error);
    return NextResponse.json(
      { error: "Mesaj gönderilemedi, lütfen tekrar deneyin" },
      { status: 500 }
    );
  }
}
