import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Cache: 1 saat
export const revalidate = 3600;

export async function GET() {
  try {
    // Aktif duaları kategorileriyle birlikte getir
    const dualar = await prisma.dua.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      include: {
        kategori: {
          select: {
            ad: true,
            icon: true,
          },
        },
      },
    });

    // Flutter'ın beklediği formata dönüştür
    const formattedDualar = dualar.map((dua, index) => ({
      id: index + 1, // Flutter integer ID bekliyor
      baslik: dua.baslik,
      altBaslik: dua.altBaslik,
      kategori: {
        ad: dua.kategori.ad,
        icon: dua.kategori.icon,
      },
      arapca: dua.arapca,
      okunusu: dua.okunusu,
      meali: dua.meali,
      kaynak: dua.kaynak,
      sesUrl: dua.sesUrl,
    }));

    // Son güncelleme zamanını bul
    const lastUpdated = await prisma.dua.findFirst({
      orderBy: { updatedAt: "desc" },
      select: { updatedAt: true },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          dualar: formattedDualar,
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
    console.error("Dualar API hatası:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Dualar alınamadı",
      },
      { status: 500 }
    );
  }
}
