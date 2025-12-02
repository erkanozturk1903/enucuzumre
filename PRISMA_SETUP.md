# Prisma Database Setup - En Ucuz Hac Umre

## 📋 Gereksinimler

- PostgreSQL 14+ kurulu olmalı
- Node.js 18+ 
- npm veya yarn

## 🚀 Kurulum Adımları

### 1. PostgreSQL Veritabanı Oluştur

PostgreSQL'e bağlan ve yeni bir veritabanı oluştur:

\`\`\`bash
# PostgreSQL'e bağlan
psql -U postgres

# Veritabanını oluştur
CREATE DATABASE enucuzhacumre;

# Kullanıcı oluştur (isteğe bağlı)
CREATE USER hacumre_user WITH PASSWORD 'your_secure_password';

# Yetkileri ver
GRANT ALL PRIVILEGES ON DATABASE enucuzhacumre TO hacumre_user;

# Çıkış
\\q
\`\`\`

### 2. Environment Variables Ayarla

Proje kök dizininde \`.env\` dosyasını aç ve DATABASE_URL'i güncelle:

\`\`\`env
DATABASE_URL="postgresql://postgres:password@localhost:5432/enucuzhacumre?schema=public"
\`\`\`

**Önemli:** 
- \`postgres\` → PostgreSQL kullanıcı adınız
- \`password\` → PostgreSQL şifreniz
- \`localhost\` → Sunucu adresi (yerel için localhost)
- \`5432\` → PostgreSQL portu
- \`enucuzhacumre\` → Veritabanı adı

### 3. Prisma Client Oluştur

\`\`\`bash
npx prisma generate
\`\`\`

### 4. İlk Migration'ı Oluştur ve Uygula

\`\`\`bash
# Migration oluştur ve uygula
npx prisma migrate dev --name init

# Veya sadece uygula (production için)
npx prisma migrate deploy
\`\`\`

### 5. Prisma Studio ile Veritabanını İncele (Opsiyonel)

\`\`\`bash
npx prisma studio
\`\`\`

Tarayıcıda \`http://localhost:5555\` adresinde Prisma Studio açılacak.

## 📦 Database Schema

### Models

#### Tour (Tur)
- Tüm tur bilgileri (Hac, Umre, Kudüs, Kültür)
- Fiyat, tarih, kontenjan bilgileri
- Otel detayları ve Kabe mesafesi

#### TourImage
- Tur görselleri (çoklu resim desteği)

#### Itinerary
- Günlük tur programı

#### TourIncluded / TourExcluded
- Fiyata dahil/hariç öğeler

#### SiteSettings
- Global site ayarları (tek satır)
- Hero text, iletişim bilgileri, sosyal medya linkleri

## 🔄 Yaygın Prisma Komutları

\`\`\`bash
# Schema değişikliklerini migration olarak kaydet
npx prisma migrate dev --name aciklama_buraya

# Production migration (downtime olmadan)
npx prisma migrate deploy

# Veritabanını sıfırla (DİKKAT: Tüm veriyi siler!)
npx prisma migrate reset

# Prisma Client'ı yeniden oluştur
npx prisma generate

# Prisma Studio'yu aç
npx prisma studio

# Schema'yı doğrula
npx prisma validate

# Database'i Schema ile senkronize et (geliştirme)
npx prisma db push
\`\`\`

## 🌱 İlk Verileri Ekleme (Seed)

\`prisma/seed.ts\` dosyası oluşturabilir ve seed script'i ekleyebilirsiniz:

\`\`\`typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Site ayarlarını oluştur
  await prisma.siteSettings.upsert({
    where: { id: 'site_settings' },
    update: {},
    create: {
      id: 'site_settings',
      heroTitle: 'Manevi Yolculuğunuz En Uygun Fiyatlarla Başlasın',
      heroSubtitle: 'Hac ve Umre turlarında Türkiye\\'nin en güvenilir karşılaştırma platformu.',
    },
  })

  // Örnek tur ekle
  const tour = await prisma.tour.create({
    data: {
      title: '15 Günlük Ekonomik Umre Turu',
      slug: '15-gunluk-ekonomik-umre-turu',
      description: 'Ekonomik fiyatlarla konforlu umre deneyimi...',
      price: 1250,
      currency: 'USD',
      startDate: new Date('2025-04-10'),
      endDate: new Date('2025-04-25'),
      quota: 40,
      meccaHotel: 'Grand Makkah Hotel',
      medinaHotel: 'Dallah Taibah Hotel',
      hotelStars: 4,
      kaabaDistance: 500,
      isFeatured: true,
      type: 'UMRE',
    },
  })

  console.log('Seed completed!', { tour })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
\`\`\`

Seed'i çalıştır:

\`\`\`bash
npx tsx prisma/seed.ts
# veya package.json'a ekle:
# "prisma": { "seed": "tsx prisma/seed.ts" }
\`\`\`

## 🐛 Sorun Giderme

### "Can't reach database server" hatası
- PostgreSQL'in çalıştığından emin olun: \`brew services list\` (macOS)
- DATABASE_URL'in doğru olduğundan emin olun

### Migration hataları
- Schema'yı kontrol edin: \`npx prisma validate\`
- Gerekirse database'i resetleyin: \`npx prisma migrate reset\`

### Connection limit hataları
- \`lib/prisma.ts\` dosyasında connection pooling doğru yapılandırıldı

## 📚 Daha Fazla Bilgi

- [Prisma Docs](https://www.prisma.io/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)



