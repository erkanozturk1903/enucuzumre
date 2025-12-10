import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  try {
    const yerler = await prisma.ziyaretYeri.findMany({
      where: { isActive: true },
      orderBy: [{ sehir: "asc" }, { order: "asc" }],
    });

    // Flutter formatına dönüştür
    const grouped: Record<string, any[]> = { mekke: [], medine: [] };

    yerler.forEach((yer) => {
      const sehirKey = yer.sehir.toLowerCase();
      if (grouped[sehirKey]) {
        grouped[sehirKey].push({
          id: yer.slug,
          baslik: yer.baslik,
          altBaslik: yer.altBaslik,
          kategori: yer.kategori,
          konum: { lat: yer.lat, lng: yer.lng, adres: yer.adres },
          aciklama: yer.aciklama,
          detaylar: {
            ibadethane: yer.ibadethane,
            ziyaretSaatleri: yer.ziyaretSaatleri,
            girisUcreti: yer.girisUcreti,
          },
          resim: yer.resimUrl,
          icon: yer.icon,
        });
      }
    });

    const lastUpdated = await prisma.ziyaretYeri.findFirst({
      orderBy: { updatedAt: "desc" },
      select: { updatedAt: true },
    });

    return NextResponse.json(
      {
        success: true,
        data: { ziyaretYerleri: grouped },
        updatedAt: lastUpdated?.updatedAt?.toISOString() || new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    console.error("Ziyaret yerleri API hatası:", error);
    return NextResponse.json({ success: false, error: "Ziyaret yerleri alınamadı" }, { status: 500 });
  }
}
