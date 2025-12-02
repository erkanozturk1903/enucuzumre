import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.menuItem.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Menu items fetch error:", error);
    return NextResponse.json(
      { error: "Menü öğeleri alınamadı" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { label, href, order, isActive, openInNewTab } = body;

    if (!label || !href) {
      return NextResponse.json(
        { error: "Etiket ve link zorunludur" },
        { status: 400 }
      );
    }

    const item = await prisma.menuItem.create({
      data: {
        label,
        href,
        order: order ?? 0,
        isActive: isActive ?? true,
        openInNewTab: openInNewTab ?? false,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("Menu item create error:", error);
    return NextResponse.json(
      { error: "Menü öğesi oluşturulamadı" },
      { status: 500 }
    );
  }
}
