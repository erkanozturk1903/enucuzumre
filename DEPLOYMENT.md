# Hostinger Deployment Planı - EnUcuzHacUmre

## Proje Özeti

| Özellik | Değer |
|---------|-------|
| Framework | Next.js 16 (App Router) |
| Veritabanı | PostgreSQL (Prisma ORM) |
| Auth | NextAuth v5 |
| Node.js | v20+ gerekli |
| Tahmini Boyut | ~100MB (build sonrası) |

---

## SEÇENEK 1: Hostinger VPS (ÖNERİLEN)

Hostinger VPS, Next.js uygulamaları için en uygun seçenektir çünkü:
- Node.js çalıştırabilir
- PostgreSQL kurulabilir
- Tam SSH erişimi var
- Uygun fiyatlı (KVM 1 planı yeterli)

### Gereksinimler
- **Hostinger VPS KVM 1** veya üstü (aylık ~$5.99)
- Ubuntu 22.04 LTS
- Min 1GB RAM, 20GB SSD

---

## ADIM ADIM KURULUM

### AŞAMA 1: VPS Satın Alma ve İlk Kurulum

1. **Hostinger'dan VPS al**
   - https://www.hostinger.com.tr/vps-sunucu
   - KVM 1 planı seç (1 vCPU, 4GB RAM, 50GB SSD)
   - İşletim sistemi: **Ubuntu 22.04**

2. **SSH ile bağlan**
   ```bash
   ssh root@SUNUCU_IP_ADRESI
   ```

3. **Sistemi güncelle**
   ```bash
   apt update && apt upgrade -y
   ```

### AŞAMA 2: Gerekli Yazılımları Kur

1. **Node.js 20 LTS kur**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   apt install -y nodejs
   node -v  # v20.x olmalı
   npm -v
   ```

2. **PostgreSQL kur**
   ```bash
   apt install -y postgresql postgresql-contrib
   systemctl start postgresql
   systemctl enable postgresql
   ```

3. **Nginx kur (Reverse Proxy)**
   ```bash
   apt install -y nginx
   systemctl enable nginx
   ```

4. **PM2 kur (Process Manager)**
   ```bash
   npm install -g pm2
   ```

5. **Git kur**
   ```bash
   apt install -y git
   ```

### AŞAMA 3: PostgreSQL Veritabanı Ayarla

1. **PostgreSQL'e bağlan**
   ```bash
   sudo -u postgres psql
   ```

2. **Veritabanı ve kullanıcı oluştur**
   ```sql
   CREATE USER enucuzhacumre WITH PASSWORD 'GucluBirSifre123!';
   CREATE DATABASE enucuzhacumre OWNER enucuzhacumre;
   GRANT ALL PRIVILEGES ON DATABASE enucuzhacumre TO enucuzhacumre;
   \q
   ```

3. **Bağlantıyı test et**
   ```bash
   psql -h localhost -U enucuzhacumre -d enucuzhacumre
   # Şifre sor, giriş yapabiliyorsan OK
   \q
   ```

### AŞAMA 4: Proje Dosyalarını Yükle

**SEÇENEK A: Git ile (Önerilen)**

1. **GitHub/GitLab'a push et (yerel bilgisayardan)**
   ```bash
   # Yerel bilgisayarda
   cd /Volumes/Mira/enucuzhacumre
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/KULLANICI/enucuzhacumre.git
   git push -u origin main
   ```

2. **Sunucuda clone et**
   ```bash
   # VPS'de
   cd /var/www
   git clone https://github.com/KULLANICI/enucuzhacumre.git
   cd enucuzhacumre
   ```

**SEÇENEK B: SCP/SFTP ile**
```bash
# Yerel bilgisayardan
scp -r /Volumes/Mira/enucuzhacumre root@SUNUCU_IP:/var/www/
```

### AŞAMA 5: Environment Variables Ayarla

1. **Production .env dosyası oluştur**
   ```bash
   cd /var/www/enucuzhacumre
   nano .env
   ```

2. **İçeriği yapıştır**
   ```env
   # Database
   DATABASE_URL="postgresql://enucuzhacumre:GucluBirSifre123!@localhost:5432/enucuzhacumre"

   # NextAuth
   AUTH_SECRET="YENI_GUCLU_SECRET_URET"
   NEXTAUTH_URL="https://enucuzhacumre.com"

   # Node Environment
   NODE_ENV="production"
   ```

3. **Yeni AUTH_SECRET üret**
   ```bash
   openssl rand -base64 32
   # Çıkan değeri AUTH_SECRET'a yapıştır
   ```

### AŞAMA 6: Projeyi Build Et

1. **Bağımlılıkları yükle**
   ```bash
   cd /var/www/enucuzhacumre
   npm install
   ```

2. **Prisma Client oluştur**
   ```bash
   npx prisma generate
   ```

3. **Veritabanı şemasını uygula**
   ```bash
   npx prisma db push
   ```

4. **Seed data ekle (opsiyonel)**
   ```bash
   npx prisma db seed
   ```

5. **Next.js build**
   ```bash
   npm run build
   ```

### AŞAMA 7: PM2 ile Çalıştır

1. **PM2 ecosystem dosyası oluştur**
   ```bash
   nano ecosystem.config.js
   ```

2. **İçerik:**
   ```javascript
   module.exports = {
     apps: [{
       name: 'enucuzhacumre',
       script: 'npm',
       args: 'start',
       cwd: '/var/www/enucuzhacumre',
       env: {
         NODE_ENV: 'production',
         PORT: 3000
       },
       instances: 1,
       autorestart: true,
       watch: false,
       max_memory_restart: '1G'
     }]
   }
   ```

3. **Uygulamayı başlat**
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

4. **Durumu kontrol et**
   ```bash
   pm2 status
   pm2 logs enucuzhacumre
   ```

### AŞAMA 8: Nginx Reverse Proxy Ayarla

1. **Nginx config oluştur**
   ```bash
   nano /etc/nginx/sites-available/enucuzhacumre
   ```

2. **İçerik:**
   ```nginx
   server {
       listen 80;
       server_name enucuzhacumre.com www.enucuzhacumre.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }

       # Static files - uploads
       location /uploads/ {
           alias /var/www/enucuzhacumre/public/uploads/;
           expires 30d;
           add_header Cache-Control "public, immutable";
       }

       client_max_body_size 10M;
   }
   ```

3. **Site'ı aktifleştir**
   ```bash
   ln -s /etc/nginx/sites-available/enucuzhacumre /etc/nginx/sites-enabled/
   nginx -t
   systemctl reload nginx
   ```

### AŞAMA 9: SSL Sertifikası (Let's Encrypt)

1. **Certbot kur**
   ```bash
   apt install -y certbot python3-certbot-nginx
   ```

2. **SSL sertifikası al**
   ```bash
   certbot --nginx -d enucuzhacumre.com -d www.enucuzhacumre.com
   ```

3. **Otomatik yenileme test**
   ```bash
   certbot renew --dry-run
   ```

### AŞAMA 10: Domain Ayarları (Hostinger DNS)

1. **Hostinger panelinden DNS ayarlarına git**
2. **A Record ekle:**
   - Host: `@`
   - Points to: `VPS_IP_ADRESI`
   - TTL: 14400

3. **www için CNAME ekle:**
   - Host: `www`
   - Points to: `enucuzhacumre.com`
   - TTL: 14400

---

## SEÇENEK 2: Hibrit Yaklaşım (Önerilen Alternatif)

Hostinger'ı sadece domain için kullan, uygulamayı daha uygun platformlara deploy et:

### Vercel + Neon (ÜCRETSİZ)

| Servis | Kullanım | Ücretsiz Limit |
|--------|----------|----------------|
| Vercel | Next.js Hosting | Sınırsız deploy |
| Neon | PostgreSQL | 512MB veritabanı |

**Avantajları:**
- Ücretsiz başlayabilirsin
- Otomatik CI/CD
- Global CDN
- Kolay ölçeklendirme

**Kurulum:**

1. **Neon'da veritabanı oluştur**
   - https://neon.tech adresine git
   - Ücretsiz hesap aç
   - Yeni proje oluştur
   - Connection string'i kopyala

2. **Vercel'e deploy et**
   - https://vercel.com
   - GitHub ile bağlan
   - Repository'yi import et
   - Environment variables ekle:
     ```
     DATABASE_URL=postgresql://...@neon.tech/...
     AUTH_SECRET=...
     NEXTAUTH_URL=https://enucuzhacumre.vercel.app
     ```

3. **Hostinger'da domain yönlendir**
   - CNAME: `cname.vercel-dns.com`

---

## SEÇENEK 3: Railway (Kolay Alternatif)

Railway, hem Next.js hem PostgreSQL'i tek yerden yönetir.

**Fiyat:** $5/ay credit ile başlar

1. https://railway.app
2. GitHub ile bağlan
3. "New Project" → "Deploy from GitHub"
4. PostgreSQL ekle
5. Environment variables otomatik bağlanır

---

## ÖNEMLİ KONTROL LİSTESİ

### Deploy Öncesi Yapılacaklar

- [ ] `.env` dosyası `.gitignore`'da mı? ✓
- [ ] `next.config.ts`'de `output: 'standalone'` gerekli mi kontrol et
- [ ] Tüm görseller `/public/uploads/` altında mı?
- [ ] `prisma/seed.ts` production'a uygun mu?

### Deploy Sonrası Yapılacaklar

- [ ] Admin paneline giriş testi (`/admin/login`)
- [ ] Tour ekleme/düzenleme testi
- [ ] Görsel yükleme testi
- [ ] İletişim formu testi
- [ ] SSL sertifikası aktif mi?
- [ ] www yönlendirmesi çalışıyor mu?

---

## UPLOAD KLASÖRÜ SORUNU

Next.js production'da `/public` klasörü read-only olabilir. Çözüm:

1. **Uploads için ayrı klasör kullan**
   ```bash
   mkdir -p /var/www/uploads
   chmod 755 /var/www/uploads
   ```

2. **Nginx'te static serve et**
   ```nginx
   location /uploads/ {
       alias /var/www/uploads/;
   }
   ```

3. **Upload API'yi güncelle** (gerekirse)
   - Dosyaları `/var/www/uploads/` altına kaydet
   - URL olarak `/uploads/...` döndür

---

## YEDEKLEME STRATEJİSİ

### Veritabanı Yedekleme

```bash
# Günlük yedek al
pg_dump -U enucuzhacumre -d enucuzhacumre > backup_$(date +%Y%m%d).sql

# Cron job ekle (her gece 03:00)
crontab -e
# Ekle: 0 3 * * * pg_dump -U enucuzhacumre -d enucuzhacumre > /backups/db_$(date +\%Y\%m\%d).sql
```

### Uploads Yedekleme

```bash
# Uploads klasörünü yedekle
tar -czvf uploads_backup_$(date +%Y%m%d).tar.gz /var/www/enucuzhacumre/public/uploads/
```

---

## MALİYET KARŞILAŞTIRMASI

| Platform | Aylık Maliyet | Avantaj |
|----------|---------------|---------|
| Hostinger VPS KVM 1 | ~$6 | Tam kontrol |
| Vercel + Neon | $0 (başlangıç) | Kolay, ücretsiz |
| Railway | $5+ | Hepsi bir arada |
| DigitalOcean | $6+ | Güvenilir |

---

## SORUN GİDERME

### Uygulama başlamıyorsa
```bash
pm2 logs enucuzhacumre --lines 100
```

### Veritabanı bağlantı hatası
```bash
# PostgreSQL çalışıyor mu?
systemctl status postgresql

# Bağlantı test
psql -h localhost -U enucuzhacumre -d enucuzhacumre
```

### Nginx 502 hatası
```bash
# Next.js çalışıyor mu?
pm2 status

# Port açık mı?
netstat -tlnp | grep 3000
```

### Build hatası
```bash
# Node.js bellek artır
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

---

## SONUÇ

**En kolay yol:** Vercel + Neon (ücretsiz, 5 dakikada deploy)
**En ekonomik tam kontrol:** Hostinger VPS ($6/ay)
**En kolay yönetim:** Railway ($5/ay)

Hostinger VPS tercih edersen yukarıdaki adımları sırayla takip et. Sorularını sorabilirsin!
