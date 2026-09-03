# STICH — web dels tallers de costura (Zúric)

Pàgina única, autocontinguda, sense backend. Sis idiomes (DE per defecte, EN, FR, IT, CA, ES).

## Publicació
GitHub Pages serveix `index.html` des de la branca `main`. Per publicar canvis: edita `src/`, `./build.sh`, `git commit -am "..."`, `git push`.

## Fitxers
- `index.html` — la web sencera, generada. **No l'editis a mà**: edita `src/` i executa `./build.sh`.
- `src/styles.css` — estils (paleta i tipografia de les guidelines STICH). Tema clar per defecte; el fosc només amb el botó de la capçalera.
- `src/i18n.js` — tots els textos de pàgina, `I18N[lang][clau]`.
- `src/kits.js` — els 19 kits (nom i descripció en sis idiomes, format, nivell, color), els formats i preus, les dates i l'email.
- `src/body.html` — el marcatge. Cap text literal: tot surt de `data-i18n`.
- `src/app.js` — idioma, filtres, dates, menú, animacions i les il·lustracions de substitució de les targetes.
- `src/pictos/` — els nou pictogrames line-art (SVG editables). `build.sh` els incrusta on hi ha `<!--picto:nom-->` a `body.html`; amb `|#color` hi afegeix la taca pastel al darrere.

## Què cal substituir abans de fer-la pública
- `CONTACT_EMAIL` a `src/kits.js` (ara `hallo@stich-zuerich.ch`, marcador de posició).
- `DATES` a `src/kits.js` (quatre dissabtes d'exemple; `seats` = places lliures de 6).
- El lloc (textos `space_note`, `info1_t` a `src/i18n.js`): ara diu Zúric, Kreis 5, pendent de confirmar.
- Les fotos: les targetes i les tres imatges grans són il·lustracions SVG provisionals. Quan hi hagi fotos reals, substitueix el `<svg class="ph">` per `<img class="ph" src=... alt=...>` (format 4:5 a les targetes).
- La barra d'avís d'esborrany (`.notice` a `src/body.html`).

## Afegir o canviar un kit
Afegeix una entrada a `KITS` amb `id`, `format` (short/sat/long), `level` (1–3), `accent` (coral/sage/mustard/blue/pink/yellow), `icon` i `name`/`desc` en els sis idiomes. Les targetes es generen soles.
