import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { label, href, order, isActive, openInNewTab } = body;

    const item = await prisma.menuItem.update({
      where: { id },
      data: {
        label,
        href,
        order,
        isActive,
        openInNewTab,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("Menu item update error:", error);
    return NextResponse.json(
      { error: "Menü öğesi güncellenemedi" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.menuItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Menu item delete error:", error);
    return NextResponse.json(
      { error: "Menü öğesi silinemedi" },
      { status: 500 }
    );
  }
}
