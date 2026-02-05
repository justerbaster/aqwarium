/**
 * Frontend config. For production, set backend URL via:
 * - <meta name="aqwarium-api-url" content="https://your-backend.railway.app">
 * or window.AQWARIUM_API_URL before loading game scripts.
 */
(function () {
  var meta = document.querySelector('meta[name="aqwarium-api-url"]');
  window.AQWARIUM_API_URL = (meta && meta.getAttribute('content')) || window.AQWARIUM_API_URL || '';
})();
