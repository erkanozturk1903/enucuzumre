#!/bin/bash

# =================================
# Railway Deploy Öncesi Kontrol Scripti
# =================================

echo "🚀 Railway Deploy Kontrol Listesi"
echo "=================================="
echo ""

# Renk kodları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Başarı ve hata sayaçları
PASS=0
FAIL=0

check_pass() {
    echo -e "${GREEN}✓${NC} $1"
    ((PASS++))
}

check_fail() {
    echo -e "${RED}✗${NC} $1"
    ((FAIL++))
}

check_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# 1. Git kontrolü
echo "📁 Git Durumu"
echo "-------------"
if [ -d ".git" ]; then
    check_pass "Git repository mevcut"
else
    check_fail "Git repository bulunamadı - 'git init' çalıştır"
fi

# Git remote kontrolü
if git remote -v | grep -q "origin"; then
    check_pass "Git remote (origin) ayarlanmış"
else
    check_fail "Git remote ayarlanmamış - GitHub repo ekle"
fi

# Uncommitted changes kontrolü
if [ -z "$(git status --porcelain)" ]; then
    check_pass "Tüm değişiklikler commit edilmiş"
else
    check_warn "Commit edilmemiş değişiklikler var"
    git status --short
fi

echo ""

# 2. Dosya kontrolleri
echo "📄 Dosya Kontrolleri"
echo "--------------------"

# package.json
if [ -f "package.json" ]; then
    check_pass "package.json mevcut"
else
    check_fail "package.json bulunamadı"
fi

# prisma/schema.prisma
if [ -f "prisma/schema.prisma" ]; then
    check_pass "prisma/schema.prisma mevcut"
else
    check_fail "prisma/schema.prisma bulunamadı"
fi

# prisma/seed.ts
if [ -f "prisma/seed.ts" ]; then
    check_pass "prisma/seed.ts mevcut"
else
    check_warn "prisma/seed.ts bulunamadı (opsiyonel)"
fi

# railway.toml
if [ -f "railway.toml" ]; then
    check_pass "railway.toml mevcut"
else
    check_warn "railway.toml bulunamadı (opsiyonel ama önerilen)"
fi

# .env kontrolü (push edilmemeli)
if git ls-files --error-unmatch .env 2>/dev/null; then
    check_fail ".env dosyası git'e eklenmiş - ÇIKAR!"
else
    check_pass ".env dosyası git'e eklenmemiş"
fi

echo ""

# 3. Build testi
echo "🔨 Build Testi"
echo "--------------"
echo "Build test ediliyor... (bu biraz sürebilir)"

if npm run build > /tmp/build.log 2>&1; then
    check_pass "Build başarılı"
else
    check_fail "Build başarısız"
    echo "Hata detayları için: cat /tmp/build.log"
fi

echo ""

# 4. TypeScript kontrolü
echo "📝 TypeScript Kontrolü"
echo "----------------------"

if npx tsc --noEmit > /tmp/tsc.log 2>&1; then
    check_pass "TypeScript hataları yok"
else
    check_warn "TypeScript uyarıları var"
    echo "Detaylar için: cat /tmp/tsc.log"
fi

echo ""

# 5. Sonuç
echo "=================================="
echo "📊 Sonuç"
echo "=================================="
echo -e "${GREEN}Başarılı:${NC} $PASS"
echo -e "${RED}Başarısız:${NC} $FAIL"

if [ $FAIL -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ Proje Railway'e deploy edilmeye hazır!${NC}"
    echo ""
    echo "Sonraki adımlar:"
    echo "1. git push origin main"
    echo "2. Railway Dashboard'a git"
    echo "3. GitHub repo'yu bağla"
    echo "4. Environment variables ekle"
else
    echo ""
    echo -e "${RED}✗ Yukarıdaki hataları düzelt ve tekrar dene${NC}"
fi
