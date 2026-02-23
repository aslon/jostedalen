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
├── index.html          # Page unique (single page)
├── css/creative.css    # Styles custom
├── js/creative.js      # JS custom (smooth scroll, navbar scroll, animations)
├── img/                # Images (JPG + WebP)
│   ├── head.webp       # Image header
│   ├── rdc.jpg/webp    # Plans du chalet
│   ├── etage*.jpg/webp
│   └── chalet/         # Photos du chalet (s001-s017)
├── CNAME               # Domaine: www.location-chalet-jostedalen.com
└── README.md
```

## Design
- Palette: bleu fonce `#2E4057`, dore `#D4924B`, clair `#F5F0EB`
- Navbar fixe transparente, devient blanche au scroll
- Sections alternees: `.bg-primary-darken` (bleu) / `.bg-primary` (clair)

## Deployment
- GitHub Pages (branche master)
- Domaine custom via CNAME

## Commands
- Serveur local: `python3 -m http.server 8080`

## Important Notes
- Les SRI integrity hashes des CDN doivent correspondre exactement aux fichiers servis. Toujours verifier avec `openssl dgst -sha384 -binary <file> | openssl base64 -A` en cas de doute.
- Le site est en francais.