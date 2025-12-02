import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const links = await prisma.footerLink.findMany({
      orderBy: [{ section: "asc" }, { order: "asc" }],
    });
    return NextResponse.json(links);
  } catch (error) {
    console.error("Footer links fetch error:", error);
    return NextResponse.json(
      { error: "Footer linkleri alınamadı" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { section, label, href, order, isActive } = body;

    if (!section || !label || !href) {
      return NextResponse.json(
        { error: "Bölüm, etiket ve link zorunludur" },
        { status: 400 }
      );
    }

    const link = await prisma.footerLink.create({
      data: {
        section,
        label,
        href,
        order: order ?? 0,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(link);
  } catch (error) {
    console.error("Footer link create error:", error);
    return NextResponse.json(
      { error: "Link oluşturulamadı" },
      { status: 500 }
    );
  }
}
