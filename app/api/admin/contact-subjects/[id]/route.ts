import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, order, isActive } = body;

    const subject = await prisma.contactSubject.update({
      where: { id },
      data: {
        name,
        order,
        isActive,
      },
    });

    return NextResponse.json(subject);
  } catch (error) {
    console.error("Contact subject update error:", error);
    return NextResponse.json(
      { error: "Konu güncellenemedi" },
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

    await prisma.contactSubject.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact subject delete error:", error);
    return NextResponse.json(
      { error: "Konu silinemedi" },
      { status: 500 }
    );
  }
}
