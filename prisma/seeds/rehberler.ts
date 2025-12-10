import { PrismaClient, RehberBolum } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

// Bölüm mapping
const BOLUM_MAP: Record<string, RehberBolum> = {
  umre: "UMRE",
  ihram: "IHRAM",
  tavaf: "TAVAF",
  say: "SAY",
  hac: "HAC",
};

export async function seedRehberler() {
  console.log("🌱 Rehberler seed başlıyor...");

  // Flutter JSON'u oku
  const jsonPath = path.join(process.cwd(), "flutter_app/assets/jsons/rehberler.json");
  const jsonData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

  let totalCount = 0;
  let createdCount = 0;
  let updatedCount = 0;

  // Her bölümü işle
  for (const [bolumKey, rehberler] of Object.entries(jsonData.rehberler)) {
    const bolum = BOLUM_MAP[bolumKey];
    if (!bolum) {
      console.log(`  ⚠️ Bilinmeyen bölüm: ${bolumKey}`);
      continue;
    }

    const rehberList = rehberler as any[];
    console.log(`  📁 ${bolumKey.toUpperCase()}: ${rehberList.length} rehber`);

    for (let i = 0; i < rehberList.length; i++) {
      const r = rehberList[i];
      totalCount++;

      // Mevcut rehber var mı kontrol et
      const existing = await prisma.rehber.findUnique({
        where: { slug: r.id },
      });

      const data = {
        slug: r.id,
        baslik: r.baslik,
        altBaslik: r.altBaslik || null,
        bolum,
        kategori: r.kategori || "temel-bilgiler",
        icon: r.icon || "fas fa-book",
        renk: r.renk || "gradient",
        icerik: r.icerik || {},
        order: i,
      };

      if (existing) {
        await prisma.rehber.update({
          where: { id: existing.id },
          data,
        });
        console.log(`    ↻ Güncellendi: ${r.baslik}`);
        updatedCount++;
      } else {
        await prisma.rehber.create({ data });
        console.log(`    ✓ Eklendi: ${r.baslik}`);
        createdCount++;
      }
    }
  }

  const totalRehberler = await prisma.rehber.count();

  console.log(`✅ Rehberler seed tamamlandı!`);
  console.log(`   İşlenen: ${totalCount} | Eklenen: ${createdCount} | Güncellenen: ${updatedCount}`);
  console.log(`   Toplam veritabanında: ${totalRehberler} rehber`);
}

// Direkt çalıştırma
if (require.main === module) {
  seedRehberler()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
