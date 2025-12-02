# Frontend - Database Integration

## 🎯 Genel Bakış

Frontend, artık tamamen veritabanına bağlı ve gerçek verilerle çalışıyor!

## ✅ Tamamlanan Entegrasyonlar

### 1. **Hero Section** (Ana Sayfa)
- ✅ `heroTitle` → SiteSettings'ten çekiliyor
- ✅ `heroSubtitle` → SiteSettings'ten çekiliyor
- ✅ Server Component'e dönüştürüldü
- ✅ Search Box → Client Component olarak ayrıldı

**Dosyalar:**
- `components/hero-section.tsx` (Server)
- `components/hero-search-box.tsx` (Client)

### 2. **Featured Tours** (Öne Çıkan Turlar)
- ✅ `isFeatured: true` olan turları gösteriyor
- ✅ Maksimum 6 tur listeleniyor
- ✅ İlk görseller dahil
- ✅ Eğer hiç tur yoksa section gizleniyor
- ✅ Server Component'e dönüştürüldü

**Dosyalar:**
- `components/featured-tours.tsx` (Server)
- `components/tour-card.tsx` (Güncellendi - DB verileriyle uyumlu)

### 3. **Footer** (Alt Bilgi)
- ✅ İletişim bilgileri → SiteSettings'ten
- ✅ Sosyal medya linkleri → SiteSettings'ten
- ✅ TÜRSAB Belge No → SiteSettings'ten
- ✅ Footer metni → SiteSettings'ten
- ✅ Server Component'e dönüştürüldü
- ✅ Newsletter → Client Component olarak ayrıldı

**Dosyalar:**
- `components/footer.tsx` (Server)
- `components/footer-newsletter.tsx` (Client)

### 4. **Tour Detail Page** (Tur Detay Sayfası)
- ✅ Slug'a göre tur çekiliyor
- ✅ Tüm ilişkili veriler dahil:
  - Images (Görseller)
  - Itinerary (Tur Programı)
  - TourIncluded (Dahil Olanlar)
  - TourExcluded (Dahil Olmayanlar)
- ✅ Aktif olmayan turlar gösterilmiyor
- ✅ Tur bulunamazsa 404 sayfası

**Dosyalar:**
- `app/turlar/[slug]/page.tsx` (Server)
- `app/turlar/[slug]/not-found.tsx` (404)

### 5. **404 Page** (Tur Bulunamadı)
- ✅ Modern ve kullanıcı dostu tasarım
- ✅ Ana sayfaya ve tur listesine yönlendirme
- ✅ Popüler arama önerileri

**Dosya:**
- `app/turlar/[slug]/not-found.tsx`

## 🗄️ Veritabanı İlişkileri

### Kullanılan Prisma Queries

#### Hero Section
```typescript
await prisma.siteSettings.findUnique({
  where: { id: "site_settings" }
});
```

#### Featured Tours
```typescript
await prisma.tour.findMany({
  where: {
    isFeatured: true,
    isActive: true,
  },
  include: {
    images: { take: 1, orderBy: { order: 'asc' } }
  },
  orderBy: { createdAt: 'desc' },
  take: 6
});
```

#### Tour Detail
```typescript
await prisma.tour.findUnique({
  where: { slug, isActive: true },
  include: {
    images: { orderBy: { order: 'asc' } },
    itinerary: { orderBy: { dayNumber: 'asc' } },
    included: { orderBy: { order: 'asc' } },
    excluded: { orderBy: { order: 'asc' } },
  }
});
```

## 🧪 Test Senaryosu

### Adım 1: Site Ayarlarını Yapılandır

1. `http://localhost:3000/admin/login` → Giriş yap
2. **"Site Ayarları"** → Tıkla
3. Hero başlık ve alt başlığını güncelle
4. İletişim bilgilerini doldur
5. Sosyal medya linklerini ekle
6. **"Kaydet"**

### Adım 2: İlk Turunu Oluştur

1. `http://localhost:3000/admin/turlar` → **"Yeni Tur Ekle"**
2. **Tab 1 - Genel:**
   - Başlık: "15 Günlük Ramazan Umresi"
   - Tip: Umre
   - Fiyat: 2500 USD
   - Tarih: İlerideki bir tarih seç
   - **"Öne Çıkan Tur"** ✅ işaretle
   - **"Aktif"** ✅ işaretle

3. **Tab 2 - Detaylar:**
   - Mekke Oteli: "Hilton Makkah"
   - Medine Oteli: "Pullman Zamzam"
   - Kabe'ye Uzaklık: 500
   - Açıklama: Güzel bir açıklama yaz

4. **Tab 3 - Program:**
   - 3-4 gün ekle
   - Her gün için başlık ve açıklama

5. **Tab 4 - Dahil/Hariç:**
   - Dahil: Uçak bileti, vize, konaklama, rehberlik
   - Hariç: Kişisel harcamalar

6. **Tab 5 - Görseller:**
   - URL: `https://picsum.photos/seed/umre1/800/600`
   - URL: `https://picsum.photos/seed/umre2/800/600`

7. **"Kaydet"** → ✅ Başarı mesajı

### Adım 3: Ana Sayfayı Test Et

1. `http://localhost:3000` → Ana sayfaya git
2. ✅ Hero başlığının güncellendiğini gör
3. ✅ Öne çıkan turlar bölümünde yeni turunu gör
4. ✅ Footer'da iletişim bilgilerini kontrol et

### Adım 4: Tur Detay Sayfasını Test Et

1. Tur kartına tıkla
2. ✅ Tüm bilgilerin doğru geldiğini kontrol et
3. ✅ Görsellerin göründüğünü doğrula
4. ✅ Tur programını incele
5. ✅ Booking card'ı kontrol et

### Adım 5: 404 Sayfasını Test Et

1. `http://localhost:3000/turlar/olmayan-tur` → Git
2. ✅ 404 sayfasının göründüğünü doğrula
3. ✅ "Ana Sayfaya Dön" butonunun çalıştığını test et

## 📊 Component Yapısı

### Server Components (RSC)
- `components/hero-section.tsx`
- `components/featured-tours.tsx`
- `components/footer.tsx`
- `app/turlar/[slug]/page.tsx`

### Client Components
- `components/hero-search-box.tsx`
- `components/footer-newsletter.tsx`
- `components/tour-card.tsx`
- `components/tour-detail/*` (tüm bileşenler)

## 🚀 Performans Optimizasyonları

### Veritabanı
- ✅ Sadece gerekli alanlar çekiliyor (`include`)
- ✅ Sıralama veritabanı seviyesinde (`orderBy`)
- ✅ Limit kullanımı (`take`)
- ✅ Index'ler tanımlı (Prisma schema)

### Next.js
- ✅ Server Components (SEO friendly)
- ✅ Image optimization (`next/image`)
- ✅ Automatic code splitting

## 🔒 Güvenlik

- ✅ Sadece aktif turlar gösteriliyor (`isActive: true`)
- ✅ SQL injection koruması (Prisma ORM)
- ✅ Try-catch blokları
- ✅ Fallback değerler

## 🐛 Sorun Giderme

### Hero Section boş görünüyor
**Çözüm:** Admin panelden site ayarlarını kaydet.

### Turlar görünmüyor
**Çözüm:** 
1. Admin panelden en az 1 tur oluştur
2. "Öne Çıkan Tur" ve "Aktif" işaretle
3. Ana sayfayı yenile

### Görseller yüklenmiyor
**Çözüm:**
1. `next.config.ts`'de `unoptimized: true` var mı kontrol et
2. `picsum.photos` URL'lerini kullan
3. Dev server'ı yeniden başlat

### Tur detay sayfası 404 veriyor
**Çözüm:**
1. Turun slug'ının doğru olduğunu kontrol et
2. Turun "Aktif" olduğundan emin ol
3. Veritabanı bağlantısını test et

## 📝 Sonraki Adımlar

- [ ] Arama fonksiyonu (Hero search box)
- [ ] Filtreleme (fiyat, tarih, tip)
- [ ] Sayfalama (pagination)
- [ ] Rezervasyon formu (Server Action)
- [ ] Newsletter kayıt (Server Action)
- [ ] SEO meta tags (generateMetadata)
- [ ] OpenGraph images
- [ ] Sitemap.xml
- [ ] robots.txt

## ✨ Özet

Artık frontend tamamen dinamik ve veritabanına bağlı! Admin panelden yapılan tüm değişiklikler anında sitede yansıyor.

**Test et ve keyfini çıkar! 🚀**



