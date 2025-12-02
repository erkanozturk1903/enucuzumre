import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { slug, title, content, isActive } = body;

    const page = await prisma.legalPage.update({
      where: { id },
      data: {
        slug,
        title,
        content,
        isActive,
      },
    });

    return NextResponse.json(page);
  } catch (error) {
    console.error("Legal page update error:", error);
    return NextResponse.json(
      { error: "Sayfa güncellenemedi" },
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

    await prisma.legalPage.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Legal page delete error:", error);
    return NextResponse.json(
      { error: "Sayfa silinemedi" },
      { status: 500 }
    );
  }
}
