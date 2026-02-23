# Chalet Jostedalen - Site Web

## Project Overview
Site vitrine pour la location du Chalet Jostedalen a Saint-Sorlin d'Arves (Savoie). Site statique heberge sur GitHub Pages.

## Tech Stack
- HTML5 / CSS3 / Vanilla JS (pas de framework JS)
- Bootstrap 5.3.3 (CDN avec SRI integrity hashes)
- Bootstrap Icons 1.11.3
- Google Fonts: Merriweather + Open Sans

## Project Structure
```
/
├── build.py                # Script generation multilangue
├── src/
│   ├── template.html       # Template HTML avec {{placeholders}}
│   └── llms-template.txt   # Template llms.txt
├── lang/
│   ├── fr.json             # Traductions FR
│   ├── en.json             # Traductions EN
│   ├── nl.json             # Traductions NL
│   └── de.json             # Traductions DE
├── index.html              # GENERE (FR, defaut)
├── en/index.html           # GENERE
├── nl/index.html           # GENERE
├── de/index.html           # GENERE
├── css/creative.css        # Styles custom
├── js/creative.js          # JS custom (smooth scroll, navbar scroll, animations)
├── js/lang-switcher.js     # Detection langue + dropdown navbar
├── img/                    # Images (JPG + WebP)
│   ├── head.webp           # Image header
│   ├── rdc.jpg/webp        # Plans du chalet
│   ├── etage*.jpg/webp
│   └── chalet/             # Photos du chalet (s001-s017)
├── CNAME                   # Domaine: www.location-chalet-jostedalen.com
└── README.md
```

## Design
- Palette: bleu fonce `#2E4057`, dore `#D4924B`, clair `#F5F0EB`
- Navbar fixe transparente, devient blanche au scroll
- Sections alternees: `.bg-primary-darken` (bleu) / `.bg-primary` (clair)

## Deployment
- GitHub Pages (branche master)
- Domaine custom via CNAME

## Multilingual

Le site est disponible en 4 langues : FR (defaut), EN, NL, DE.

### Architecture
- `src/template.html` : template HTML avec `{{placeholders}}`
- `src/llms-template.txt` : template llms.txt avec `{{placeholders}}`
- `lang/fr.json`, `lang/en.json`, `lang/nl.json`, `lang/de.json` : traductions (~155 cles)
- `build.py` : script de generation (Python 3, stdlib only)
- `js/lang-switcher.js` : detection langue navigateur + dropdown navbar

### Fichiers generes (NE PAS MODIFIER A LA MAIN)
- `index.html` (FR, defaut)
- `en/index.html`, `nl/index.html`, `de/index.html`
- `llms.txt` (FR), `en/llms.txt`, `nl/llms.txt`, `de/llms.txt`
- `sitemap.xml`

### Workflow de modification
1. Modifier le contenu dans `lang/*.json`
2. Modifier la structure dans `src/template.html` ou `src/llms-template.txt`
3. Lancer `python3 build.py`
4. Verifier sur `http://localhost:8080/` et `/en/`, `/nl/`, `/de/`
5. Commit les fichiers generes

### Ajouter une langue
1. Creer `lang/xx.json` (copier `lang/fr.json` et traduire)
2. Ajouter `"xx"` dans `LANGUAGES` dans `build.py`
3. Ajouter le lien dans le dropdown de `src/template.html`
4. Lancer `python3 build.py`

### Ajouter du contenu
1. Ajouter le placeholder `{{ma_cle}}` dans `src/template.html`
2. Ajouter `"ma_cle": "valeur"` dans chaque `lang/*.json`
3. Lancer `python3 build.py`

## Commands
- Serveur local: `python3 -m http.server 8080`
- Build multilangue: `python3 build.py`

## Important Notes
- Les SRI integrity hashes des CDN doivent correspondre exactement aux fichiers servis. Toujours verifier avec `openssl dgst -sha384 -binary <file> | openssl base64 -A` en cas de doute.
- Le site est en francais (langue par defaut), avec versions EN, NL, DE.