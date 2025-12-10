import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Cache: 1 saat
export const revalidate = 3600;

export async function GET() {
  try {
    // Aktif rehberleri bölüm ve sıralama ile getir
    const rehberler = await prisma.rehber.findMany({
      where: { isActive: true },
      orderBy: [{ bolum: "asc" }, { order: "asc" }],
    });

    // Flutter'ın beklediği formata dönüştür (bölümlere göre grupla)
    const grouped: Record<string, any[]> = {
      umre: [],
      ihram: [],
      tavaf: [],
      say: [],
      hac: [],
    };

    rehberler.forEach((rehber) => {
      const bolumKey = rehber.bolum.toLowerCase();
      if (grouped[bolumKey]) {
        grouped[bolumKey].push({
          id: rehber.slug,
          baslik: rehber.baslik,
          altBaslik: rehber.altBaslik,
          kategori: rehber.kategori,
          icon: rehber.icon,
          renk: rehber.renk,
          icerik: rehber.icerik,
        });
      }
    });

    // Son güncelleme zamanını bul
    const lastUpdated = await prisma.rehber.findFirst({
      orderBy: { updatedAt: "desc" },
      select: { updatedAt: true },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          rehberler: grouped,
        },
        updatedAt: lastUpdated?.updatedAt?.toISOString() || new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    console.error("Rehberler API hatası:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Rehberler alınamadı",
      },
      { status: 500 }
    );
  }
}
