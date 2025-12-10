import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

function generateSlug(soru: string): string {
  return soru.toLowerCase().replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50);
}

export async function seedMobilSSS() {
  console.log("🌱 Mobil SSS seed başlıyor...");

  const jsonPath = path.join(process.cwd(), "flutter_app/assets/jsons/sss.json");
  const jsonData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

  let count = 0;

  for (let i = 0; i < jsonData.sss.length; i++) {
    const s = jsonData.sss[i];
    const slug = generateSlug(s.soru);

    await prisma.mobilSSS.upsert({
      where: { slug },
      update: { soru: s.soru, cevap: s.cevap, kategori: "hac", icon: s.icon || "fas fa-question-circle", order: i },
      create: { slug, soru: s.soru, cevap: s.cevap, kategori: "hac", icon: s.icon || "fas fa-question-circle", order: i },
    });
    console.log(`  ✓ ${s.soru}`);
    count++;
  }

  console.log(`✅ Mobil SSS seed tamamlandı! ${count} soru`);
}

if (require.main === module) {
  seedMobilSSS().then(() => prisma.$disconnect()).catch((e) => { console.error(e); prisma.$disconnect(); process.exit(1); });
}
