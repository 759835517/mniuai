#!/bin/bash
# 将现有 front-end 迁移到 apps/engineer-app
# 执行前确保在项目根目录：bash scripts/migrate-to-monorepo.sh

set -e

SRC="front-end"
DEST="apps/engineer-app"

echo ">>> 迁移 src/ 目录..."
cp -r "$SRC/src" "$DEST/"

echo ">>> 迁移样式和配置..."
cp "$SRC/tailwind.config.ts"    "$DEST/"
cp "$SRC/postcss.config.mjs"    "$DEST/"
cp "$SRC/.eslintrc.json"        "$DEST/"
cp "$SRC/components.json"       "$DEST/"

echo ">>> 迁移环境变量模板..."
cp "$SRC/.env.example"          "$DEST/.env.local.example.orig"
# .env.example 已在 apps/engineer-app 重新定义，不覆盖

echo ">>> 迁移测试文件..."
cp -r "$SRC/test-results"       "$DEST/" 2>/dev/null || true
cp "$SRC/full-test-suite.js"    "$DEST/" 2>/dev/null || true
cp "$SRC/test-login.spec.js"    "$DEST/" 2>/dev/null || true
cp "$SRC/test-roadmap.spec.js"  "$DEST/" 2>/dev/null || true

echo ">>> 修正 @/ 别名路径..."
# tsconfig.json 已在 engineer-app 中重新定义，@/* -> ./src/*
# components.json aliases 修正
sed -i 's|"@/components"|"@/components"|g' "$DEST/components.json"

echo ""
echo ">>> 迁移完成！下一步："
echo "1. cd 到项目根目录"
echo "2. pnpm install"
echo "3. 将共享组件从 src/components/ui/ 移至 packages/ui/src/components/ui/"
echo "4. 更新 engineer-app 中所有 '@/lib/utils/apiClient' 的 import -> '@/lib/apiClient'"
echo "5. pnpm dev:engineer 验证启动"
