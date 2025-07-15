#!/bin/bash

# Script de validação do Respawn Diário
echo "🎮 Validando projeto Respawn Diário..."

# Verificar se todos os arquivos principais existem
files=(
    "index.html"
    "pages/sobre.html"
    "pages/contato.html"
    "assets/css/base.css"
    "assets/css/style.css"
    "assets/css/components.css"
    "assets/css/responsive.css"
    "assets/js/config.js"
    "assets/js/main.js"
    "assets/js/posts.js"
    "assets/js/components.js"
    "data/posts.json"
    "manifest.json"
    "robots.txt"
    "README.md"
    "DOCS.md"
)

echo "📁 Verificando arquivos principais..."
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (FALTANDO)"
    fi
done

echo ""
echo "📊 Estatísticas do projeto:"
echo "📄 Arquivos HTML: $(find . -name "*.html" | wc -l)"
echo "🎨 Arquivos CSS: $(find . -name "*.css" | wc -l)"
echo "⚡ Arquivos JS: $(find . -name "*.js" | wc -l)"
echo "📋 Arquivos JSON: $(find . -name "*.json" | wc -l)"
echo "📝 Arquivos MD: $(find . -name "*.md" | wc -l)"

echo ""
echo "💾 Tamanho total: $(du -sh . | cut -f1)"

echo ""
echo "🔍 Verificando sintaxe dos arquivos..."

# Verificar se os arquivos HTML têm estrutura básica
for html_file in $(find . -name "*.html"); do
    if grep -q "<!DOCTYPE html>" "$html_file" && grep -q "</html>" "$html_file"; then
        echo "✅ $html_file (HTML válido)"
    else
        echo "⚠️  $html_file (HTML possivelmente inválido)"
    fi
done

# Verificar se os arquivos CSS têm pelo menos uma regra
for css_file in $(find . -name "*.css"); do
    if [ -s "$css_file" ]; then
        echo "✅ $css_file (CSS não vazio)"
    else
        echo "⚠️  $css_file (CSS vazio)"
    fi
done

echo ""
echo "🚀 Validação concluída!"
echo ""
echo "Para visualizar o site:"
echo "1. Abra o VS Code no diretório do projeto"
echo "2. Instale a extensão 'Live Server'"
echo "3. Clique com botão direito no index.html"
echo "4. Selecione 'Open with Live Server'"
echo ""
echo "🎮 Respawn Diário - Seu checkpoint gamer diário!"
