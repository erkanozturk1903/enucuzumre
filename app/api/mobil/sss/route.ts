import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  try {
    const sssler = await prisma.mobilSSS.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    const data = sssler.map((s, i) => ({
      id: i + 1,
      soru: s.soru,
      cevap: s.cevap,
      icon: s.icon,
    }));

    const lastUpdated = await prisma.mobilSSS.findFirst({
      orderBy: { updatedAt: "desc" },
      select: { updatedAt: true },
    });

    return NextResponse.json(
      { success: true, data: { sss: data }, updatedAt: lastUpdated?.updatedAt?.toISOString() || new Date().toISOString() },
      { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } }
    );
  } catch (error) {
    console.error("SSS API hatası:", error);
    return NextResponse.json({ success: false, error: "SSS'ler alınamadı" }, { status: 500 });
  }
}
