#!/bin/bash

# Tree Shaking Analysis Script
# Analisa e relata imports não utilizados

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR/.."

echo "🔍 Tree Shaking Analysis"
echo "======================="

# Navegar para pasta web
cd "$PROJECT_ROOT/apps/web"

echo "📦 Analisando imports não utilizados..."

# Run eslint and capture unused imports
ESLINT_OUTPUT=$(pnpm eslint . --format=json 2>/dev/null || echo "[]")

# Parse JSON and find unused imports
UNUSED_COUNT=$(echo "$ESLINT_OUTPUT" | jq '[.[] | .messages[] | select(.ruleId == "unused-imports/no-unused-imports")] | length' 2>/dev/null || echo 0)
UNUSED_VARS=$(echo "$ESLINT_OUTPUT" | jq '[.[] | .messages[] | select(.ruleId == "unused-imports/no-unused-vars")] | length' 2>/dev/null || echo 0)

echo ""
echo "📊 Resultados:"
echo "  • Imports não utilizados: $UNUSED_COUNT"
echo "  • Variáveis não utilizadas: $UNUSED_VARS"

if [ "$UNUSED_COUNT" -gt 0 ] || [ "$UNUSED_VARS" -gt 0 ]; then
  echo ""
  echo "⚠️  Arquivos com imports/variáveis não utilizados:"
  echo ""
  
  echo "$ESLINT_OUTPUT" | jq -r '.[] | select(.messages | length > 0) | .filePath as $file | .messages[] | select(.ruleId | contains("unused")) | "  \($file):\(.line):\(.column) - \(.message)"' 2>/dev/null || true
  
  echo ""
  echo "💡 Para corrigir automaticamente:"
  echo "   pnpm lint -- --fix"
  
  exit 1
else
  echo ""
  echo "✅ Nenhum import ou variável não utilizado encontrado!"
  exit 0
fi
