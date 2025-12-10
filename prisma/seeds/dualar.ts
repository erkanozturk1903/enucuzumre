import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Flutter JSON'dan alınan dualar verisi
const dualarData = {
  dualar: [
    {
      id: 1,
      baslik: "Telbiye Duası",
      altBaslik: "Hac ve Umreye Niyet Ederken Okunan Dua",
      kategori: { ad: "Genel Dua", icon: "fas fa-book-open" },
      arapca: "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لا شَرِيكَ لَكَ",
      okunusu: "Lebbeyk Allahumme lebbeyk, lebbeyk lâ şerîke leke lebbeyk, inne'l-hamde ve'n-ni'mete leke ve'l-mülk, lâ şerîke lek.",
      meali: "Emrine amadeyim Allah'ım, emrine amadeyim! Emrine amadeyim, ortağın yoktur, emrine amadeyim! Şüphesiz hamd, nimet ve mülk senindir, ortağın yoktur!",
      kaynak: "Buhari, Hac, 26",
    },
    {
      id: 2,
      baslik: "İhram Duası",
      altBaslik: "İhrama Girerken Okunan Dua",
      kategori: { ad: "Genel Dua", icon: "fas fa-book-open" },
      arapca: "اللَّهُمَّ إِنِّي أُرِيدُ الْحَجَّ فَيَسِّرْهُ لِي وَتَقَبَّلْهُ مِنِّي",
      okunusu: "Allahumme innî urîdu'l-hacce fe yessirhu lî ve tekabbelhu minnî.",
      meali: "Allah'ım! Ben haccı istiyorum, onu benim için kolaylaştır ve benden kabul et.",
      kaynak: "Müslim, Hac, 147",
    },
    {
      id: 3,
      baslik: "Tavaf Duası",
      altBaslik: "Kabe'yi Tavaf Ederken Okunan Dua",
      kategori: { ad: "Tavaf Duaları", icon: "fas fa-kaaba" },
      arapca: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
      okunusu: "Rabbenâ âtinâ fi'd-dünyâ haseneten ve fi'l-âhirati haseneten ve kinâ azâbe'n-nâr.",
      meali: "Rabbimiz! Bize dünyada iyilik ver, âhirette de iyilik ver ve bizi cehennem azabından koru.",
      kaynak: "Tirmizi, Hac, 84",
    },
    {
      id: 4,
      baslik: "Mültezem Duası",
      altBaslik: "Kabe'nin Kapısı ile Hacerülesved Arası",
      kategori: { ad: "Tavaf Duaları", icon: "fas fa-kaaba" },
      arapca: "اللَّهُمَّ إِنَّ الْبَيْتَ بَيْتُكَ وَالْحَرَمَ حَرَمُكَ وَالأَمْنَ أَمْنُكَ وَهَذَا مَقَامُ الْعَائِذِ بِكَ مِنَ النَّارِ",
      okunusu: "Allahumme inne'l-beyte beytuke ve'l-harame haremuke ve'l-emne emnuke ve hâzâ makâmu'l-âizi bike mine'n-nâr.",
      meali: "Allah'ım! Bu ev senin evindir, bu harem senin haremindir, bu güvenlik senin güvenliğindir ve burası sana cehennemden sığınanın makamıdır.",
      kaynak: "Ebu Davud, Menâsik, 79",
    },
    {
      id: 5,
      baslik: "Safa Tepesi Duası",
      altBaslik: "Safa Tepesinde Okunan Dua",
      kategori: { ad: "Safa-Merve Duaları", icon: "fas fa-mountain" },
      arapca: "لا إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِي وَيُمِيتُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
      okunusu: "Lâ ilâhe illallahu vahdehû lâ şerîke leh, lehu'l-mülkü ve lehu'l-hamdü yuhyî ve yümîtü ve huve alâ külli şey'in kadîr.",
      meali: "Allah'tan başka ilah yoktur, O birdir, ortağı yoktur. Mülk O'nundur, hamd O'na aittir, O diriltir, öldürür ve O her şeye kadirdir.",
      kaynak: "Müslim, Hac, 147",
    },
    {
      id: 6,
      baslik: "Merve Tepesi Duası",
      altBaslik: "Merve Tepesinde Okunan Dua",
      kategori: { ad: "Safa-Merve Duaları", icon: "fas fa-mountain" },
      arapca: "رَبِّ اغْفِرْ وَارْحَمْ وَتَجَاوَزْ عَمَّا تَعْلَمُ إِنَّكَ أَنْتَ الأَعَزُّ الأَكْرَمُ",
      okunusu: "Rabbi'ğfir verhâm ve tecâvez ammâ ta'lemu inneke ente'l-a'azzu'l-ekrem.",
      meali: "Rabbim! Bağışla, merhamet et ve bildiğin (günahlarımı) hoş gör. Şüphesiz sen çok güçlü ve çok cömertsin.",
      kaynak: "Tirmizi, Dualar, 73",
    },
    {
      id: 7,
      baslik: "Arafat Duası",
      altBaslik: "Arafat'ta Vakfe Sırasında Okunan Dua",
      kategori: { ad: "Hac Özel Duaları", icon: "fas fa-hands-praying" },
      arapca: "لا إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
      okunusu: "Lâ ilâhe illallahu vahdehû lâ şerîke leh, lehu'l-mülkü ve lehu'l-hamdü ve huve alâ külli şey'in kadîr.",
      meali: "Allah'tan başka ilah yoktur, O birdir, ortağı yoktur. Mülk O'nundur, hamd O'na aittir ve O her şeye kadirdir.",
      kaynak: "Tirmizi, Hac, 89",
    },
    {
      id: 8,
      baslik: "Müzdelife Duası",
      altBaslik: "Müzdelife'de Konaklarken Okunan Dua",
      kategori: { ad: "Hac Özel Duaları", icon: "fas fa-hands-praying" },
      arapca: "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ",
      okunusu: "Allahumme a'innî alâ zikrike ve şukrike ve husni ibâdetik.",
      meali: "Allah'ım! Seni anmaya, sana şükretmeye ve sana güzel ibadet etmeye bana yardım et.",
      kaynak: "Ebu Davud, Vitr, 26",
    },
    {
      id: 9,
      baslik: "Cemre Duası",
      altBaslik: "Cemrelere Taş Atarken Okunan Dua",
      kategori: { ad: "Hac Özel Duaları", icon: "fas fa-hands-praying" },
      arapca: "اللَّهُ أَكْبَرُ، اللَّهُمَّ اجْعَلْهُ حَجًّا مَبْرُورًا وَذَنْبًا مَغْفُورًا وَسَعْيًا مَشْكُورًا",
      okunusu: "Allahu ekber, Allahumme'c'alhu haccan mebrûran ve zenben mağfûran ve sa'yen meşkûra.",
      meali: "Allah en büyüktür. Allah'ım! Bunu makbul bir hac, bağışlanmış bir günah ve müşkür bir sa'y kıl.",
      kaynak: "İbn Mâce, Menâsik, 84",
    },
    {
      id: 10,
      baslik: "Kurban Duası",
      altBaslik: "Kurban Keserken Okunan Dua",
      kategori: { ad: "Hac Özel Duaları", icon: "fas fa-hands-praying" },
      arapca: "بِسْمِ اللَّهِ، اللَّهُ أَكْبَرُ، اللَّهُمَّ هَذَا مِنْكَ وَلَكَ، اللَّهُمَّ تَقَبَّلْ مِنِّي",
      okunusu: "Bismillah, Allahu ekber, Allahumme hâzâ minke ve lek, Allahumme tekabbel minnî.",
      meali: "Allah'ın adıyla, Allah en büyüktür. Allah'ım! Bu sendendir ve senin içindir. Allah'ım! Benden kabul et.",
      kaynak: "Ebu Davud, Dahâyâ, 19",
    },
    {
      id: 11,
      baslik: "Umre Tamamlama Duası",
      altBaslik: "Umre İbadeti Tamamlandığında Okunan Dua",
      kategori: { ad: "Umre Duaları", icon: "fas fa-star-crescent" },
      arapca: "رَبَّنَا تَمِّمْ لَنَا نُورَنَا وَاغْفِرْ لَنَا إِنَّكَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
      okunusu: "Rabbenâ temmim lenâ nûranâ ve'ğfir lenâ inneke alâ külli şey'in kadîr.",
      meali: "Rabbimiz! Bizim nurumuzu tamamla ve bizi bağışla. Şüphesiz sen her şeye kadirsin.",
      kaynak: "Tahrîm, 66/8",
    },
    {
      id: 12,
      baslik: "Harem-i Şerif'e Giriş Duası",
      altBaslik: "Mescid-i Haram'a Girerken Okunan Dua",
      kategori: { ad: "Genel Dua", icon: "fas fa-book-open" },
      arapca: "أَعُوذُ بِاللَّهِ الْعَظِيمِ وَبِوَجْهِهِ الْكَرِيمِ وَسُلْطَانِهِ الْقَدِيمِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
      okunusu: "A'ûzu billâhi'l-azîmi ve bi vechihil-kerîmi ve sultânihil-kadîmi mine'ş-şeytâni'r-racîm.",
      meali: "Büyük Allah'a, onun kerim yüzüne ve kadim sultanına sığınırım, kovulmuş şeytandan.",
      kaynak: "Ebu Davud, Salât, 19",
    },
  ],
};

export async function seedDualar() {
  console.log("🌱 Dualar seed başlıyor...");

  // 1. Benzersiz kategorileri bul
  const uniqueKategoriler = new Map<string, { ad: string; icon: string }>();
  dualarData.dualar.forEach((dua) => {
    if (!uniqueKategoriler.has(dua.kategori.ad)) {
      uniqueKategoriler.set(dua.kategori.ad, dua.kategori);
    }
  });

  console.log(`  📁 ${uniqueKategoriler.size} kategori bulundu`);

  // 2. Kategorileri oluştur (upsert)
  const kategoriMap = new Map<string, string>(); // ad -> id
  let kategoriOrder = 0;

  for (const [ad, kategori] of uniqueKategoriler) {
    const created = await prisma.duaKategori.upsert({
      where: { ad },
      update: { icon: kategori.icon },
      create: {
        ad,
        icon: kategori.icon,
        order: kategoriOrder++,
      },
    });
    kategoriMap.set(ad, created.id);
    console.log(`  ✓ Kategori: ${ad}`);
  }

  // 3. Duaları oluştur
  console.log(`  📿 ${dualarData.dualar.length} dua yükleniyor...`);

  for (let i = 0; i < dualarData.dualar.length; i++) {
    const dua = dualarData.dualar[i];
    const kategoriId = kategoriMap.get(dua.kategori.ad);

    if (!kategoriId) {
      console.error(`  ❌ Kategori bulunamadı: ${dua.kategori.ad}`);
      continue;
    }

    // Aynı başlıkta dua var mı kontrol et
    const existing = await prisma.dua.findFirst({
      where: { baslik: dua.baslik },
    });

    if (existing) {
      // Güncelle
      await prisma.dua.update({
        where: { id: existing.id },
        data: {
          altBaslik: dua.altBaslik,
          kategoriId,
          arapca: dua.arapca,
          okunusu: dua.okunusu,
          meali: dua.meali,
          kaynak: dua.kaynak,
          order: i,
        },
      });
      console.log(`  ↻ Güncellendi: ${dua.baslik}`);
    } else {
      // Yeni oluştur
      await prisma.dua.create({
        data: {
          baslik: dua.baslik,
          altBaslik: dua.altBaslik,
          kategoriId,
          arapca: dua.arapca,
          okunusu: dua.okunusu,
          meali: dua.meali,
          kaynak: dua.kaynak,
          order: i,
        },
      });
      console.log(`  ✓ Eklendi: ${dua.baslik}`);
    }
  }

  const totalDualar = await prisma.dua.count();
  const totalKategoriler = await prisma.duaKategori.count();

  console.log(`✅ Dualar seed tamamlandı!`);
  console.log(`   Toplam: ${totalKategoriler} kategori, ${totalDualar} dua`);
}

// Direkt çalıştırma
if (require.main === module) {
  seedDualar()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
