import { PrismaClient, ZiyaretSehir } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

const SEHIR_MAP: Record<string, ZiyaretSehir> = {
  mekke: "MEKKE",
  medine: "MEDINE",
};

export async function seedZiyaretYerleri() {
  console.log("🌱 Ziyaret Yerleri seed başlıyor...");

  const jsonPath = path.join(process.cwd(), "flutter_app/assets/jsons/ziyaret-yerleri.json");
  const jsonData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

  let totalCount = 0;
  let createdCount = 0;
  let updatedCount = 0;

  for (const [sehirKey, yerler] of Object.entries(jsonData.ziyaretYerleri)) {
    const sehir = SEHIR_MAP[sehirKey];
    if (!sehir) continue;

    const yerList = yerler as any[];
    console.log(`  📍 ${sehirKey.toUpperCase()}: ${yerList.length} yer`);

    for (let i = 0; i < yerList.length; i++) {
      const y = yerList[i];
      totalCount++;

      const existing = await prisma.ziyaretYeri.findUnique({ where: { slug: y.id } });

      const data = {
        slug: y.id,
        baslik: y.baslik,
        altBaslik: y.altBaslik || null,
        sehir,
        kategori: y.kategori || "mescid",
        lat: y.konum?.lat || null,
        lng: y.konum?.lng || null,
        adres: y.konum?.adres || null,
        aciklama: y.aciklama || null,
        ibadethane: y.detaylar?.ibadethane || false,
        ziyaretSaatleri: y.detaylar?.ziyaretSaatleri || null,
        girisUcreti: y.detaylar?.girisUcreti || null,
        resimUrl: y.resim || null,
        icon: y.icon || "fas fa-mosque",
        order: i,
      };

      if (existing) {
        await prisma.ziyaretYeri.update({ where: { id: existing.id }, data });
        console.log(`    ↻ Güncellendi: ${y.baslik}`);
        updatedCount++;
      } else {
        await prisma.ziyaretYeri.create({ data });
        console.log(`    ✓ Eklendi: ${y.baslik}`);
        createdCount++;
      }
    }
  }

  const total = await prisma.ziyaretYeri.count();
  console.log(`✅ Ziyaret Yerleri seed tamamlandı!`);
  console.log(`   İşlenen: ${totalCount} | Eklenen: ${createdCount} | Güncellenen: ${updatedCount}`);
  console.log(`   Toplam veritabanında: ${total} yer`);
}

if (require.main === module) {
  seedZiyaretYerleri()
    .then(async () => { await prisma.$disconnect(); })
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
}
