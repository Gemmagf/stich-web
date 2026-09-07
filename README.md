# STICH — web dels tallers de costura (Zúric)

Web estàtica a GitHub Pages: https://gemmagf.github.io/stich-web/ · Sis idiomes (DE per defecte, EN, FR, IT, CA, ES).

## On són les dades (font de veritat)
Tot el que canvia sovint és a `data/`, en JSON, i la web ho llegeix en carregar. No cal reconstruir res per publicar un canvi de dades: un commit a `data/` i Pages ho serveix en un minut.
- `data/kits.json` — catàleg. Camps: `id`, `n`, `format` (short/sat/long), `level` (1–3), `accent`, `icon`, `active`, `name{6 idiomes}`, `desc{6 idiomes}`.
- `data/sessions.json` — sessions: `id`, `date` (AAAA-MM-DD), `format`, `kits[]`, `capacity`, `seats` (lliures), `status` (open/full/done), `note`. Les passades o "done" no surten a la web.
- `data/settings.json` — email de reserves, preu del kit sol, preus i hores dels tres formats, els 4 destacats de la portada, fotos disponibles.
- `data/guides/<id>.json` — guia pas a pas d'un kit, en sis idiomes. Fotos a `img/guides/<id>/`.

## Administració (`admin.html`)
Pàgina només per a la Gemma, sense enllaç públic. Edita sessions, kits i configuració i fa el commit directament al repositori amb un token de GitHub que només es guarda al navegador.

Crear el token (una sola vegada): GitHub → Settings → Developer settings → Personal access tokens → **Fine-grained tokens** → Generate new token. Repository access: *Only select repositories* → `stich-web`. Permissions → Repository permissions → **Contents: Read and write**. Copia'l, enganxa'l a la casella de l'admin i prem *Connecta*. No el comparteixis: qui el tingui pot escriure al repositori.

## Codi
- `index.html`, `kit.html`, `admin.html` — generats. **No els editis a mà**: edita `src/` i executa `./build.sh`, després `git commit` i `git push`.
- `src/styles.css`, `src/i18n.js` (textos de pàgina, sis idiomes), `src/data.js` (carrega els JSON; si falla, usa la còpia incrustada al build), `src/icons.js` (il·lustracions de substitució), `src/app.js` (portada), `src/kit.js` (pàgina de kit amb compra simulada guardada a `localStorage`), `src/admin.js`, `src/pictos/` (pictogrames).
- `kit.html?id=<id>` mostra descripció i materials; la guia es desbloqueja amb el botó de compra (simulació).

## Pendent
- Fotos reals: deixa-les a `img/` (vegeu `img/README.md`) i afegeix-les a "Fotos disponibles" a l'admin.
- Email i dates definitives; barra d'avís d'esborrany (`.notice` a `src/body.html`).
- Pagament real per als kits (Stripe Payment Links o Twint) quan es decideixi.
