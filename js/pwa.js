/*
 * Grats — PWA controller
 * Registers the service worker and manages a non-intrusive, accessible install experience.
 *  - Chromium/Edge/Samsung: native beforeinstallprompt → custom Install button.
 *  - iOS Safari (no beforeinstallprompt): subtle "Add to Home Screen" hint.
 *  - Respects user dismissal (snoozed for 14 days) and hides when already installed.
 */
(function () {
  'use strict';

  var DISMISS_KEY = 'grats-pwa-dismissed';
  var SNOOZE_MS = 14 * 24 * 60 * 60 * 1000; // 14 days
  var deferredPrompt = null;
  var banner = null;

  /* ---------- helpers ---------- */
  function isStandalone() {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: minimal-ui)').matches ||
      window.navigator.standalone === true
    );
  }

  function isIOS() {
    var ua = window.navigator.userAgent;
    var iOSDevice = /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); // iPadOS 13+
    var isSafari = /^((?!chrome|android|crios|fxios|edgios).)*safari/i.test(ua);
    return iOSDevice && isSafari;
  }

  function recentlyDismissed() {
    try {
      var ts = parseInt(localStorage.getItem(DISMISS_KEY), 10);
      return ts && (Date.now() - ts) < SNOOZE_MS;
    } catch (e) { return false; }
  }

  function rememberDismissal() {
    try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch (e) { /* noop */ }
  }

  /* ---------- install banner UI ---------- */
  function buildBanner(opts) {
    if (banner) return banner;
    var el = document.createElement('div');
    el.className = 'pwa-install-banner';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'Install Grats app');
    el.innerHTML =
      '<div class="pwa-install-icon" aria-hidden="true">' +
        '<img src="img/icon-192.png" alt="" width="40" height="40">' +
      '</div>' +
      '<div class="pwa-install-copy">' +
        '<span class="pwa-install-title">Install Grats</span>' +
        '<span class="pwa-install-text">' + opts.text + '</span>' +
      '</div>' +
      '<div class="pwa-install-actions">' +
        (opts.showAction ? '<button type="button" class="pwa-install-btn" id="pwa-install-action">Install</button>' : '') +
        '<button type="button" class="pwa-install-close" id="pwa-install-close" aria-label="Dismiss install prompt">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
        '</button>' +
      '</div>';

    document.body.appendChild(el);
    banner = el;

    el.querySelector('#pwa-install-close').addEventListener('click', function () {
      rememberDismissal();
      hideBanner();
    });

    var action = el.querySelector('#pwa-install-action');
    if (action) action.addEventListener('click', opts.onAction);

    // Reveal on next frame for the slide-in transition.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { el.classList.add('visible'); });
    });
    return el;
  }

  function hideBanner() {
    if (!banner) return;
    banner.classList.remove('visible');
    var node = banner;
    banner = null;
    setTimeout(function () { if (node && node.parentNode) node.parentNode.removeChild(node); }, 350);
  }

  function showNativeInstall() {
    buildBanner({
      text: 'Add to your device for instant, offline access.',
      showAction: true,
      onAction: function () {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(function (choice) {
          if (choice && choice.outcome === 'accepted') {
            hideBanner();
          } else {
            rememberDismissal();
            hideBanner();
          }
          deferredPrompt = null;
        });
      }
    });
  }

  function showIOSHint() {
    buildBanner({
      text: 'Tap the Share icon, then "Add to Home Screen".',
      showAction: false
    });
  }

  /* ---------- install lifecycle ---------- */
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;
    if (isStandalone() || recentlyDismissed()) return;
    showNativeInstall();
  });

  window.addEventListener('appinstalled', function () {
    deferredPrompt = null;
    hideBanner();
    try { localStorage.removeItem(DISMISS_KEY); } catch (e) { /* noop */ }
  });

  // iOS has no beforeinstallprompt — offer a gentle hint after the page settles.
  window.addEventListener('load', function () {
    if (isIOS() && !isStandalone() && !recentlyDismissed()) {
      setTimeout(showIOSHint, 3500);
    }
  });

  /* ---------- service worker registration ---------- */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js', { scope: '/' })
        .then(function (reg) {
          // Periodically check for updates so long-lived tabs stay fresh.
          if (reg.update) {
            setInterval(function () { reg.update().catch(function () {}); }, 60 * 60 * 1000);
          }
        })
        .catch(function (err) {
          console.warn('Service worker registration failed:', err);
        });

      // Apply updates seamlessly without forcing a disruptive reload loop.
      var refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', function () {
        if (refreshing) return;
        refreshing = true;
      });
    });
  }
})();
