/**
 * Language switcher for Chalet Jostedalen multilingual site.
 * - Detects browser language on first visit
 * - Redirects to matching language version
 * - Stores preference in localStorage
 * - Highlights active language in navbar dropdown
 */
(function () {
  'use strict';

  var SUPPORTED_LANGS = ['fr', 'en', 'nl', 'de', 'it'];
  var DEFAULT_LANG = 'fr';
  var STORAGE_KEY = 'chalet_lang_pref';

  function getCurrentLang() {
    var path = window.location.pathname;
    for (var i = 0; i < SUPPORTED_LANGS.length; i++) {
      if (path.indexOf('/' + SUPPORTED_LANGS[i] + '/') === 0) {
        return SUPPORTED_LANGS[i];
      }
    }
    return DEFAULT_LANG;
  }

  function detectBrowserLang() {
    var navLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    // Check exact match first (e.g. "nl-NL" -> "nl")
    var primary = navLang.split('-')[0];
    if (SUPPORTED_LANGS.indexOf(primary) !== -1) {
      return primary;
    }
    return DEFAULT_LANG;
  }

  function getLangUrl(lang) {
    if (lang === DEFAULT_LANG) {
      return '/';
    }
    return '/' + lang + '/';
  }

  function autoRedirect() {
    // Only redirect on first visit (no stored preference)
    if (localStorage.getItem(STORAGE_KEY)) {
      return;
    }

    var currentLang = getCurrentLang();
    var browserLang = detectBrowserLang();

    // Store current language as preference
    localStorage.setItem(STORAGE_KEY, currentLang);

    // Only auto-redirect from the default homepage (/)
    // If user navigated to /en/, /nl/, etc. explicitly, respect that choice
    var path = window.location.pathname;
    if (currentLang !== DEFAULT_LANG) {
      return;
    }

    // Redirect if browser language differs from current page
    if (browserLang !== currentLang) {
      localStorage.setItem(STORAGE_KEY, browserLang);
      window.location.href = getLangUrl(browserLang);
    }
  }

  function highlightActiveLang() {
    var currentLang = getCurrentLang();
    var items = document.querySelectorAll('#langSwitcher .dropdown-item');
    for (var i = 0; i < items.length; i++) {
      var itemLang = items[i].getAttribute('data-lang');
      if (itemLang === currentLang) {
        items[i].classList.add('active');
      } else {
        items[i].classList.remove('active');
      }
    }
  }

  function setupSwitcher() {
    var items = document.querySelectorAll('#langSwitcher .dropdown-item');
    for (var i = 0; i < items.length; i++) {
      items[i].addEventListener('click', function (e) {
        var lang = this.getAttribute('data-lang');
        localStorage.setItem(STORAGE_KEY, lang);
        // Navigation happens via href
      });
    }
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', function () {
    highlightActiveLang();
    setupSwitcher();
    autoRedirect();
  });
})();
