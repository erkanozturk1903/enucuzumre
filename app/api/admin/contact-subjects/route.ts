import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const subjects = await prisma.contactSubject.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(subjects);
  } catch (error) {
    console.error("Contact subjects fetch error:", error);
    return NextResponse.json(
      { error: "Konular alınamadı" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, order, isActive } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Konu adı zorunludur" },
        { status: 400 }
      );
    }

    const subject = await prisma.contactSubject.create({
      data: {
        name,
        order: order ?? 0,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(subject);
  } catch (error) {
    console.error("Contact subject create error:", error);
    return NextResponse.json(
      { error: "Konu oluşturulamadı" },
      { status: 500 }
    );
  }
}
