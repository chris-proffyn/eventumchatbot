// Bump this version string on each production release
const ANNABEL_CHATBOT_VERSION = "2025-12-12-03";

export function loadAnnabelChatbot(options = {}) {
  const { src = `https://eventumortho.click/evi-chatbot-loader.js?v=${ANNABEL_CHATBOT_VERSION}` } = options;

  return new Promise((resolve, reject) => {
    if (window.__EVI_CHATBOT_LOADER__) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = (e) => reject(e);
    document.body.appendChild(script);
  });
}


