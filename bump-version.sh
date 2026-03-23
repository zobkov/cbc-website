#!/bin/bash
# Обновляет ?v=... у всех CSS/JS файлов во всех HTML на сайте.
# Использование:
#   ./bump-version.sh           — автоматически дата + инкремент (YYYYMMDD-N)
#   ./bump-version.sh 20260325  — задать версию вручную

set -e

HTML_DIR="$(dirname "$0")"

# Определяем новую версию
if [ -n "$1" ]; then
    NEW_VERSION="$1"
else
    DATE=$(date +%Y%m%d)
    # Найдём текущую версию в index.html
    CURRENT=$(grep -o "?v=[^\"']*" "$HTML_DIR/index.html" | head -1 | sed 's/?v=//')
    CURRENT_DATE=$(echo "$CURRENT" | cut -d'-' -f1)
    CURRENT_NUM=$(echo "$CURRENT" | cut -d'-' -f2)

    if [ "$CURRENT_DATE" = "$DATE" ] && [ -n "$CURRENT_NUM" ]; then
        NEW_NUM=$((CURRENT_NUM + 1))
    else
        NEW_NUM=1
    fi
    NEW_VERSION="${DATE}-${NEW_NUM}"
fi

echo "Устанавливаем версию: $NEW_VERSION"

# Заменяем все ?v=... во всех .html файлах
find "$HTML_DIR" -maxdepth 1 -name "*.html" | while read -r file; do
    sed -i '' "s/?v=[^\"'&]*/\?v=${NEW_VERSION}/g" "$file"
    echo "  Обновлён: $(basename "$file")"
done

echo "Готово! Версия: $NEW_VERSION"
