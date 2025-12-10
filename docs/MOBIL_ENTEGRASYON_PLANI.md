# Mobil Uygulama - Admin Panel Entegrasyon Planı

## Genel Bakış

Bu doküman, Flutter mobil uygulamasındaki tüm içeriklerin (dualar, rehberler, ziyaret yerleri, yapılacaklar, SSS) web admin panelinden yönetilebilir hale getirilmesi ve aynı içeriklerin web sitesinde de gösterilmesi için gerekli adımları detaylandırır.

**Toplam Modül Sayısı:** 5 ana modül + 1 dashboard
**Tahmini Süre:** 10-15 iş günü

---

# MODÜL 1: DUALAR

## Mevcut Durum (Flutter JSON)
```json
{
  "id": 1,
  "baslik": "Telbiye Duası",
  "altBaslik": "Hac ve Umreye Niyet Ederken",
  "kategori": { "ad": "Genel Dua", "icon": "fas fa-book-open" },
  "arapca": "لَبَّيْكَ اللَّهُمَّ...",
  "okunusu": "Lebbeyk Allahumme...",
  "meali": "Emrine amadeyim Allah'ım...",
  "kaynak": "Buhari, Hac, 26"
}
```

**Kategoriler:** Genel Dua, Tavaf Duaları, Safa-Merve Duaları, Hac Özel Duaları, Umre Duaları
**Toplam Dua:** 12 adet

---

## Phase D1: Prisma Schema (Dualar) ✅ TAMAMLANDI

### Görevler
- [x] DuaKategori modeli oluştur (ad, icon, order, isActive, dualar relation)
- [x] Dua modeli oluştur (baslik, altBaslik, kategoriId, arapca, okunusu, meali, kaynak, sesUrl, order, isActive)
- [x] İlişkileri tanımla (onDelete: Cascade)
- [x] npx prisma db push (başarılı - 88ms)
- [x] npx prisma generate (başarılı - 69ms)

### Prisma Kodu
```prisma
model DuaKategori {
  id        String   @id @default(cuid())
  ad        String   @unique
  icon      String   @default("fas fa-book-open")
  order     Int      @default(0)
  isActive  Boolean  @default(true)
  dualar    Dua[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([order])
}

model Dua {
  id          String      @id @default(cuid())
  baslik      String
  altBaslik   String?
  kategoriId  String
  kategori    DuaKategori @relation(fields: [kategoriId], references: [id], onDelete: Cascade)
  arapca      String      @db.Text
  okunusu     String      @db.Text
  meali       String      @db.Text
  kaynak      String?
  sesUrl      String?
  order       Int         @default(0)
  isActive    Boolean     @default(true)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  @@index([kategoriId])
  @@index([order])
}
```

---

## Phase D2: Admin Panel - Dua Listesi ✅ TAMAMLANDI

### Dosya: `/app/admin/mobil/dualar/page.tsx`

### Görevler
- [x] Dua listesi tablosu oluştur
- [x] Kategori filtreleme dropdown'u ekle
- [x] Arama fonksiyonu ekle
- [x] Sıralama (ok butonları ile yukarı/aşağı)
- [x] Düzenle/Sil butonları
- [x] Aktif/Pasif toggle (Check ikonu ile)
- [x] "Yeni Dua Ekle" butonu
- [x] Kategori özet badge'leri (dua sayısı ile)
- [x] Kategori silme (boş kategoriler için)

### UI Bileşenleri
```
┌─────────────────────────────────────────────────────────────┐
│  Dualar Yönetimi                          [+ Yeni Dua Ekle] │
├─────────────────────────────────────────────────────────────┤
│  Filtre: [Tüm Kategoriler ▼]  Ara: [________________]       │
├─────────────────────────────────────────────────────────────┤
│  #  │ Başlık          │ Kategori     │ Durum  │ İşlemler    │
│  ↕1 │ Telbiye Duası   │ Genel Dua    │ ✓ Aktif│ [✎] [🗑]   │
│  ↕2 │ Tavaf Duası     │ Tavaf Duaları│ ✓ Aktif│ [✎] [🗑]   │
│  ...                                                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase D3: Admin Panel - Dua Form ✅ TAMAMLANDI

### Dosya: `/app/admin/mobil/dualar/page.tsx` (inline modal)

### Görevler
- [x] Modal olarak form oluştur (max-w-2xl, max-h-90vh overflow scroll)
- [x] Kategori seçici dropdown
- [x] Yeni kategori ekleme modalı (ayrı modal)
- [x] Arapça metin alanı (RTL desteği, dir="rtl", font-arabic class)
- [x] Okunuşu textarea
- [x] Meali textarea
- [x] Kaynak input
- [x] Ses dosyası URL (opsiyonel)
- [x] Form validasyonu (required alanlar)
- [x] Edit mode için isActive checkbox

### Form Alanları
```
┌─────────────────────────────────────────────────────────────┐
│  Dua Ekle / Düzenle                                         │
├─────────────────────────────────────────────────────────────┤
│  Başlık *:        [________________________]                │
│  Alt Başlık:      [________________________]                │
│  Kategori *:      [Genel Dua ▼] [+ Yeni Kategori]          │
│                                                             │
│  Arapça *:        ┌──────────────────────────┐             │
│  (RTL)            │ لَبَّيْكَ اللَّهُمَّ...   │             │
│                   └──────────────────────────┘             │
│                                                             │
│  Okunuşu *:       ┌──────────────────────────┐             │
│                   │ Lebbeyk Allahumme...     │             │
│                   └──────────────────────────┘             │
│                                                             │
│  Meali *:         ┌──────────────────────────┐             │
│                   │ Emrine amadeyim Allah'ım │             │
│                   └──────────────────────────┘             │
│                                                             │
│  Kaynak:          [Buhari, Hac, 26___________]             │
│  Ses URL:         [https://..._______________]             │
│                                                             │
│                            [İptal]  [Kaydet]               │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase D4: Admin Actions ✅ TAMAMLANDI

### Dosya: `/app/admin/mobil/dualar/actions.ts`

### Görevler
- [x] getDualar(kategoriId?) - Tüm duaları getir (opsiyonel kategori filtresi)
- [x] getDuaById(id) - Tek dua getir
- [x] createDua(formData) - Yeni dua oluştur (auto order)
- [x] updateDua(id, formData) - Dua güncelle
- [x] deleteDua(id) - Dua sil
- [x] reorderDualar(updates) - Sıralama güncelle
- [x] toggleDuaActive(id, isActive) - Aktiflik değiştir
- [x] getKategoriler() - Kategorileri getir (_count ile dua sayısı)
- [x] createKategori(formData) - Yeni kategori (duplicate kontrolü)
- [x] updateKategori(id, formData) - Kategori güncelle
- [x] deleteKategori(id) - Kategori sil (ilişkili dua varsa engelle)

---

## Phase D5: API Endpoint ✅ TAMAMLANDI

### Dosya: `/app/api/mobil/dualar/route.ts`

### Görevler
- [x] GET endpoint oluştur
- [x] Aktif duaları kategorileriyle birlikte döndür
- [x] Response formatını Flutter'a uygun yap (integer id, nested kategori)
- [x] Cache header ekle (s-maxage=3600, stale-while-revalidate=86400)
- [x] updatedAt timestamp ekle (son güncellenen dua)
- [x] revalidate = 3600 (1 saat)

### Response Format
```json
{
  "success": true,
  "data": {
    "dualar": [
      {
        "id": 1,
        "baslik": "Telbiye Duası",
        "altBaslik": "Hac ve Umreye Niyet Ederken",
        "kategori": { "ad": "Genel Dua", "icon": "fas fa-book-open" },
        "arapca": "...",
        "okunusu": "...",
        "meali": "...",
        "kaynak": "...",
        "sesUrl": null
      }
    ]
  },
  "updatedAt": "2024-12-10T12:00:00Z"
}
```

---

## Phase D6: Seed Script (Dualar) ✅ TAMAMLANDI

### Dosya: `/prisma/seeds/dualar.ts`

### Görevler
- [x] Flutter JSON'dan kategorileri çıkar (5 benzersiz kategori)
- [x] Kategorileri veritabanına ekle (upsert ile)
- [x] Duaları kategorileriyle eşleştir (kategoriMap)
- [x] Veritabanına ekle (12 dua)
- [x] Duplicate kontrolü (baslik ile findFirst, varsa update)
- [x] Çalıştırma: `npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seeds/dualar.ts`

### Seed Sonuçları
```
✅ 5 kategori: Genel Dua, Tavaf Duaları, Safa-Merve Duaları, Hac Özel Duaları, Umre Duaları
✅ 12 dua başarıyla yüklendi
```

---

## Phase D7: Web Sayfası

### Dosya: `/app/(main)/dualar/page.tsx`

### Görevler
- [ ] Dua listesi sayfası oluştur
- [ ] Kategori filtreleme
- [ ] Arama fonksiyonu
- [ ] Accordion veya kart görünümü
- [ ] Arapça font desteği (RTL)
- [ ] SEO meta tags
- [ ] Header menüye ekle

---

## Phase D8: Flutter Entegrasyonu

### Görevler
- [ ] ApiService'e getDualar() metodu ekle
- [ ] DuaRepository'yi API destekli yap
- [ ] Hive cache implementasyonu
- [ ] Offline fallback (mevcut JSON)
- [ ] Pull-to-refresh
- [ ] Loading state

---

# MODÜL 2: REHBERLER

## Mevcut Durum (Flutter JSON)
```json
{
  "umre": [
    {
      "id": "umre-nedir",
      "baslik": "Umre Nedir?",
      "altBaslik": "Umrenin tanımı ve fazileti",
      "icon": "fas fa-question-circle",
      "renk": "gradient",
      "icerik": {
        "giris": "Umre, belirli şartlar...",
        "tanim": "...",
        "rukun": ["İhram", "Tavaf", "Sa'y", "Tıraş"],
        "onem": "...",
        "faziletler": [...],
        "hadisler": [...]
      }
    }
  ],
  "ihram": [...],
  "tavaf": [...],
  "say": [...],
  "hac": [...]
}
```

**Kategoriler:** umre, ihram, tavaf, say, hac
**İçerik Yapısı:** Dinamik JSON (giris, tanim, rukun, onem, faziletler, hadisler, adimlar vb.)

---

## Phase R1: Prisma Schema (Rehberler) ✅ TAMAMLANDI

### Görevler
- [x] RehberBolum enum oluştur (UMRE, IHRAM, TAVAF, SAY, HAC)
- [x] Rehber modeli oluştur (slug, baslik, altBaslik, bolum, kategori, icon, renk, icerik Json)
- [x] JSON içerik alanı ekle (dinamik içerik: giris, tanim, adimlar, hadisler vb.)
- [x] npx prisma db push (başarılı - 68ms)
- [x] npx prisma generate (başarılı - 70ms)

### Prisma Kodu
```prisma
model RehberKategori {
  id          String    @id @default(cuid())
  slug        String    @unique  // "umre", "hac", "ihram", "tavaf", "say"
  baslik      String              // "Umre Rehberi", "Hac Rehberi" vb.
  aciklama    String?
  icon        String    @default("fas fa-book")
  order       Int       @default(0)
  isActive    Boolean   @default(true)
  rehberler   Rehber[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([order])
}

model Rehber {
  id            String          @id @default(cuid())
  slug          String          @unique
  baslik        String
  altBaslik     String?
  kategoriId    String
  kategori      RehberKategori  @relation(fields: [kategoriId], references: [id], onDelete: Cascade)
  icon          String          @default("fas fa-book")
  renk          String          @default("gradient")
  icerik        Json            @db.JsonB       // Dinamik içerik
  order         Int             @default(0)
  isActive      Boolean         @default(true)
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt

  @@index([kategoriId])
  @@index([order])
}
```

---

## Phase R2: Admin Panel - Rehber Listesi

### Dosya: `/app/admin/mobil/rehberler/page.tsx`

### Görevler
- [ ] Tab yapısı (Umre | İhram | Tavaf | Sa'y | Hac)
- [ ] Her tab'da rehber listesi
- [ ] Sıralama fonksiyonu
- [ ] Düzenle/Sil butonları
- [ ] "Yeni Rehber Ekle" butonu
- [ ] Kategori yönetimi (ayarlar modalı)

### UI Bileşenleri
```
┌─────────────────────────────────────────────────────────────┐
│  Rehberler Yönetimi                      [+ Yeni Rehber]    │
├─────────────────────────────────────────────────────────────┤
│  [Umre] [İhram] [Tavaf] [Sa'y] [Hac]     [⚙ Kategoriler]   │
├─────────────────────────────────────────────────────────────┤
│  UMRE REHBERLERİ (5 adet)                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ ↕ Umre Nedir?                              [✎] [🗑] │    │
│  │   Umrenin tanımı ve fazileti                        │    │
│  └─────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ ↕ Umre Nasıl Yapılır?                      [✎] [🗑] │    │
│  │   Adım adım umre rehberi                            │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase R3: Admin Panel - Rehber Form (Dinamik İçerik Editörü)

### Dosya: `/app/admin/mobil/rehberler/components/RehberForm.tsx`

### Görevler
- [ ] Temel bilgiler formu (başlık, alt başlık, kategori, icon, renk)
- [ ] Dinamik içerik builder
- [ ] İçerik blok tipleri:
  - [ ] Giriş metni (giris)
  - [ ] Tanım (tanim)
  - [ ] Liste (rukun, faziletler, adimlar)
  - [ ] Hadis listesi (hadisler)
  - [ ] Önem metni (onem)
  - [ ] Kaynak (kaynak)
- [ ] Blok ekleme/silme/sıralama
- [ ] JSON önizleme
- [ ] Validasyon

### Dinamik İçerik Builder UI
```
┌─────────────────────────────────────────────────────────────┐
│  Rehber İçeriği                            [+ Blok Ekle ▼]  │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐    │
│  │ [Giriş Metni]                              [↕] [🗑] │    │
│  │ ┌─────────────────────────────────────────────────┐ │    │
│  │ │ Umre, belirli şartlar dahilinde...              │ │    │
│  │ └─────────────────────────────────────────────────┘ │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ [Liste: Rükünler]                          [↕] [🗑] │    │
│  │ Başlık: [Umrenin Rükünleri_______]                  │    │
│  │ • İhram                                    [🗑]     │    │
│  │ • Tavaf                                    [🗑]     │    │
│  │ • Sa'y                                     [🗑]     │    │
│  │ • Tıraş                                    [🗑]     │    │
│  │                               [+ Madde Ekle]        │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ [Hadisler]                                 [↕] [🗑] │    │
│  │ ┌───────────────────────────────────────────────┐   │    │
│  │ │ Hadis: "Umre, diğer umreye kadar..."          │   │    │
│  │ │ Kaynak: Buhari, Umre, 1                       │   │    │
│  │ └───────────────────────────────────────────────┘   │    │
│  │                               [+ Hadis Ekle]        │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Blok Tipleri Enum
```typescript
type IcerikBlokTipi =
  | 'giris'      // Giriş metni (string)
  | 'tanim'      // Tanım (string)
  | 'onem'       // Önem açıklaması (string)
  | 'kaynak'     // Kaynak referans (string)
  | 'liste'      // Basit liste (string[])
  | 'rukun'      // Rükünler listesi (string[])
  | 'faziletler' // Faziletler listesi (string[])
  | 'adimlar'    // Adımlar listesi ({baslik, aciklama}[])
  | 'hadisler'   // Hadis listesi ({metin, kaynak}[])
  | 'uyarilar'   // Uyarılar listesi (string[])
```

---

## Phase R4: Admin Actions (Rehberler)

### Dosya: `/app/admin/mobil/rehberler/actions.ts`

### Görevler
- [ ] getRehberler(kategoriSlug?) - Rehberleri getir
- [ ] getRehberById(id) - Tek rehber
- [ ] createRehber(formData) - Yeni rehber
- [ ] updateRehber(id, formData) - Güncelle
- [ ] deleteRehber(id) - Sil
- [ ] reorderRehberler(kategoriId, updates) - Sırala
- [ ] getKategoriler() - Kategorileri getir
- [ ] createKategori(formData) - Yeni kategori
- [ ] updateKategori(id, formData) - Kategori güncelle
- [ ] deleteKategori(id) - Kategori sil

---

## Phase R5: API Endpoint (Rehberler)

### Dosya: `/app/api/mobil/rehberler/route.ts`

### Response Format
```json
{
  "success": true,
  "data": {
    "rehberler": {
      "umre": [
        {
          "id": "umre-nedir",
          "baslik": "Umre Nedir?",
          "altBaslik": "...",
          "icon": "fas fa-question-circle",
          "renk": "gradient",
          "icerik": { ... }
        }
      ],
      "ihram": [...],
      "tavaf": [...],
      "say": [...],
      "hac": [...]
    }
  },
  "updatedAt": "2024-12-10T12:00:00Z"
}
```

---

## Phase R6: Seed Script (Rehberler)

### Dosya: `/prisma/seeds/rehberler.ts`

### Görevler
- [ ] 5 kategori oluştur (umre, ihram, tavaf, say, hac)
- [ ] Her kategorideki rehberleri parse et
- [ ] icerik JSON'unu doğrudan aktar
- [ ] Slug'ları oluştur
- [ ] Veritabanına ekle

---

## Phase R7: Web Sayfaları (Rehberler)

### Dosyalar
```
app/(main)/rehberler/
├── page.tsx              # Kategori kartları
├── umre/page.tsx         # Umre rehberleri
├── hac/page.tsx          # Hac rehberleri
├── ihram/page.tsx        # İhram bilgileri
├── tavaf/page.tsx        # Tavaf bilgileri
└── say/page.tsx          # Sa'y bilgileri
```

### Görevler
- [ ] Ana sayfa: 5 kategori kartı
- [ ] Kategori sayfası: Rehber listesi (accordion)
- [ ] Dinamik içerik render komponenti
- [ ] SEO meta tags
- [ ] Breadcrumb navigation
- [ ] Header menüye ekle

---

## Phase R8: Flutter Entegrasyonu

### Görevler
- [ ] ApiService'e getRehberler() ekle
- [ ] RehberRepository'yi API destekli yap
- [ ] Kategori bazlı cache
- [ ] Offline fallback

---

# MODÜL 3: ZİYARET YERLERİ

## Mevcut Durum (Flutter JSON)
```json
{
  "ziyaret_yerleri": {
    "mekke": [
      {
        "id": "mescid-i-haram",
        "baslik": "Mescid-i Haram",
        "altBaslik": "Kabe'nin bulunduğu kutsal mescit",
        "kategori": "mescid",
        "lat": 21.4225,
        "lng": 39.8262,
        "adres": "Mekke, Suudi Arabistan",
        "aciklama": "İslam'ın en kutsal mekanı...",
        "ibadethane": true,
        "ziyaretSaatleri": "24 saat açık",
        "girisUcreti": "Ücretsiz",
        "resim": "assets/images/mescid_haram.jpg",
        "icon": "fas fa-mosque",
        "favori": true
      }
    ],
    "medine": [...]
  }
}
```

**Şehirler:** Mekke (4 yer), Medine (4 yer)
**Kategoriler:** mescid, magara, dag, kuyu, tarihi

---

## Phase Z1: Prisma Schema (Ziyaret Yerleri)

### Görevler
- [ ] ZiyaretSehir enum oluştur
- [ ] ZiyaretYeri modeli oluştur
- [ ] Koordinat alanları (lat, lng)
- [ ] npx prisma db push

### Prisma Kodu
```prisma
enum ZiyaretSehir {
  MEKKE
  MEDINE
}

model ZiyaretYeri {
  id              String        @id @default(cuid())
  slug            String        @unique
  baslik          String
  altBaslik       String?
  sehir           ZiyaretSehir
  kategori        String        // "mescid", "magara", "dag", "kuyu", "tarihi"
  lat             Float
  lng             Float
  adres           String
  aciklama        String        @db.Text
  ibadethane      Boolean       @default(false)
  ziyaretSaatleri String?
  girisUcreti     String        @default("Ücretsiz")
  resim           String?
  icon            String        @default("fas fa-mosque")
  favori          Boolean       @default(false)
  order           Int           @default(0)
  isActive        Boolean       @default(true)
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  @@index([sehir])
  @@index([kategori])
  @@index([order])
}
```

---

## Phase Z2: Admin Panel - Ziyaret Yerleri Listesi

### Dosya: `/app/admin/mobil/ziyaret-yerleri/page.tsx`

### Görevler
- [ ] Tab yapısı (Mekke | Medine)
- [ ] Kategori filtreleme
- [ ] Kart veya liste görünümü
- [ ] Konum önizleme (mini harita)
- [ ] Düzenle/Sil butonları
- [ ] "Yeni Yer Ekle" butonu

### UI Bileşenleri
```
┌─────────────────────────────────────────────────────────────┐
│  Ziyaret Yerleri Yönetimi                 [+ Yeni Yer Ekle] │
├─────────────────────────────────────────────────────────────┤
│  [Mekke (4)] [Medine (4)]                                   │
│  Kategori: [Tümü ▼]                                         │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 🕌 Mescid-i Haram                          [✎] [🗑]  │   │
│  │    Kabe'nin bulunduğu kutsal mescit                  │   │
│  │    📍 21.4225, 39.8262  │ ✓ İbadethane │ ⭐ Favori   │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 🏔️ Hira Mağarası                          [✎] [🗑]  │   │
│  │    İlk vahyin indiği kutsal mekan                    │   │
│  │    📍 21.4575, 39.8583  │ Mağara                     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase Z3: Admin Panel - Ziyaret Yeri Form

### Dosya: `/app/admin/mobil/ziyaret-yerleri/components/ZiyaretYeriForm.tsx`

### Görevler
- [ ] Temel bilgiler formu
- [ ] Şehir seçici (Mekke/Medine radio)
- [ ] Kategori seçici (dropdown)
- [ ] Koordinat girişi (manuel veya harita seçici)
- [ ] Google Maps embed önizleme
- [ ] Resim URL veya upload
- [ ] Icon seçici

### Form Alanları
```
┌─────────────────────────────────────────────────────────────┐
│  Ziyaret Yeri Ekle / Düzenle                                │
├─────────────────────────────────────────────────────────────┤
│  Başlık *:        [Mescid-i Haram___________]               │
│  Alt Başlık:      [Kabe'nin bulunduğu kutsal]               │
│  Slug:            [mescid-i-haram___________] (otomatik)    │
│                                                             │
│  Şehir *:         (●) Mekke  ( ) Medine                     │
│  Kategori *:      [Mescid ▼]                                │
│  Icon:            [fas fa-mosque ▼]                         │
│                                                             │
│  ── Konum ─────────────────────────────────────────────     │
│  Enlem (Lat) *:   [21.4225_____]                            │
│  Boylam (Lng) *:  [39.8262_____]                            │
│  [🗺️ Haritadan Seç]                                         │
│  ┌─────────────────────────────────────────────────┐        │
│  │            [Harita Önizleme]                    │        │
│  └─────────────────────────────────────────────────┘        │
│                                                             │
│  Adres *:         [Mekke, Suudi Arabistan__]                │
│                                                             │
│  Açıklama *:      ┌────────────────────────────────┐        │
│                   │ İslam'ın en kutsal mekanı...   │        │
│                   └────────────────────────────────┘        │
│                                                             │
│  ── Ek Bilgiler ───────────────────────────────────────     │
│  Ziyaret Saatleri:[24 saat açık____________]                │
│  Giriş Ücreti:    [Ücretsiz________________]                │
│  [✓] İbadethane   [✓] Favori olarak işaretle                │
│                                                             │
│  Görsel URL:      [https://...______________]               │
│                                                             │
│                            [İptal]  [Kaydet]                │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase Z4: Admin Actions (Ziyaret Yerleri)

### Dosya: `/app/admin/mobil/ziyaret-yerleri/actions.ts`

### Görevler
- [ ] getZiyaretYerleri(sehir?) - Yerleri getir
- [ ] getZiyaretYeriById(id) - Tek yer
- [ ] createZiyaretYeri(formData) - Yeni yer
- [ ] updateZiyaretYeri(id, formData) - Güncelle
- [ ] deleteZiyaretYeri(id) - Sil
- [ ] reorderZiyaretYerleri(sehir, updates) - Sırala

---

## Phase Z5: API Endpoint (Ziyaret Yerleri)

### Dosya: `/app/api/mobil/ziyaret-yerleri/route.ts`

### Response Format
```json
{
  "success": true,
  "data": {
    "ziyaretYerleri": {
      "mekke": [...],
      "medine": [...]
    }
  },
  "updatedAt": "2024-12-10T12:00:00Z"
}
```

---

## Phase Z6: Seed Script (Ziyaret Yerleri)

### Dosya: `/prisma/seeds/ziyaret-yerleri.ts`

### Görevler
- [ ] Mekke ve Medine verilerini parse et
- [ ] Slug'ları oluştur
- [ ] Resim path'lerini URL'e dönüştür (veya placeholder)
- [ ] Veritabanına ekle

---

## Phase Z7: Web Sayfaları (Kutsal Mekanlar)

### Dosyalar
```
app/(main)/kutsal-mekanlar/
├── page.tsx              # Tüm yerler (harita + liste)
├── mekke/page.tsx        # Mekke ziyaret yerleri
└── medine/page.tsx       # Medine ziyaret yerleri
```

### Görevler
- [ ] Ana sayfa: Şehir seçimi + harita
- [ ] Şehir sayfası: Yer kartları
- [ ] Google Maps entegrasyonu
- [ ] SEO meta tags
- [ ] Header menüye ekle

---

## Phase Z8: Flutter Entegrasyonu

### Görevler
- [ ] ApiService'e getZiyaretYerleri() ekle
- [ ] ZiyaretYeriRepository'yi API destekli yap
- [ ] Şehir bazlı cache
- [ ] Harita pin'leri güncelleme

---

# MODÜL 4: YAPILACAKLAR

## Mevcut Durum (Flutter JSON)
```json
{
  "yapilacaklar": {
    "kategoriler": [
      {
        "id": "yolculuk-oncesi",
        "baslik": "Yolculuk Öncesi",
        "icon": "fas fa-suitcase",
        "renk": "blue",
        "gorevler": [
          {
            "id": "pasaport-kontrol",
            "baslik": "Pasaport Kontrolü",
            "aciklama": "Pasaportunuzun geçerlilik süresini kontrol edin",
            "oncelik": "yuksek"
          }
        ]
      }
    ]
  }
}
```

**Kategoriler:** yolculuk-oncesi, bavul-hazirligi, ruhsal-hazirlik, umre-sirasi, yolculuk-sonrasi
**Öncelik Seviyeleri:** yuksek, orta, dusuk

---

## Phase Y1: Prisma Schema (Yapılacaklar)

### Görevler
- [ ] GorevOncelik enum oluştur
- [ ] YapilacakKategori modeli oluştur
- [ ] Gorev modeli oluştur
- [ ] İlişkileri tanımla
- [ ] npx prisma db push

### Prisma Kodu
```prisma
enum GorevOncelik {
  DUSUK
  ORTA
  YUKSEK
}

model YapilacakKategori {
  id        String      @id @default(cuid())
  slug      String      @unique
  baslik    String
  icon      String      @default("fas fa-list")
  renk      String      @default("blue")  // blue, green, purple, orange, red
  order     Int         @default(0)
  isActive  Boolean     @default(true)
  gorevler  Gorev[]
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt

  @@index([order])
}

model Gorev {
  id          String            @id @default(cuid())
  baslik      String
  aciklama    String?           @db.Text
  kategoriId  String
  kategori    YapilacakKategori @relation(fields: [kategoriId], references: [id], onDelete: Cascade)
  oncelik     GorevOncelik      @default(ORTA)
  order       Int               @default(0)
  isActive    Boolean           @default(true)
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt

  @@index([kategoriId])
  @@index([order])
}
```

---

## Phase Y2: Admin Panel - Yapılacaklar Listesi

### Dosya: `/app/admin/mobil/yapilacaklar/page.tsx`

### Görevler
- [ ] Kategori kartları görünümü
- [ ] Her kategoride görev listesi (açılır/kapanır)
- [ ] Kategori ekleme/düzenleme/silme
- [ ] Görev ekleme/düzenleme/silme
- [ ] Drag & drop sıralama (kategoriler arası ve içinde)
- [ ] Öncelik badge'leri (Yüksek: kırmızı, Orta: sarı, Düşük: yeşil)

### UI Bileşenleri
```
┌─────────────────────────────────────────────────────────────┐
│  Yapılacaklar Yönetimi              [+ Kategori] [+ Görev]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ 📦 Yolculuk Öncesi (5 görev)              [✎] [🗑]  │    │
│  │ ──────────────────────────────────────────────────  │    │
│  │ ↕ [🔴] Pasaport Kontrolü                  [✎] [🗑]  │    │
│  │ ↕ [🔴] Vize İşlemleri                     [✎] [🗑]  │    │
│  │ ↕ [🟡] Aşı Randevusu                      [✎] [🗑]  │    │
│  │ ↕ [🟢] Döviz Alımı                        [✎] [🗑]  │    │
│  │                                  [+ Görev Ekle]     │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ 🧳 Bavul Hazırlığı (8 görev)              [✎] [🗑]  │    │
│  │ ▼ (Daraltılmış)                                     │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase Y3: Admin Panel - Kategori/Görev Form

### Dosya: `/app/admin/mobil/yapilacaklar/components/`

### Görevler
- [ ] KategoriForm komponenti
  - Başlık, slug, icon, renk seçici
- [ ] GorevForm komponenti
  - Başlık, açıklama, kategori seçici, öncelik seçici
- [ ] Renk paleti seçici (blue, green, purple, orange, red)
- [ ] Icon seçici (FontAwesome)

### Kategori Form
```
┌─────────────────────────────────────────────────────────────┐
│  Kategori Ekle / Düzenle                                    │
├─────────────────────────────────────────────────────────────┤
│  Başlık *:        [Yolculuk Öncesi__________]               │
│  Slug:            [yolculuk-oncesi__________] (otomatik)    │
│  Icon:            [fas fa-suitcase ▼]                       │
│  Renk:            [🔵] [🟢] [🟣] [🟠] [🔴]                  │
│                            [İptal]  [Kaydet]                │
└─────────────────────────────────────────────────────────────┘
```

### Görev Form
```
┌─────────────────────────────────────────────────────────────┐
│  Görev Ekle / Düzenle                                       │
├─────────────────────────────────────────────────────────────┤
│  Başlık *:        [Pasaport Kontrolü________]               │
│  Açıklama:        ┌────────────────────────────────┐        │
│                   │ Pasaportunuzun geçerlilik...   │        │
│                   └────────────────────────────────┘        │
│  Kategori *:      [Yolculuk Öncesi ▼]                       │
│  Öncelik *:       (●) Yüksek ( ) Orta ( ) Düşük            │
│                            [İptal]  [Kaydet]                │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase Y4: Admin Actions (Yapılacaklar)

### Dosya: `/app/admin/mobil/yapilacaklar/actions.ts`

### Görevler
- [ ] getKategoriler() - Kategorileri görevleriyle getir
- [ ] createKategori(formData) - Yeni kategori
- [ ] updateKategori(id, formData) - Kategori güncelle
- [ ] deleteKategori(id) - Kategori sil
- [ ] reorderKategoriler(updates) - Kategorileri sırala
- [ ] getGorevler(kategoriId?) - Görevleri getir
- [ ] createGorev(formData) - Yeni görev
- [ ] updateGorev(id, formData) - Görev güncelle
- [ ] deleteGorev(id) - Görev sil
- [ ] reorderGorevler(kategoriId, updates) - Görevleri sırala
- [ ] moveGorev(gorevId, newKategoriId) - Görev kategorisini değiştir

---

## Phase Y5: API Endpoint (Yapılacaklar)

### Dosya: `/app/api/mobil/yapilacaklar/route.ts`

### Response Format
```json
{
  "success": true,
  "data": {
    "yapilacaklar": {
      "kategoriler": [
        {
          "id": "yolculuk-oncesi",
          "baslik": "Yolculuk Öncesi",
          "icon": "fas fa-suitcase",
          "renk": "blue",
          "gorevler": [
            {
              "id": "pasaport-kontrol",
              "baslik": "Pasaport Kontrolü",
              "aciklama": "...",
              "oncelik": "yuksek"
            }
          ]
        }
      ]
    }
  },
  "updatedAt": "2024-12-10T12:00:00Z"
}
```

---

## Phase Y6: Seed Script (Yapılacaklar)

### Dosya: `/prisma/seeds/yapilacaklar.ts`

### Görevler
- [ ] 5 kategoriyi oluştur
- [ ] Her kategorinin görevlerini ekle
- [ ] Öncelik değerlerini enum'a çevir
- [ ] Sıralama (order) ata

---

## Phase Y7: Flutter Entegrasyonu

### Görevler
- [ ] ApiService'e getYapilacaklar() ekle
- [ ] YapilacakRepository'yi API destekli yap
- [ ] Kullanıcının tamamladığı görevler için ayrı lokal storage (tamamlanan görevler API'den gelmiyor, kullanıcıya özel)
- [ ] Sync stratejisi: Görev listesi API'den, completion durumu lokal

---

# MODÜL 5: SSS (Sık Sorulan Sorular)

## Mevcut Durum

### Web FAQ Modeli (Basit)
```prisma
model FAQ {
  id        String   @id @default(cuid())
  question  String
  answer    String   @db.Text
  order     Int      @default(0)
  isActive  Boolean  @default(true)
}
```

### Flutter SSS Yapısı (Karmaşık - 3 Kısımlı Cevap)
```json
{
  "id": 1,
  "soru": "Hac nedir?",
  "cevap": {
    "kisim1": "Hac, İslam'ın beş temel ibadetinden biridir...",
    "kisim2": {
      "baslik": "Hac Farziyeti",
      "icerik": "Mali ve bedenî gücü yeten her müslümana farzdır.",
      "tip": "panel"
    },
    "kisim3": {
      "baslik": "Haccın Şartları",
      "liste": ["Müslüman olmak", "Akıllı olmak", ...]
    }
  },
  "icon": "fas fa-question"
}
```

### Kisim3 Varyasyonları
```
1. Basit Liste:
   "kisim3": { "baslik": "...", "liste": [...] }

2. Alt Başlıklı Liste:
   "kisim3": { "baslik": "...", "alt_basliklar": [
     { "baslik": "Dini Şartlar", "liste": [...] },
     { "baslik": "Pratik Şartlar", "liste": [...] }
   ]}

3. Karşılaştırma Tablosu:
   "kisim3": {
     "baslik": "Karşılaştırma",
     "benzer_yonler": { "baslik": "...", "liste": [...] },
     "farkli_yonler": {
       "baslik": "...",
       "karsilastirma": [
         { "umre": "Yıl boyunca", "hac": "Sadece hac aylarında" }
       ]
     }
   }
```

---

## Karar: Yeni MobilSSS Modeli

Mevcut FAQ basit web sitesi için yeterli. Flutter için zengin içerikli ayrı MobilSSS modeli oluşturulacak.

---

## Phase S1: Prisma Schema (MobilSSS)

### Görevler
- [ ] MobilSSS modeli oluştur
- [ ] cevap alanı için JSON tipi
- [ ] npx prisma db push

### Prisma Kodu
```prisma
model MobilSSS {
  id        String   @id @default(cuid())
  soru      String
  cevap     Json     @db.JsonB  // 3 kısımlı cevap yapısı
  icon      String   @default("fas fa-question")
  order     Int      @default(0)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([order])
}
```

### Cevap JSON Şeması
```typescript
interface SSSCevap {
  kisim1: string;  // Giriş metni (zorunlu)
  kisim2?: {       // Panel (opsiyonel)
    baslik: string;
    icerik: string;
    tip: 'panel';
  };
  kisim3?: Kisim3; // Liste/Alt başlık/Karşılaştırma (opsiyonel)
}

type Kisim3 =
  | { baslik: string; liste: string[] }
  | { baslik: string; alt_basliklar: { baslik: string; liste: string[] }[] }
  | {
      baslik: string;
      benzer_yonler?: { baslik: string; liste: string[] };
      farkli_yonler?: {
        baslik: string;
        karsilastirma: { umre: string; hac: string }[]
      };
    };
```

---

## Phase S2: Admin Panel - SSS Listesi

### Dosya: `/app/admin/mobil/sss/page.tsx`

### Görevler
- [ ] SSS listesi tablosu
- [ ] Soru önizleme
- [ ] Cevap tipi göstergesi (basit/panelli/listeli/karşılaştırmalı)
- [ ] Sıralama
- [ ] Düzenle/Sil butonları
- [ ] "Yeni SSS Ekle" butonu

### UI Bileşenleri
```
┌─────────────────────────────────────────────────────────────┐
│  Mobil SSS Yönetimi                        [+ Yeni SSS]     │
├─────────────────────────────────────────────────────────────┤
│  #  │ Soru                    │ Cevap Tipi    │ İşlemler    │
│  ↕1 │ Hac nedir?              │ Panel+Liste   │ [✎] [🗑]    │
│  ↕2 │ Hac ibadetinin önemi?   │ Panel+Liste   │ [✎] [🗑]    │
│  ↕3 │ Umre ile hac farkı?     │ Karşılaştırma │ [✎] [🗑]    │
│  ...                                                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase S3: Admin Panel - SSS Form (3 Kısımlı Cevap Editörü)

### Dosya: `/app/admin/mobil/sss/components/SSSForm.tsx`

### Görevler
- [ ] Soru input
- [ ] Icon seçici
- [ ] **Kısım 1:** Giriş metni textarea (zorunlu)
- [ ] **Kısım 2:** Panel editörü (opsiyonel toggle)
  - Başlık input
  - İçerik textarea
- [ ] **Kısım 3:** Tip seçici + dinamik editör (opsiyonel toggle)
  - Tip: Basit Liste | Alt Başlıklı Liste | Karşılaştırma
  - Her tip için özel form
- [ ] JSON önizleme (collapsible)
- [ ] Validasyon

### Form UI
```
┌─────────────────────────────────────────────────────────────┐
│  SSS Ekle / Düzenle                                         │
├─────────────────────────────────────────────────────────────┤
│  Soru *:          [Hac nedir?_______________________]       │
│  Icon:            [fas fa-question ▼]                       │
│                                                             │
│  ═══════════════════════════════════════════════════════    │
│  KISIM 1: Giriş Metni *                                     │
│  ═══════════════════════════════════════════════════════    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Hac, İslam'ın beş temel ibadetinden biridir ve      │    │
│  │ her müslümanın hayatta bir defa yapması farz olan   │    │
│  │ kutsal bir ibadettir.                               │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  ═══════════════════════════════════════════════════════    │
│  KISIM 2: Bilgi Paneli                    [✓] Aktif         │
│  ═══════════════════════════════════════════════════════    │
│  Panel Başlığı:   [Hac Farziyeti____________]               │
│  Panel İçeriği:   ┌────────────────────────────────┐        │
│                   │ Mali ve bedenî gücü yeten her  │        │
│                   │ müslümana farzdır.             │        │
│                   └────────────────────────────────┘        │
│                                                             │
│  ═══════════════════════════════════════════════════════    │
│  KISIM 3: Detaylı İçerik                  [✓] Aktif         │
│  ═══════════════════════════════════════════════════════    │
│  İçerik Tipi:     (●) Basit Liste                           │
│                   ( ) Alt Başlıklı Liste                    │
│                   ( ) Karşılaştırma Tablosu                 │
│                                                             │
│  Liste Başlığı:   [Haccın Şartları__________]               │
│  Maddeler:                                                  │
│  • Müslüman olmak                               [🗑]        │
│  • Akıllı olmak                                 [🗑]        │
│  • Ergenlik çağına ulaşmış olmak               [🗑]        │
│                                    [+ Madde Ekle]           │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ [JSON Önizleme ▼]                                   │    │
│  │ { "kisim1": "...", "kisim2": {...}, "kisim3": {...}}│    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│                            [İptal]  [Kaydet]                │
└─────────────────────────────────────────────────────────────┘
```

### Alt Başlıklı Liste Editörü
```
┌─────────────────────────────────────────────────────────────┐
│  Alt Başlıklar:                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Başlık: [Dini Şartlar_____________]         [🗑]    │    │
│  │ • Müslüman olmak                            [🗑]    │    │
│  │ • Akıl sağlığının yerinde olması            [🗑]    │    │
│  │                                [+ Madde Ekle]       │    │
│  └─────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Başlık: [Pratik Şartlar___________]         [🗑]    │    │
│  │ • Geçerli pasaport                          [🗑]    │    │
│  │ • Hac vizesi                                [🗑]    │    │
│  │                                [+ Madde Ekle]       │    │
│  └─────────────────────────────────────────────────────┘    │
│                              [+ Alt Başlık Ekle]            │
└─────────────────────────────────────────────────────────────┘
```

### Karşılaştırma Tablosu Editörü
```
┌─────────────────────────────────────────────────────────────┐
│  Benzer Yönler:                                             │
│  Başlık: [Benzer Yönler______________]                      │
│  • Her ikisi de Mekke'de yapılır               [🗑]         │
│  • İhram giyilir                               [🗑]         │
│                                    [+ Madde Ekle]           │
│                                                             │
│  Farklı Yönler:                                             │
│  Başlık: [Farklı Yönler______________]                      │
│  ┌──────────────────────┬──────────────────────┐            │
│  │ UMRE                 │ HAC                  │            │
│  ├──────────────────────┼──────────────────────┤            │
│  │ Yıl boyunca yapılır  │ Sadece hac aylarında │ [🗑]       │
│  │ Sünnet ibadet        │ Farz ibadet          │ [🗑]       │
│  │ 1-2 gün sürer        │ 5-6 gün sürer        │ [🗑]       │
│  └──────────────────────┴──────────────────────┘            │
│                              [+ Satır Ekle]                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase S4: Admin Actions (MobilSSS)

### Dosya: `/app/admin/mobil/sss/actions.ts`

### Görevler
- [ ] getMobilSSSList() - Tüm SSS'leri getir
- [ ] getMobilSSSById(id) - Tek SSS
- [ ] createMobilSSS(formData) - Yeni SSS
- [ ] updateMobilSSS(id, formData) - Güncelle
- [ ] deleteMobilSSS(id) - Sil
- [ ] reorderMobilSSS(updates) - Sırala
- [ ] JSON validasyonu (cevap yapısı kontrolü)

---

## Phase S5: API Endpoint (MobilSSS)

### Dosya: `/app/api/mobil/sss/route.ts`

### Response Format
```json
{
  "success": true,
  "data": {
    "sss": [
      {
        "id": 1,
        "soru": "Hac nedir?",
        "cevap": {
          "kisim1": "...",
          "kisim2": { "baslik": "...", "icerik": "...", "tip": "panel" },
          "kisim3": { "baslik": "...", "liste": [...] }
        },
        "icon": "fas fa-question"
      }
    ]
  },
  "updatedAt": "2024-12-10T12:00:00Z"
}
```

---

## Phase S6: Seed Script (MobilSSS)

### Dosya: `/prisma/seeds/sss.ts`

### Görevler
- [ ] Flutter JSON'dan SSS'leri parse et
- [ ] cevap yapısını doğrudan aktar
- [ ] Veritabanına ekle

---

## Phase S7: Flutter Entegrasyonu

### Görevler
- [ ] ApiService'e getSSS() ekle
- [ ] SSSRepository'yi API destekli yap
- [ ] Hive cache
- [ ] Offline fallback

---

# MODÜL 0: ORTAK ALTYAPI

## Phase O1: Admin Layout Güncellemesi ✅ TAMAMLANDI

### Dosya: `/app/admin/layout.tsx`

### Görevler
- [x] NAV_GROUPS'a "Mobil Uygulama" grubu ekle
- [x] Smartphone, BookOpen, Map, CheckSquare icon'larını import et
- [x] Alt menü itemlarını ekle (6 adet: Genel Bakış, Dualar, Rehberler, Ziyaret Yerleri, Yapılacaklar, Mobil SSS)

### Kod
```typescript
// NAV_GROUPS içine eklenecek
{
  title: "Mobil Uygulama",
  icon: Smartphone,
  items: [
    { href: "/admin/mobil", label: "Genel Bakış", icon: LayoutDashboard },
    { href: "/admin/mobil/dualar", label: "Dualar", icon: BookOpen },
    { href: "/admin/mobil/rehberler", label: "Rehberler", icon: Map },
    { href: "/admin/mobil/ziyaret-yerleri", label: "Ziyaret Yerleri", icon: MapPin },
    { href: "/admin/mobil/yapilacaklar", label: "Yapılacaklar", icon: CheckSquare },
    { href: "/admin/mobil/sss", label: "Mobil SSS", icon: HelpCircle },
  ]
}
```

---

## Phase O2: Mobil Dashboard ✅ TAMAMLANDI

### Dosya: `/app/admin/mobil/page.tsx`

### Görevler
- [x] 5 adet istatistik kartı (Dualar, Rehberler, Ziyaret Yerleri, Yapılacaklar, Mobil SSS)
- [x] Her kartta: ikon, başlık, sayı, "Yönet" butonu (hover efektli Link)
- [x] Son güncelleme zamanı (Türkçe format)
- [x] API durumu göstergesi (Aktif pulse animasyonu)
- [x] Hızlı İşlemler bölümü (3 adet quick link)
- [x] Senkronizasyon bilgi notu

### UI
```
┌─────────────────────────────────────────────────────────────┐
│  Mobil Uygulama İçerik Yönetimi                             │
│  Tüm mobil uygulama içeriklerini buradan yönetebilirsiniz   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌───────────┐│
│  │ 📖 DUALAR  │ │ 📚 REHBER  │ │ 📍 ZİYARET │ │ ✅ GÖREV  ││
│  │    12      │ │    20      │ │     8      │ │    22     ││
│  │   adet     │ │   adet     │ │    yer     │ │   görev   ││
│  │  [Yönet →] │ │  [Yönet →] │ │  [Yönet →] │ │ [Yönet →] ││
│  └────────────┘ └────────────┘ └────────────┘ └───────────┘│
│                                                             │
│  ┌────────────┐                                             │
│  │ ❓ SSS     │  ────────────────────────────────────────   │
│  │    8       │  Son Güncelleme: 10.12.2024 14:30          │
│  │   soru     │  API Durumu: ✓ Aktif                       │
│  │  [Yönet →] │  Mobil Versiyon: 1.0.0                     │
│  └────────────┘                                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase O3: Sync API

### Dosya: `/app/api/mobil/sync/route.ts`

### Görevler
- [ ] Tüm verileri tek endpoint'te birleştir
- [ ] Version numarası ekle
- [ ] Cache stratejisi (stale-while-revalidate)

### Response Format
```json
{
  "success": true,
  "data": {
    "dualar": [...],
    "rehberler": {...},
    "ziyaretYerleri": {...},
    "yapilacaklar": {...},
    "sss": [...]
  },
  "version": "1.0.0",
  "updatedAt": "2024-12-10T12:00:00Z"
}
```

---

## Phase O4: Seed Ana Script

### Dosya: `/prisma/seeds/index.ts`

### Görevler
- [ ] Tüm seed scriptlerini import et
- [ ] Sıralı çalıştır (kategoriler önce)
- [ ] Hata yönetimi
- [ ] Progress log

```typescript
// prisma/seeds/index.ts
import { seedDualar } from './dualar';
import { seedRehberler } from './rehberler';
import { seedZiyaretYerleri } from './ziyaret-yerleri';
import { seedYapilacaklar } from './yapilacaklar';
import { seedSSS } from './sss';

async function main() {
  console.log('🌱 Mobil veriler yükleniyor...');

  await seedDualar();
  console.log('✓ Dualar yüklendi');

  await seedRehberler();
  console.log('✓ Rehberler yüklendi');

  await seedZiyaretYerleri();
  console.log('✓ Ziyaret yerleri yüklendi');

  await seedYapilacaklar();
  console.log('✓ Yapılacaklar yüklendi');

  await seedSSS();
  console.log('✓ SSS yüklendi');

  console.log('🎉 Tüm mobil veriler başarıyla yüklendi!');
}
```

---

# UYGULAMA SIRASI

## Önerilen Sıra

### Hafta 1: Altyapı + Dualar
1. **Phase O1:** Admin layout güncellemesi
2. **Phase O2:** Mobil dashboard (statik)
3. **Phase D1:** Dualar Prisma schema
4. **Phase D2-D4:** Dualar admin panel
5. **Phase D5:** Dualar API
6. **Phase D6:** Dualar seed

### Hafta 2: Rehberler + Ziyaret Yerleri
7. **Phase R1:** Rehberler Prisma schema
8. **Phase R2-R4:** Rehberler admin panel
9. **Phase R5:** Rehberler API
10. **Phase R6:** Rehberler seed
11. **Phase Z1-Z6:** Ziyaret yerleri (tüm phase'ler)

### Hafta 3: Yapılacaklar + SSS + Web
12. **Phase Y1-Y6:** Yapılacaklar (tüm phase'ler)
13. **Phase S1-S6:** SSS (tüm phase'ler)
14. **Phase O3:** Sync API
15. **Phase O4:** Ana seed script
16. **Phase D7, R7, Z7:** Web sayfaları

### Hafta 4: Flutter + Test
17. **Phase D8, R8, Z8, Y7, S7:** Flutter entegrasyonu
18. End-to-end testler
19. Production deploy

---

# TOPLAM GÖREV SAYISI

| Modül | Phase Sayısı | Tahmini Görev |
|-------|-------------|---------------|
| Ortak | 4 | ~15 |
| Dualar | 8 | ~25 |
| Rehberler | 8 | ~35 |
| Ziyaret Yerleri | 8 | ~25 |
| Yapılacaklar | 7 | ~25 |
| SSS | 7 | ~30 |
| **TOPLAM** | **42 Phase** | **~155 Görev** |

---

*Doküman Tarihi: 10 Aralık 2024*
*Versiyon: 2.0*
