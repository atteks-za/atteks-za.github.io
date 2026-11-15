/*
 * Portfolio access gate.
 *
 * Visitors must be approved before they can view the portfolio. They request
 * access on request-access.html; you reply with the access code (or the invite
 * link https://portfolio.pepsnet.co.za/?access=CODE). Once a valid code is
 * entered it is remembered in that browser.
 *
 * Only the SHA-256 hash of the code lives here. To change the code, hash the
 * new one (uppercase) and replace ACCESS_HASH, e.g. in PowerShell:
 *   $c='PEPS-NEWCODE1'; -join ([Security.Cryptography.SHA256]::Create().ComputeHash([Text.Encoding]::UTF8.GetBytes($c)) | % { $_.ToString('x2') })
 * Changing the hash also signs out everyone who was approved with the old code.
 *
 * Note: GitHub Pages is static hosting, so this is a polite gate, not real
 * security. Anyone determined can read the page source on GitHub.
 */
(function () {
  var ACCESS_HASH = 'bb3b2fd61680352e6dbda404804a1f5f9e71ed2f6cefd32ff27e180fbd227e1c';
  var STORE_KEY = 'portfolio_access';
  var REQUEST_PAGE = 'request-access.html';

  function normalise(code) { return String(code || '').trim().toUpperCase(); }

  function sha256(text) {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (b) {
        return ('0' + b.toString(16)).slice(-2);
      }).join('');
    });
  }

  function granted() {
    try { return localStorage.getItem(STORE_KEY) === ACCESS_HASH; } catch (e) { return false; }
  }

  /* Resolves true and remembers the grant when the code is right. */
  function tryCode(code) {
    code = normalise(code);
    if (!code || !window.crypto || !crypto.subtle) return Promise.resolve(false);
    return sha256(code).then(function (hex) {
      if (hex !== ACCESS_HASH) return false;
      try { localStorage.setItem(STORE_KEY, ACCESS_HASH); } catch (e) {}
      return true;
    }, function () { return false; });
  }

  window.PortfolioAccess = { granted: granted, tryCode: tryCode, requestPage: REQUEST_PAGE };

  /* On protected pages (<script src="access-gate.js" data-protect>), gate before first paint. */
  var me = document.currentScript;
  if (!me || !me.hasAttribute('data-protect') || granted()) return;

  var root = document.documentElement;
  root.style.visibility = 'hidden';

  var params = new URLSearchParams(location.search);
  var code = params.get('access');
  var deny = function () {
    location.replace(REQUEST_PAGE + (code ? '?invalid=1' : ''));
  };
  if (!code) return deny();

  tryCode(code).then(function (ok) {
    if (!ok) return deny();
    params.delete('access');
    var qs = params.toString();
    history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
    root.style.visibility = '';
  });
})();
