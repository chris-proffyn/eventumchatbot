export function loadAnnabelChatbot(options = {}) {
  const { src = 'https://eventumortho.click/evi-chatbot-loader.js' } = options;

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


