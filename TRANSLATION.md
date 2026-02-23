# Guide de traduction - Chalet Jostedalen

## Architecture

```
lang/
├── fr.json   # Français (langue par défaut)
├── en.json   # English
├── nl.json   # Nederlands
└── de.json   # Deutsch
```

Chaque fichier JSON contient ~155 clés de traduction. La structure est identique dans les 4 fichiers.

## Modifier une traduction existante

1. Ouvrir le fichier `lang/<code_langue>.json`
2. Trouver la clé à modifier (voir [Référence des clés](#référence-des-clés))
3. Modifier la valeur
4. Lancer le build :

```bash
python3 build.py
```

5. Vérifier sur le serveur local :

```bash
python3 -m http.server 8080
# Ouvrir http://localhost:8080/ (FR)
# Ouvrir http://localhost:8080/en/ (EN)
# Ouvrir http://localhost:8080/nl/ (NL)
# Ouvrir http://localhost:8080/de/ (DE)
```

## Ajouter du contenu traduisible

### Étape 1 : Ajouter le placeholder dans le template

Ouvrir `src/template.html` et ajouter `{{ma_nouvelle_cle}}` à l'endroit voulu.

Convention de nommage : `section_soussection_element` en snake_case.

Exemples :
- `{{nav_contact}}` → élément de navigation
- `{{equip_kitchen_3}}` → 3ème équipement cuisine
- `{{photo_alt_5}}` → texte alternatif de la 5ème photo

### Étape 2 : Ajouter la traduction dans chaque langue

Ajouter la clé dans **les 4 fichiers** `lang/*.json` :

```json
// lang/fr.json
"ma_nouvelle_cle": "Texte en français"

// lang/en.json
"ma_nouvelle_cle": "Text in English"

// lang/nl.json
"ma_nouvelle_cle": "Tekst in het Nederlands"

// lang/de.json
"ma_nouvelle_cle": "Text auf Deutsch"
```

### Étape 3 : Rebuilder

```bash
python3 build.py
```

Si une clé est manquante, le script affiche un WARNING avec le nom du placeholder non remplacé.

## Ajouter une nouvelle langue

1. Copier `lang/fr.json` vers `lang/xx.json`
2. Traduire toutes les valeurs
3. Modifier la section `_meta` :

```json
"_meta": {
    "html_lang": "xx",
    "og_locale": "xx_XX",
    "lang_code": "xx",
    "lang_name": "Nom de la langue",
    "lang_url_prefix": "xx",
    "canonical_url": "https://www.location-chalet-jostedalen.com/xx/"
}
```

4. Ajouter `"xx"` dans la liste `LANGUAGES` de `build.py` :

```python
LANGUAGES = ["fr", "en", "nl", "de", "xx"]
```

5. Ajouter le lien dans le dropdown de `src/template.html` :

```html
<li><a class="dropdown-item" href="/xx/" data-lang="xx">Nom de la langue</a></li>
```

6. Ajouter `"xx"` dans `SUPPORTED_LANGS` de `js/lang-switcher.js` :

```javascript
var SUPPORTED_LANGS = ['fr', 'en', 'nl', 'de', 'xx'];
```

7. Lancer `python3 build.py`

## Référence des clés

### Métadonnées (`_meta`)

| Clé | Description | Exemple (FR) |
|-----|-------------|--------------|
| `html_lang` | Attribut `<html lang>` | `fr` |
| `og_locale` | Open Graph locale | `fr_FR` |
| `lang_code` | Code langue | `fr` |
| `lang_name` | Nom affiché dans le dropdown | `Français` |
| `canonical_url` | URL canonique | `https://www.location-chalet-jostedalen.com/` |

### SEO & Meta

| Clé | Où c'est affiché |
|-----|------------------|
| `meta_title` | `<title>` |
| `meta_description` | `<meta name="description">` |
| `og_title` | Open Graph title |
| `og_description` | Open Graph description |
| `twitter_title` | Twitter Card title |
| `twitter_description` | Twitter Card description |

### JSON-LD (Schema.org)

| Clé | Description |
|-----|-------------|
| `jsonld_description` | Description du chalet |
| `jsonld_amenity_*` | Noms des équipements (wifi, jacuzzi, garage...) |
| `jsonld_accommodation_category` | Type d'hébergement |

### Navigation

| Clé | Élément |
|-----|---------|
| `nav_chalet` | Lien "Le chalet" |
| `nav_plans` | Lien "Plans" |
| `nav_equipements` | Lien "Equipements" |
| `nav_photos` | Lien "Photos" |
| `nav_contact` | Lien "Contact" |
| `nav_tarifs` | Lien "Tarifs" |

### Header

| Clé | Contenu |
|-----|---------|
| `header_title` | Titre principal |
| `header_location` | Lieu + altitude |
| `header_features` | Surface, chambres, jacuzzi |
| `header_capacity` | Nombre de personnes |
| `header_ski` | Info domaine skiable |

### Sections

Les clés suivent le format `section_xxx_yyy` :

- `section_chalet_*` → Description du chalet
- `chalet_rooms_1` à `chalet_rooms_7` → Liste des pièces
- `chalet_nearby_1` à `chalet_nearby_7` → Proximité et activités
- `plan_alt_*` → Textes alternatifs des plans
- `section_equip_*`, `equip_kitchen_*`, `equip_media_*`, `equip_baby_*` → Équipements
- `photo_alt_1` à `photo_alt_18` → Textes alternatifs des photos
- `contact_*` → Section contact

### Messages WhatsApp / SMS

| Clé | Attention |
|-----|-----------|
| `contact_whatsapp_message` | Doit être URL-encodé (`%20` pour espace, `%2C` pour virgule) |
| `contact_sms_message` | Idem |

### llms.txt

Toutes les clés commençant par `llms_` sont utilisées dans le fichier `llms.txt` destiné aux agents IA. Le contenu doit être en texte brut (pas d'entités HTML).

## Fichiers générés (ne pas modifier)

- `index.html` → généré depuis `src/template.html` + `lang/fr.json`
- `en/index.html` → généré depuis `src/template.html` + `lang/en.json`
- `nl/index.html` → idem NL
- `de/index.html` → idem DE
- `llms.txt`, `en/llms.txt`, `nl/llms.txt`, `de/llms.txt` → générés depuis `src/llms-template.txt`
- `sitemap.xml` → généré avec hreflang pour les 4 langues
- `404.html` → copié depuis `src/404-template.html` (multilingue via JS)

## Consentement cookies (GDPR)

Le bandeau de consentement est géré par `js/cookie-consent.js`. Par défaut, **aucun script de tracking** (GTM, GA4, Meta Pixel) n'est chargé. GTM ne se charge que si l'utilisateur clique "Accepter".

- Préférence stockée dans `localStorage` (`chalet_cookie_consent`)
- Expiration : 6 mois
- Clés de traduction : `cookie_message`, `cookie_accept`, `cookie_reject`, `cookie_learn_more`

## Configurer le Meta Pixel (Facebook) dans GTM

Le Meta Pixel doit être configuré **dans Google Tag Manager**, pas dans le code du site. Cela permet de respecter le consentement cookies (GTM ne charge que si l'utilisateur accepte).

### Étapes

1. **Accéder à GTM** : [tagmanager.google.com](https://tagmanager.google.com)
2. **Ouvrir le conteneur** `GTM-552T5L7T`
3. **Créer un tag "Custom HTML"** :
   - Nom : `Meta Pixel - Base`
   - Type : HTML personnalisé
   - Coller le code du Meta Pixel fourni par Facebook :

   ```html
   <script>
   !function(f,b,e,v,n,t,s)
   {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
   n.callMethod.apply(n,arguments):n.queue.push(arguments)};
   if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
   n.queue=[];t=b.createElement(e);t.async=!0;
   t.src=v;s=b.getElementsByTagName(e)[0];
   s.parentNode.insertBefore(t,s)}(window, document,'script',
   'https://connect.facebook.net/en_US/fbevents.js');
   fbq('init', 'VOTRE_PIXEL_ID');
   fbq('track', 'PageView');
   </script>
   ```

   - Remplacer `VOTRE_PIXEL_ID` par l'ID du pixel (disponible dans Meta Business Suite > Événements > Pixels)

4. **Configurer le déclencheur** : `All Pages` (toutes les pages)
5. **Publier** le conteneur GTM

### Événements supplémentaires (optionnel)

Pour tracker des événements spécifiques (clic sur "Contact", soumission de formulaire), créer des tags supplémentaires dans GTM :

- **Tag "Meta Pixel - Contact Click"** :
  - Type : HTML personnalisé
  - Code : `<script>fbq('track', 'Contact');</script>`
  - Déclencheur : Clic sur les liens de contact

### Vérification

1. Installer l'extension navigateur [Meta Pixel Helper](https://chrome.google.com/webstore/detail/meta-pixel-helper)
2. Visiter le site, accepter les cookies
3. L'extension doit afficher le Pixel ID et l'événement `PageView`
