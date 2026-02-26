/**
 * Language switcher for Chalet Jostedalen multilingual site.
 * - Detects browser language on first visit
 * - Shows a suggestion banner (no auto-redirect)
 * - Stores preference in localStorage
 * - Highlights active language in navbar dropdown
 */
(function () {
  'use strict';

  var SUPPORTED_LANGS = ['fr', 'en', 'nl', 'de', 'it'];
  var DEFAULT_LANG = 'fr';
  var STORAGE_KEY = 'chalet_lang_pref';

  var LANG_NAMES = {
    fr: { en: 'anglais', nl: 'n\u00e9erlandais', de: 'allemand', it: 'italien', fr: 'fran\u00e7ais' },
    en: { fr: 'French', nl: 'Dutch', de: 'German', it: 'Italian', en: 'English' },
    nl: { fr: 'Frans', en: 'Engels', de: 'Duits', it: 'Italiaans', nl: 'Nederlands' },
    de: { fr: 'Franz\u00f6sisch', en: 'Englisch', nl: 'Niederl\u00e4ndisch', it: 'Italienisch', de: 'Deutsch' },
    it: { fr: 'francese', en: 'inglese', nl: 'olandese', de: 'tedesco', it: 'italiano' }
  };

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

  function showLanguageSuggestion() {
    if (localStorage.getItem(STORAGE_KEY)) {
      return;
    }

    var currentLang = getCurrentLang();
    var browserLang = detectBrowserLang();

    if (browserLang === currentLang) {
      localStorage.setItem(STORAGE_KEY, currentLang);
      return;
    }

    var banner = document.getElementById('langSuggestion');
    if (!banner) { return; }

    var langName = (LANG_NAMES[currentLang] && LANG_NAMES[currentLang][browserLang]) || browserLang;

    var textEl = banner.querySelector('.lang-suggestion-text');
    if (textEl) {
      textEl.textContent = textEl.textContent.replace(/\{lang\}/g, langName);
    }

    var switchBtn = document.getElementById('langSwitchBtn');
    if (switchBtn) {
      switchBtn.textContent = switchBtn.textContent.replace(/\{lang\}/g, langName);
      switchBtn.href = getLangUrl(browserLang);
      switchBtn.addEventListener('click', function () {
        localStorage.setItem(STORAGE_KEY, browserLang);
      });
    }

    var stayBtn = document.getElementById('langStayBtn');
    if (stayBtn) {
      stayBtn.addEventListener('click', function () {
        localStorage.setItem(STORAGE_KEY, currentLang);
        banner.style.display = 'none';
      });
    }

    banner.style.display = '';
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
      });
    }
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', function () {
    highlightActiveLang();
    setupSwitcher();
    showLanguageSuggestion();
  });
})();
