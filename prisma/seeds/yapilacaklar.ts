import { PrismaClient, GorevOncelik } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

const ONCELIK_MAP: Record<string, GorevOncelik> = { yuksek: "YUKSEK", orta: "ORTA", dusuk: "DUSUK" };

export async function seedYapilacaklar() {
  console.log("🌱 Yapılacaklar seed başlıyor...");

  const jsonPath = path.join(process.cwd(), "flutter_app/assets/jsons/yapilacaklar.json");
  const jsonData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

  let kategoriCount = 0, gorevCount = 0;

  for (let ki = 0; ki < jsonData.yapilacaklar.kategoriler.length; ki++) {
    const kat = jsonData.yapilacaklar.kategoriler[ki];

    const kategori = await prisma.gorevKategori.upsert({
      where: { slug: kat.id },
      update: { baslik: kat.baslik, icon: kat.icon, renk: kat.renk, order: ki },
      create: { slug: kat.id, baslik: kat.baslik, icon: kat.icon || "fas fa-list", renk: kat.renk || "blue", order: ki },
    });
    console.log(`  📁 ${kat.baslik}: ${kat.gorevler.length} görev`);
    kategoriCount++;

    for (let gi = 0; gi < kat.gorevler.length; gi++) {
      const g = kat.gorevler[gi];
      await prisma.gorev.upsert({
        where: { slug: g.id },
        update: { baslik: g.baslik, aciklama: g.aciklama, oncelik: ONCELIK_MAP[g.oncelik] || "ORTA", kategoriId: kategori.id, order: gi },
        create: { slug: g.id, baslik: g.baslik, aciklama: g.aciklama, oncelik: ONCELIK_MAP[g.oncelik] || "ORTA", kategoriId: kategori.id, order: gi },
      });
      console.log(`    ✓ ${g.baslik}`);
      gorevCount++;
    }
  }

  console.log(`✅ Yapılacaklar seed tamamlandı! ${kategoriCount} kategori, ${gorevCount} görev`);
}

if (require.main === module) {
  seedYapilacaklar().then(() => prisma.$disconnect()).catch((e) => { console.error(e); prisma.$disconnect(); process.exit(1); });
}
