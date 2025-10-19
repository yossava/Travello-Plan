#!/bin/bash

echo "🔍 Running Quality Checks..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Format
echo "📝 Formatting code with Prettier..."
npm run format
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Prettier formatting failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Formatting complete${NC}"
echo ""

# Lint
echo "🔎 Linting code..."
npm run lint:fix
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ ESLint failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Linting complete${NC}"
echo ""

# Type check
echo "📦 Type checking..."
npm run type-check
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ TypeScript type checking failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Type checking complete${NC}"
echo ""

# Build
echo "🏗️  Building project..."
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Build complete${NC}"
echo ""

echo -e "${GREEN}🎉 All quality checks passed!${NC}"
