(function () {
  if (window.__EVI_CHATBOT_LOADER__) return;
  window.__EVI_CHATBOT_LOADER__ = true;

  function loadScript(src, onload) {
    var s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = onload;
    s.onerror = function (e) { console.error('Failed to load', src, e); };
    document.body.appendChild(s);
  }

  function init() {
    if (window.EviChatBot && typeof window.EviChatBot.init === 'function') {
      try { window.EviChatBot.init(); } catch (e) { console.error('EviChatBot init error:', e); }
      return;
    }
    setTimeout(init, 50);
  }

  // Load from your S3 bucket domain
  loadScript('https://eventumortho.click/evi-chatbot.js', init);
})();


