#!/usr/bin/env python3
"""Build script for multilingual Chalet Jostedalen website.

Reads src/template.html and src/llms-template.txt, applies translations
from lang/*.json, and generates static HTML pages + sitemap.xml.

Usage: python3 build.py
"""

import json
import os
import re
import sys
from datetime import date

try:
    import rcssmin
    import rjsmin
    HAS_MINIFIERS = True
except ImportError:
    HAS_MINIFIERS = False

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DOMAIN = "https://www.location-chalet-jostedalen.com"
LANGUAGES = ["fr", "en", "nl", "de", "it"]
DEFAULT_LANG = "fr"


def load_template(filename):
    path = os.path.join(BASE_DIR, "src", filename)
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def load_translations(lang):
    path = os.path.join(BASE_DIR, "lang", f"{lang}.json")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def generate_hreflang_tags():
    """Generate reciprocal hreflang link tags for all languages."""
    lines = []
    for lang in LANGUAGES:
        if lang == DEFAULT_LANG:
            url = f"{DOMAIN}/"
        else:
            url = f"{DOMAIN}/{lang}/"
        lines.append(f'    <link rel="alternate" hreflang="{lang}" href="{url}">')
    # x-default points to the default language
    lines.append(f'    <link rel="alternate" hreflang="x-default" href="{DOMAIN}/">')
    return "\n".join(lines)


def generate_sitemap():
    """Generate sitemap.xml with hreflang alternates."""
    today = date.today().isoformat()
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
        '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ]

    for lang in LANGUAGES:
        if lang == DEFAULT_LANG:
            loc = f"{DOMAIN}/"
        else:
            loc = f"{DOMAIN}/{lang}/"

        lines.append("  <url>")
        lines.append(f"    <loc>{loc}</loc>")
        lines.append(f"    <lastmod>{today}</lastmod>")
        lines.append("    <changefreq>monthly</changefreq>")
        lines.append("    <priority>1.0</priority>")

        # Add hreflang alternates
        for alt_lang in LANGUAGES:
            if alt_lang == DEFAULT_LANG:
                alt_url = f"{DOMAIN}/"
            else:
                alt_url = f"{DOMAIN}/{alt_lang}/"
            lines.append(
                f'    <xhtml:link rel="alternate" hreflang="{alt_lang}" href="{alt_url}"/>'
            )
        lines.append(
            f'    <xhtml:link rel="alternate" hreflang="x-default" href="{DOMAIN}/"/>'
        )

        lines.append("  </url>")

    lines.append("</urlset>")
    return "\n".join(lines)


def apply_translations(template, translations, hreflang_tags):
    """Replace {{key}} placeholders with translation values."""
    result = template

    # Flatten _meta keys into top-level
    meta = translations.get("_meta", {})
    flat = {}
    flat.update(meta)
    for key, value in translations.items():
        if key != "_meta":
            flat[key] = value

    # Add generated values
    flat["hreflang_tags"] = hreflang_tags

    # Compute llms.txt URL
    lang_code = meta.get("lang_code", "fr")
    if lang_code == DEFAULT_LANG:
        flat["llms_txt_url"] = "/llms.txt"
    else:
        flat["llms_txt_url"] = f"/{lang_code}/llms.txt"

    # Replace all {{key}} placeholders
    def replace_placeholder(match):
        key = match.group(1)
        if key in flat:
            return str(flat[key])
        return match.group(0)  # Leave unreplaced

    result = re.sub(r"\{\{(\w+)\}\}", replace_placeholder, result)

    # Check for unreplaced placeholders (ignore inline_css, replaced separately)
    unreplaced = re.findall(r"\{\{(\w+)\}\}", result)
    if unreplaced:
        unique = sorted(set(unreplaced) - {"inline_css"})
        if unique:
            print(f"  WARNING: Unreplaced placeholders for {meta.get('lang_code', '?')}: {', '.join(unique)}")

    return result


def write_file(filepath, content):
    """Write content to file, creating directories as needed."""
    os.makedirs(os.path.dirname(filepath) or ".", exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)


def minify_assets():
    """Minify CSS and JS files, creating .min versions."""
    if not HAS_MINIFIERS:
        print("  WARNING: rcssmin/rjsmin not installed, skipping minification")
        print("           Install with: pip3 install rcssmin rjsmin")
        return

    # CSS files
    css_files = ["css/creative.css", "css/critical.css"]
    for css in css_files:
        src = os.path.join(BASE_DIR, css)
        dst = os.path.join(BASE_DIR, css.replace(".css", ".min.css"))
        with open(src, "r", encoding="utf-8") as f:
            original = f.read()
        minified = rcssmin.cssmin(original)
        with open(dst, "w", encoding="utf-8") as f:
            f.write(minified)
        saving = 100 - (len(minified) / len(original) * 100)
        print(f"  {css} -> {os.path.basename(dst)} ({saving:.0f}% smaller)")

    # JS files
    js_files = [
        "js/creative.js",
        "js/tarifs.js",
        "js/lightbox.js",
        "js/reviews-carousel.js",
        "js/lang-switcher.js",
        "js/cookie-consent.js",
    ]
    for js in js_files:
        src = os.path.join(BASE_DIR, js)
        dst = os.path.join(BASE_DIR, js.replace(".js", ".min.js"))
        with open(src, "r", encoding="utf-8") as f:
            original = f.read()
        minified = rjsmin.jsmin(original)
        with open(dst, "w", encoding="utf-8") as f:
            f.write(minified)
        saving = 100 - (len(minified) / len(original) * 100)
        print(f"  {js} -> {os.path.basename(dst)} ({saving:.0f}% smaller)")


def build_inline_css():
    """Build inline CSS from critical Bootstrap subset + creative styles."""
    parts = []
    for css_file in ["css/critical.min.css", "css/creative.min.css"]:
        path = os.path.join(BASE_DIR, css_file)
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
        parts.append(content)
    inline = "".join(parts)
    # Fix relative URLs for inline use (../img/ -> /img/)
    inline = inline.replace("../img/", "/img/")
    print(f"  Inline CSS: {len(inline)} bytes (critical + creative)")
    return inline


def main():
    print("Building multilingual site...")

    # Minify CSS/JS first (needed for inline CSS)
    print("  Minifying assets...")
    minify_assets()

    # Build inline CSS (critical Bootstrap + creative)
    inline_css = build_inline_css()

    # Load templates
    html_template = load_template("template.html")
    llms_template = load_template("llms-template.txt")

    # Generate hreflang tags (shared across all pages)
    hreflang_tags = generate_hreflang_tags()

    # Build each language
    for lang in LANGUAGES:
        print(f"  Building {lang}...")
        translations = load_translations(lang)

        # Generate HTML
        html = apply_translations(html_template, translations, hreflang_tags)

        # Inject inline CSS (done via string replace to avoid regex issues with CSS content)
        html = html.replace("/* {{inline_css}} */", inline_css)

        # Generate llms.txt
        llms = apply_translations(llms_template, translations, hreflang_tags)

        # Determine output paths
        if lang == DEFAULT_LANG:
            html_path = os.path.join(BASE_DIR, "index.html")
            llms_path = os.path.join(BASE_DIR, "llms.txt")
        else:
            html_path = os.path.join(BASE_DIR, lang, "index.html")
            llms_path = os.path.join(BASE_DIR, lang, "llms.txt")

        write_file(html_path, html)
        write_file(llms_path, llms)

    # Generate 404 page (single file with JS-based language detection)
    error_template_path = os.path.join(BASE_DIR, "src", "404-template.html")
    if os.path.exists(error_template_path):
        print("  Building 404.html...")
        with open(error_template_path, "r", encoding="utf-8") as f:
            error_html = f.read()
        write_file(os.path.join(BASE_DIR, "404.html"), error_html)

    # Generate sitemap
    print("  Building sitemap.xml...")
    sitemap = generate_sitemap()
    write_file(os.path.join(BASE_DIR, "sitemap.xml"), sitemap)

    print("Done! Generated files:")
    print("  - index.html (FR)")
    print("  - llms.txt (FR)")
    for lang in LANGUAGES:
        if lang != DEFAULT_LANG:
            print(f"  - {lang}/index.html")
            print(f"  - {lang}/llms.txt")
    print("  - 404.html")
    print("  - sitemap.xml")


if __name__ == "__main__":
    main()
