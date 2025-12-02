# Railway Deployment Rehberi - EnUcuzHacUmre

Bu rehber, EnUcuzHacUmre Next.js uygulamasını Railway platformuna deploy etmek için adım adım talimatlar içerir.

---

## 📋 İÇİNDEKİLER

1. [Gereksinimler](#gereksinimler)
2. [Adım 1: GitHub Hesabı ve Repository](#adım-1-github-hesabı-ve-repository)
3. [Adım 2: Railway Hesabı Oluşturma](#adım-2-railway-hesabı-oluşturma)
4. [Adım 3: PostgreSQL Veritabanı Oluşturma](#adım-3-postgresql-veritabanı-oluşturma)
5. [Adım 4: Next.js Uygulamasını Deploy Etme](#adım-4-nextjs-uygulamasını-deploy-etme)
6. [Adım 5: Environment Variables Ayarlama](#adım-5-environment-variables-ayarlama)
7. [Adım 6: Veritabanı Migration ve Seed](#adım-6-veritabanı-migration-ve-seed)
8. [Adım 7: Domain Ayarlama](#adım-7-domain-ayarlama)
9. [Adım 8: Hostinger DNS Ayarları](#adım-8-hostinger-dns-ayarları)
10. [Sorun Giderme](#sorun-giderme)
11. [Güncelleme ve Bakım](#güncelleme-ve-bakım)

---

## 📦 GEREKSİNİMLER

### Hesaplar
- [x] GitHub hesabı (https://github.com)
- [ ] Railway hesabı (https://railway.app)
- [x] Hostinger hesabı (domain için)

### Yerel Gereksinimler
- [x] Git kurulu
- [x] Node.js 20+ kurulu
- [x] Proje dosyaları hazır

### Proje Bilgileri
| Özellik | Değer |
|---------|-------|
| Framework | Next.js 16 (App Router) |
| Veritabanı | PostgreSQL (Prisma ORM) |
| Auth | NextAuth v5 |
| Node.js | v20+ |

---

## 🚀 ADIM 1: GitHub Hesabı ve Repository

### 1.1 GitHub Repository Oluşturma

1. https://github.com adresine git
2. Sağ üstteki **+** butonuna tıkla → **New repository**
3. Repository ayarları:
   - **Repository name:** `enucuzhacumre`
   - **Description:** `Hac ve Umre Turizm Web Sitesi`
   - **Visibility:** `Private` (önerilen) veya `Public`
   - **Initialize:** HAYIR (boş bırak)
4. **Create repository** butonuna tıkla

### 1.2 Yerel Projeyi GitHub'a Push Etme

Terminal'de şu komutları çalıştır:

```bash
# Proje klasörüne git
cd /Volumes/Mira/enucuzhacumre

# Git'i başlat (eğer başlatılmadıysa)
git init

# .gitignore kontrolü (zaten var)
cat .gitignore

# Tüm dosyaları staging'e ekle
git add .

# İlk commit
git commit -m "Initial commit - EnUcuzHacUmre website"

# Ana branch'i main olarak ayarla
git branch -M main

# GitHub remote ekle (KULLANICI_ADIN'ı değiştir!)
git remote add origin https://github.com/KULLANICI_ADIN/enucuzhacumre.git

# Push et
git push -u origin main
```

### 1.3 Push Doğrulama

GitHub repository sayfanı yenileyip dosyaların yüklendiğini kontrol et.

---

## 🚂 ADIM 2: Railway Hesabı Oluşturma

### 2.1 Kayıt

1. https://railway.app adresine git
2. **Login** veya **Start a New Project** butonuna tıkla
3. **Login with GitHub** seçeneğini seç
4. GitHub hesabınla oturum aç
5. Railway'in GitHub'a erişim izni vermesini onayla

### 2.2 Plan Seçimi

Railway'in fiyatlandırması:
- **Trial:** $5 ücretsiz kredi (yeni kullanıcılar)
- **Hobby:** $5/ay (kredi kartı gerekli)
- **Pro:** $20/ay (ekip özellikleri)

> ⚠️ **Not:** Trial için kredi kartı gerekmez ama $5 kredi bitince durdurulur.
> Hobby plan için kredi kartı gerekir ama sadece kullandığın kadar ödersin.

---

## 🗄️ ADIM 3: PostgreSQL Veritabanı Oluşturma

### 3.1 Yeni Proje Oluştur

1. Railway Dashboard'da **New Project** butonuna tıkla
2. **Provision PostgreSQL** seçeneğini seç
3. PostgreSQL servisi otomatik oluşturulacak

### 3.2 Veritabanı Bilgilerini Al

1. Oluşturulan PostgreSQL servisine tıkla
2. **Variables** sekmesine git
3. Şu değişkeni kopyala ve bir yere not et:
   - `DATABASE_URL` (örnek: `postgresql://postgres:xxxxx@xxxx.railway.app:5432/railway`)

> 🔐 **ÖNEMLİ:** Bu URL'yi kimseyle paylaşma!

### 3.3 Veritabanı Bağlantısını Test Et (Opsiyonel)

Yerel bilgisayarında test etmek için:

```bash
# .env dosyasına Railway DATABASE_URL'yi ekle
echo 'DATABASE_URL="postgresql://postgres:xxxxx@xxxx.railway.app:5432/railway"' > .env.railway-test

# Bağlantıyı test et
npx prisma db pull --schema=./prisma/schema.prisma
```

---

## 🌐 ADIM 4: Next.js Uygulamasını Deploy Etme

### 4.1 GitHub Repository'yi Bağla

1. Railway Dashboard'da aynı proje içinde **New** butonuna tıkla
2. **GitHub Repo** seçeneğini seç
3. **Configure GitHub App** linkine tıkla (ilk seferde)
4. Railway'in hangi repository'lere erişebileceğini seç:
   - `enucuzhacumre` repository'sini seç
5. **Install** butonuna tıkla
6. Railway'e dön ve `enucuzhacumre` repository'sini seç

### 4.2 Deploy Ayarları

Railway otomatik olarak Next.js projesini algılayacak. Varsayılan ayarlar:

| Ayar | Değer |
|------|-------|
| Build Command | `npm run build` |
| Start Command | `npm run start` |
| Install Command | `npm install` |

Bu ayarlar genellikle doğrudur, değiştirmeye gerek yok.

### 4.3 İlk Deploy'u Bekle

Deploy işlemi başlayacak. **Henüz başarısız olabilir** çünkü environment variables ayarlanmadı. Bu normal!

---

## ⚙️ ADIM 5: Environment Variables Ayarlama

### 5.1 Variables Sayfasına Git

1. Next.js servisine (GitHub repo'dan oluşan) tıkla
2. **Variables** sekmesine git

### 5.2 Gerekli Variables Ekle

**New Variable** butonuna tıklayarak şu değişkenleri ekle:

```env
# Veritabanı (PostgreSQL servisinden referans)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# NextAuth Secret (Güvenli bir string oluştur)
AUTH_SECRET=BURAYA_32_KARAKTERLIK_RANDOM_STRING

# NextAuth URL (Railway domain'ini kullan)
NEXTAUTH_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}

# Node Environment
NODE_ENV=production
```

### 5.3 AUTH_SECRET Oluşturma

Terminalde şu komutu çalıştır:

```bash
openssl rand -base64 32
```

Çıkan değeri `AUTH_SECRET` olarak kullan.

**Örnek çıktı:** `K7qB9mN3xR5vY2wT8pL4jH6gF1cD0aE+ZuXsW7nM9kQ=`

### 5.4 DATABASE_URL Referansı

Railway'de servisler arası referans kullanabilirsin:

1. **New Variable** tıkla
2. Key: `DATABASE_URL`
3. Value alanında **Add Reference** butonuna tıkla
4. `Postgres` → `DATABASE_URL` seç

Bu sayede veritabanı URL'si otomatik bağlanır.

### 5.5 Tüm Variables Listesi

| Variable | Değer | Açıklama |
|----------|-------|----------|
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` | PostgreSQL bağlantısı |
| `AUTH_SECRET` | (32 char random) | JWT şifreleme |
| `NEXTAUTH_URL` | `https://${{RAILWAY_PUBLIC_DOMAIN}}` | Auth callback URL |
| `NODE_ENV` | `production` | Ortam |

### 5.6 Redeploy

Variables ekledikten sonra:
1. **Deployments** sekmesine git
2. En son deployment'ın yanındaki **⋮** menüsüne tıkla
3. **Redeploy** seç

---

## 🔄 ADIM 6: Veritabanı Migration ve Seed

### 6.1 Railway CLI Kurulumu (Opsiyonel ama Önerilen)

```bash
# macOS
brew install railway

# npm ile
npm install -g @railway/cli

# Login
railway login
```

### 6.2 Prisma Migration - Yöntem A: Railway CLI ile

```bash
# Proje klasöründe
cd /Volumes/Mira/enucuzhacumre

# Railway projesine bağlan
railway link

# Migration çalıştır
railway run npx prisma db push

# Seed data ekle
railway run npx prisma db seed
```

### 6.3 Prisma Migration - Yöntem B: Railway Dashboard ile

1. Railway Dashboard'da Next.js servisine git
2. **Settings** sekmesine git
3. **Deploy** bölümünde **Custom Start Command** ekle:

```bash
npx prisma db push && npx prisma db seed && npm run start
```

> ⚠️ **Not:** Bu komut her deploy'da çalışır. Seed'i bir kez çalıştırdıktan sonra şu şekilde değiştir:
> ```bash
> npx prisma generate && npm run start
> ```

### 6.4 Migration Doğrulama

1. PostgreSQL servisine git
2. **Data** sekmesine tıkla
3. Tabloların oluştuğunu kontrol et:
   - `User`
   - `Tour`
   - `TourImage`
   - `HeroSlide`
   - `BlogPost`
   - `FAQ`
   - vb.

---

## 🌍 ADIM 7: Domain Ayarlama

### 7.1 Railway Domain Al

1. Next.js servisine git
2. **Settings** sekmesine git
3. **Networking** bölümünde **Generate Domain** butonuna tıkla
4. Railway otomatik bir domain verecek: `enucuzhacumre-production.up.railway.app`

### 7.2 Custom Domain Ekleme

1. Aynı sayfada **Custom Domain** bölümüne git
2. **+ Custom Domain** butonuna tıkla
3. Domain'ini yaz: `enucuzhacumre.com`
4. Railway sana DNS kayıtlarını gösterecek (bir sonraki adımda kullanacağız)

### 7.3 www Subdomain Ekleme

1. Tekrar **+ Custom Domain** tıkla
2. `www.enucuzhacumre.com` ekle

---

## 🔧 ADIM 8: Hostinger DNS Ayarları

### 8.1 Hostinger Paneline Giriş

1. https://www.hostinger.com.tr adresine git
2. Hesabına giriş yap
3. **Hosting** veya **Domains** bölümüne git
4. `enucuzhacumre.com` domain'ini seç
5. **DNS / Name Servers** veya **DNS Zone** bölümüne git

### 8.2 Mevcut Kayıtları Temizle

Eğer varsa şu kayıtları sil:
- A kayıtları (@ ve www için)
- CNAME kayıtları (www için)

### 8.3 Railway DNS Kayıtlarını Ekle

Railway'in verdiği bilgilere göre kayıt ekle:

#### Ana Domain için (enucuzhacumre.com)

| Type | Host | Value | TTL |
|------|------|-------|-----|
| CNAME | @ | `enucuzhacumre-production.up.railway.app` | 3600 |

**VEYA** (Hostinger @ için CNAME desteklemiyorsa):

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A | @ | `(Railway IP - Dashboard'dan al)` | 3600 |

#### www Subdomain için

| Type | Host | Value | TTL |
|------|------|-------|-----|
| CNAME | www | `enucuzhacumre-production.up.railway.app` | 3600 |

### 8.4 DNS Yayılımını Bekle

DNS değişiklikleri genellikle 5-30 dakika içinde yayılır, bazen 24 saate kadar sürebilir.

Kontrol için:
```bash
# DNS kontrolü
dig enucuzhacumre.com
dig www.enucuzhacumre.com

# veya online araç
# https://dnschecker.org
```

### 8.5 SSL Sertifikası

Railway custom domain için otomatik SSL sertifikası sağlar. Domain doğrulandıktan sonra HTTPS otomatik aktif olur.

---

## ❓ SORUN GİDERME

### Build Hatası

**Sorun:** `npm run build` başarısız oluyor

**Çözüm:**
1. Railway Dashboard'da **Deployments** → Son deployment → **Logs** kontrol et
2. Yerel'de test et:
   ```bash
   npm run build
   ```
3. TypeScript hataları için:
   ```bash
   npx tsc --noEmit
   ```

### Veritabanı Bağlantı Hatası

**Sorun:** `PrismaClientInitializationError`

**Çözüm:**
1. `DATABASE_URL` variable'ının doğru ayarlandığını kontrol et
2. PostgreSQL servisinin çalıştığını kontrol et
3. Prisma client'ı yeniden oluştur:
   ```bash
   railway run npx prisma generate
   ```

### 502 Bad Gateway

**Sorun:** Site açılmıyor, 502 hatası

**Çözüm:**
1. Servisin çalışıp çalışmadığını kontrol et (Railway Dashboard)
2. Logs'a bak
3. PORT ayarını kontrol et (Railway otomatik ayarlar, genellikle sorun olmaz)

### Domain Bağlanmıyor

**Sorun:** Custom domain çalışmıyor

**Çözüm:**
1. DNS kayıtlarının doğru olduğunu kontrol et
2. DNS propagation'ı bekle (24 saate kadar)
3. Railway Dashboard'da domain durumunu kontrol et

### Auth Çalışmıyor

**Sorun:** Login yapılamıyor

**Çözüm:**
1. `AUTH_SECRET` değişkenini kontrol et
2. `NEXTAUTH_URL`'in production domain'i içerdiğinden emin ol
3. Custom domain kullanıyorsan:
   ```env
   NEXTAUTH_URL=https://enucuzhacumre.com
   ```

---

## 🔄 GÜNCELLEME VE BAKIM

### Otomatik Deploy

GitHub'a push ettiğinde Railway otomatik deploy eder:

```bash
# Değişiklikleri commit et
git add .
git commit -m "Update: açıklama"

# Push et (otomatik deploy başlar)
git push origin main
```

### Manuel Deploy

Railway Dashboard'dan:
1. Servisine git
2. **Deployments** → **Deploy** butonu

### Veritabanı Yedekleme

Railway PostgreSQL için otomatik yedekleme yapar (Pro plan). Manuel yedek için:

```bash
# Railway CLI ile
railway run pg_dump > backup_$(date +%Y%m%d).sql
```

### Logs İzleme

```bash
# Railway CLI
railway logs

# veya Dashboard'dan
# Servis → Deployments → Logs
```

---

## 📊 MALİYET TAHMİNİ

Railway kullandıkça öde modeli:

| Kaynak | Birim Fiyat | Tahmini Aylık |
|--------|-------------|---------------|
| Compute (Next.js) | $0.000231/dakika | ~$5-10 |
| PostgreSQL | $0.000231/dakika | ~$2-5 |
| Bandwidth | $0.10/GB | ~$1-2 |
| **Toplam** | | **~$8-17/ay** |

> 💡 **İpucu:** Düşük trafikli sitelerde aylık maliyet genellikle $5-10 arasındadır.

---

## ✅ DEPLOY SONRASI KONTROL LİSTESİ

- [ ] Ana sayfa açılıyor (`https://enucuzhacumre.com`)
- [ ] Admin paneli çalışıyor (`/admin/login`)
- [ ] Admin girişi yapılabiliyor (email: `erozturk0381@gmail.com`)
- [ ] Turlar listeleniyor (`/umre-turlari`)
- [ ] Blog sayfası çalışıyor (`/blog`)
- [ ] İletişim formu gönderilebiliyor (`/iletisim`)
- [ ] Görseller yükleniyor
- [ ] SSL sertifikası aktif (yeşil kilit ikonu)
- [ ] www yönlendirmesi çalışıyor

---

## 📞 DESTEK

- **Railway Docs:** https://docs.railway.app
- **Railway Discord:** https://discord.gg/railway
- **Prisma Docs:** https://www.prisma.io/docs

---

*Son Güncelleme: Aralık 2025*
