import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  try {
    const kategoriler = await prisma.gorevKategori.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      include: {
        gorevler: {
          where: { isActive: true },
          orderBy: { order: "asc" },
        },
      },
    });

    // Flutter formatına dönüştür
    const data = kategoriler.map((k) => ({
      id: k.slug,
      baslik: k.baslik,
      icon: k.icon,
      renk: k.renk,
      gorevler: k.gorevler.map((g) => ({
        id: g.slug,
        baslik: g.baslik,
        aciklama: g.aciklama,
        oncelik: g.oncelik.toLowerCase(),
        tamamlandi: false,
        hatirlatici: null,
      })),
    }));

    const lastUpdated = await prisma.gorev.findFirst({
      orderBy: { updatedAt: "desc" },
      select: { updatedAt: true },
    });

    return NextResponse.json(
      { success: true, data: { yapilacaklar: { kategoriler: data } }, updatedAt: lastUpdated?.updatedAt?.toISOString() || new Date().toISOString() },
      { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } }
    );
  } catch (error) {
    console.error("Yapılacaklar API hatası:", error);
    return NextResponse.json({ success: false, error: "Yapılacaklar alınamadı" }, { status: 500 });
  }
}
