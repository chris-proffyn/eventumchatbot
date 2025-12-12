# Eventum Orthopaedics Chatbot Caller (Embedding Guide)

Use these drop-in instructions to add the Annabel chatbot to any existing website or app.

## 1) Easiest: Auto-load on page load
Add this tag to your site's HTML (e.g., `public/index.html`, root layout/template):

```html
<script src="https://eventumortho.click/evi-chatbot-loader.js?v=2025-12-12-03" async></script>
```

**Note:** Bump the version query parameter (`?v=2025-12-12-03`) whenever a new version is deployed to ensure browsers fetch the latest bundle.

- The loader fetches `https://eventumortho.click/evi-chatbot.js?v=2025-12-12-03` and calls `window.EviChatBot.init()` to render the widget in the bottom-right.
- To reopen after the user closes it, call:

```html
<script>
  window.EviChatBot && window.EviChatBot.init && window.EviChatBot.init();
</script>
```

## 2) Programmatic loader (load on demand)
Add this small util and call it when needed (e.g., on a button click):

```ts
// chatbotLoader.ts
type LoaderOptions = {
  src?: string; // override loader URL if needed
};

export function loadAnnabelChatbot(options: LoaderOptions = {}) {
  // Version is automatically included in the default URL
  const { src = 'https://eventumortho.click/evi-chatbot-loader.js?v=2025-12-12-03' } = options;

  return new Promise<void>((resolve, reject) => {
    // Already loaded?
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
```

Example usage:

```ts
// e.g., inside a click handler
await loadAnnabelChatbot();
// The loader will auto-call window.EviChatBot.init()
// To re-open later (after close):
(window as any).EviChatBot?.init?.();
```

## 3) React example (on-demand button)

```tsx
import { useState } from 'react';
import { loadAnnabelChatbot } from './chatbotLoader';

export function ChatbotButton() {
  const [loading, setLoading] = useState(false);

  const handleOpenChat = async () => {
    if ((window as any).EviChatBot?.init) {
      (window as any).EviChatBot.init();
      return;
    }
    setLoading(true);
    try {
      await loadAnnabelChatbot();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleOpenChat} disabled={loading}>
      {loading ? 'Loading chat…' : 'Chat to Annabel'}
    </button>
  );
}
```

## 4) Notes and common issues
- CORS: The chatbot posts to an n8n webhook. Ensure that endpoint allows the embedding site’s Origin. If you change domains, update CORS accordingly.
- CSP: If you use a strict Content Security Policy, allow `https://eventumortho.click` in `script-src`.
- Caching: The loader is served with no-cache so updates propagate; the library bundle is long-cached.
- Re-open after close: Call `window.EviChatBot.init()` again.

That’s it. With the script tag or the utility, any site can load and display the Annabel chatbot.
