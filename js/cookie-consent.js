(function () {
  var STORAGE_KEY = 'chalet_cookie_consent';
  var EXPIRY_DAYS = 180; // 6 months

  function getConsent() {
    try {
      var data = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!data || !data.timestamp) return null;
      var age = Date.now() - data.timestamp;
      if (age > EXPIRY_DAYS * 24 * 60 * 60 * 1000) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return data.accepted;
    } catch (e) {
      return null;
    }
  }

  function setConsent(accepted) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      accepted: accepted,
      timestamp: Date.now()
    }));
    if (accepted) {
      loadGTM();
    }
    hideBanner();
  }

  function loadGTM() {
    var gtmMeta = document.querySelector('meta[name="gtm-id"]');
    var gtmId = gtmMeta ? gtmMeta.getAttribute('content') : '';
    if (!gtmId || window._gtmLoaded) return;
    window._gtmLoaded = true;

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

    // Inject GTM script
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtm.js?id=' + gtmId;
    document.head.appendChild(s);
  }

  function showBanner() {
    var banner = document.getElementById('cookieConsent');
    if (banner) banner.style.display = '';
  }

  function hideBanner() {
    var banner = document.getElementById('cookieConsent');
    if (banner) banner.style.display = 'none';
  }

  function init() {
    var consent = getConsent();
    if (consent === true) {
      loadGTM();
      return;
    }
    if (consent === false) {
      return;
    }
    // No preference yet — show banner
    showBanner();

    var acceptBtn = document.getElementById('cookieAccept');
    var rejectBtn = document.getElementById('cookieReject');
    if (acceptBtn) acceptBtn.addEventListener('click', function () { setConsent(true); });
    if (rejectBtn) rejectBtn.addEventListener('click', function () { setConsent(false); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
