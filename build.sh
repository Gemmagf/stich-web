#!/bin/sh
# Builds index.html (standalone, self-contained) from src/
set -e
cd "$(dirname "$0")"
FONTS='<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap" rel="stylesheet">'
{
  echo '<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
  echo '<title>STICH — Sewing workshops, Zürich</title>'
  echo '<meta name="description" content="Nähworkshops mit vorbereiteten Kits in Zürich. Sechs Plätze, ein Samstag, du gehst mit etwas Fertigem nach Hause.">'
  echo "$FONTS"
  echo '<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 32 32%27%3E%3Ccircle cx=%2716%27 cy=%2716%27 r=%2716%27 fill=%27%23CF6446%27/%3E%3Ctext x=%2716%27 y=%2722%27 font-size=%2718%27 text-anchor=%27middle%27 fill=%27%23fff%27 font-family=%27serif%27%3ES%3C/text%3E%3C/svg%3E">'
  echo '<style>'; cat src/styles.css; echo '</style></head><body>'
  cat src/body.html
  echo '<script>'; cat src/i18n.js src/kits.js src/app.js; echo '</script>'
  echo '</body></html>'
} > index.html
echo "built index.html ($(wc -c < index.html) bytes)"
