(function () {
  if (window.__EVI_CHATBOT_LOADER__) return;
  window.__EVI_CHATBOT_LOADER__ = true;

  // Bump this version string on each production release
  const ANNABEL_CHATBOT_VERSION = "2025-12-12-03";

  function loadScript(src, onload) {
    var s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = onload;
    s.onerror = function (e) { console.error('Failed to load', src, e); };
    document.body.appendChild(s);
  }

  let initAttempts = 0;
  const MAX_INIT_ATTEMPTS = 20; // 20 * 50ms = 1 second max wait

  function init() {
    // Check if chatbot is already initialized and visible
    if (document.getElementById('evi-chat-container')) {
      return; // Already initialized, don't call again
    }

    if (window.EviChatBot && typeof window.EviChatBot.init === 'function') {
      try { 
        window.EviChatBot.init(); 
      } catch (e) { 
        console.error('EviChatBot init error:', e); 
      }
      return;
    }
    
    initAttempts++;
    if (initAttempts < MAX_INIT_ATTEMPTS) {
      setTimeout(init, 50);
    }
  }

  // Load from your S3 bucket domain with version for cache-busting
  loadScript(`https://eventumortho.click/evi-chatbot.js?v=${ANNABEL_CHATBOT_VERSION}`, init);
})();


