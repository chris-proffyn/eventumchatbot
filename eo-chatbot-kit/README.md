# Eventum Orthopaedics Chatbot Integration Kit (for Cursor projects)

Follow these steps to add the Annabel chatbot to any existing web app built with Cursor.

## Files in this kit
- `snippet.html`: Single-line script tag to auto-load the chatbot
- `chatbotLoader.ts`: TypeScript utility to programmatically load the chatbot on demand
- `chatbotLoader.js`: JavaScript (no types) version of the loader utility
- `ChatbotButton.tsx`: Example React button that loads/opens the chatbot

## Quick start (auto-load)
1) Open your app’s HTML (e.g., `public/index.html`, root layout, or template)
2) Paste the content from `snippet.html` just before the closing `</body>` tag
3) Save and run your app. The widget should appear at the bottom-right after load

## Programmatic load (recommended)
Use this when you want to open the chatbot after a user action (e.g., button click).

1) Copy ONE loader file into your project’s `src/` folder:
   - TypeScript: copy `chatbotLoader.ts`
   - Plain JS: copy `chatbotLoader.js`

2) Import and call the loader when needed:
```ts
import { loadAnnabelChatbot } from './chatbotLoader';

async function openChat() {
  // If already loaded and closed before, this will simply reopen
  if ((window as any).EviChatBot?.init) {
    (window as any).EviChatBot.init();
    return;
  }
  await loadAnnabelChatbot();
}
```

3) (Optional) Use the provided React button example:
   - Copy `ChatbotButton.tsx` into your React app and render it anywhere in your UI

## Notes
- Endpoint/CORS: The chatbot posts to an n8n webhook. If your site’s domain is new and sees CORS errors, widen allowed Origins on that endpoint.
- CSP: If your site uses a strict Content Security Policy, add `https://eventumortho.click` to `script-src`.
- Re-open after close: You can always bring the widget back by calling `window.EviChatBot.init()` again.
- No assets needed: You do not need to host chatbot bundles; they’re served from `https://eventumortho.click/`.

## Support
If you run into issues, drop the `snippet.html` tag into a blank page first to confirm loading works, then integrate programmatically in your app.
