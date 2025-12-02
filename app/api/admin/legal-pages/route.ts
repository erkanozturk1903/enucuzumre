import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const pages = await prisma.legalPage.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(pages);
  } catch (error) {
    console.error("Legal pages fetch error:", error);
    return NextResponse.json(
      { error: "Sayfalar alınamadı" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, title, content, isActive } = body;

    if (!slug || !title || !content) {
      return NextResponse.json(
        { error: "Tüm alanlar zorunludur" },
        { status: 400 }
      );
    }

    const page = await prisma.legalPage.create({
      data: {
        slug,
        title,
        content,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(page);
  } catch (error) {
    console.error("Legal page create error:", error);
    return NextResponse.json(
      { error: "Sayfa oluşturulamadı" },
      { status: 500 }
    );
  }
}
