export type LoaderOptions = {
  src?: string; // Optionally override the loader URL
};

// Bump this version string on each production release
const ANNABEL_CHATBOT_VERSION = "2025-12-12-03";

/**
 * Dynamically loads the Annabel chatbot loader script.
 * Resolves when the script has loaded. The loader will auto-call EviChatBot.init().
 * You can re-open later using: (window as any).EviChatBot?.init?.()
 */
export function loadAnnabelChatbot(options: LoaderOptions = {}): Promise<void> {
  const { src = `https://eventumortho.click/evi-chatbot-loader.js?v=${ANNABEL_CHATBOT_VERSION}` } = options;

  return new Promise<void>((resolve, reject) => {
    // Already loaded by a previous call or auto script tag
    if ((window as any).__EVI_CHATBOT_LOADER__) {
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


