import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { section, label, href, order, isActive } = body;

    const link = await prisma.footerLink.update({
      where: { id },
      data: {
        section,
        label,
        href,
        order,
        isActive,
      },
    });

    return NextResponse.json(link);
  } catch (error) {
    console.error("Footer link update error:", error);
    return NextResponse.json(
      { error: "Link güncellenemedi" },
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

    await prisma.footerLink.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Footer link delete error:", error);
    return NextResponse.json(
      { error: "Link silinemedi" },
      { status: 500 }
    );
  }
}
