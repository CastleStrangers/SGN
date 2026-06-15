#!/bin/bash
# SY-NL Platform - بعد التحسينات
# هذا الملف يتحقق من جميع التحسينات المضافة

echo "=================================="
echo "  SY-NL Platform - Verification   "
echo "=================================="
echo ""

# 1. التحقق من .dockerignore
echo "✓ Checking .dockerignore..."
if [ -f .dockerignore ]; then
    echo "  → .dockerignore موجود ✅"
    echo "  → حجمه: $(wc -c < .dockerignore) bytes"
else
    echo "  → .dockerignore مفقود ❌"
fi
echo ""

# 2. التحقق من .env.production
echo "✓ Checking .env.production..."
if [ -f .env.production ]; then
    echo "  → .env.production موجود ✅"
    echo "  → يحتوي على متغيرات الإنتاج"
else
    echo "  → .env.production مفقود ❌"
fi
echo ""

# 3. التحقق من GitHub Actions
echo "✓ Checking GitHub Actions workflow..."
if [ -f .github/workflows/test-deploy.yml ]; then
    echo "  → test-deploy.yml موجود ✅"
else
    echo "  → test-deploy.yml مفقود ❌"
fi
echo ""

# 4. التحقق من auth.ts
echo "✓ Checking auth.ts improvements..."
if grep -q "allowDangerousEmailAccountLinking: false" src/lib/auth.ts; then
    echo "  → Security fix مفعّل ✅"
else
    echo "  → Security fix غير موجود ❌"
fi
echo ""

# 5. التحقق من Redis
echo "✓ Checking Redis integration..."
if [ -f src/lib/redis.ts ]; then
    echo "  → redis.ts موجود ✅"
    echo "  → عدد الدوال: $(grep -c "^export async function" src/lib/redis.ts)"
else
    echo "  → redis.ts مفقود ❌"
fi
echo ""

# 6. التحقق من الاختبارات
echo "✓ Checking tests..."
if [ -f src/lib/__tests__/api-routes.test.ts ]; then
    echo "  → api-routes.test.ts موجود ✅"
    echo "  → عدد الـ describe blocks: $(grep -c "describe(" src/lib/__tests__/api-routes.test.ts)"
else
    echo "  → api-routes.test.ts مفقود ❌"
fi
echo ""

# 7. التحقق من Health Endpoint
echo "✓ Checking health endpoint..."
if [ -f src/app/api/health/route.ts ]; then
    echo "  → health/route.ts موجود ✅"
else
    echo "  → health/route.ts مفقود ❌"
fi
echo ""

# 8. التحقق من scripts/windows
echo "✓ Checking scripts/windows..."
if [ -d scripts/windows ]; then
    count=$(find scripts/windows -type f | wc -l)
    echo "  → scripts/windows موجود ✅"
    echo "  → عدد الملفات: $count"
else
    echo "  → scripts/windows مفقود ❌"
fi
echo ""

# 9. التحقق من التوثيق
echo "✓ Checking documentation..."
docs=(ENV_VARIABLES.md TURSO_MIGRATION.md IMPROVEMENTS_SUMMARY.md CHECKLIST.md COMPLETION_SUMMARY.md)
for doc in "${docs[@]}"; do
    if [ -f "$doc" ]; then
        echo "  → $doc ✅"
    else
        echo "  → $doc ❌"
    fi
done
echo ""

# 10. التحقق من package.json
echo "✓ Checking package.json updates..."
if grep -q "@upstash/redis" package.json; then
    echo "  → @upstash/redis مُضاف ✅"
else
    echo "  → @upstash/redis غير موجود ❌"
fi

if grep -q "ioredis" package.json; then
    echo "  → ioredis مُضاف ✅"
else
    echo "  → ioredis غير موجود ❌"
fi
echo ""

echo "=================================="
echo "  ✅ التحقق اكتمل!"
echo "=================================="
echo ""
echo "الخطوات التالية:"
echo "1. npm install"
echo "2. npm run test:run"
echo "3. npm run build"
echo "4. git add . && git commit -m 'chore: improvements'"
echo ""
