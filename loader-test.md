# Evie Chatbot Loader - Standalone Test Page

Use this guide in a brand new project to test the remote loader and chatbot independently of any existing site.

## 1) Create a new empty folder

```bash
mkdir evie-loader-test && cd evie-loader-test
```

## 2) Add a minimal index.html

Create `index.html` with the content below. It loads the remote loader at `https://eventumortho.click/evi-chatbot-loader.js?v=2025-12-12-03`, which in turn loads `https://eventumortho.click/evi-chatbot.js?v=2025-12-12-03` and calls `window.EviChatBot.init()`.

**Note:** Bump the version query parameter (`?v=2025-12-12-03`) whenever a new version is deployed.

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Evie Chatbot Loader - Standalone Test</title>
    <style>
      body { font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; margin: 0; }
      header { padding: 16px; background: #f7f7f9; border-bottom: 1px solid #eee; }
      main { max-width: 880px; margin: 32px auto; padding: 0 16px; }
      code { background: #f4f4f4; padding: 2px 6px; border-radius: 4px; }
    </style>
  </head>
  <body>
    <header>
      <strong>Evie Chatbot Loader - Standalone Test</strong>
    </header>
    <main>
      <p>This page loads the chatbot via a remote loader script hosted at <code>eventumortho.click</code>.</p>
      <p>If everything is working, a floating chat widget should appear in the bottom-right corner after load.</p>
    </main>

    <!-- Remote loader (kept separate from existing sites) -->
    <!-- Bump the version parameter (?v=...) on each release -->
    <script src="https://eventumortho.click/evi-chatbot-loader.js?v=2025-12-12-03" async></script>
  </body>
  </html>
```

## 3) Run a local static server

Pick one of the following:

- Node serve
```bash
npx serve -l 5173 .
```
- Python 3
```bash
python3 -m http.server 5173
```

Open `http://localhost:5173` in your browser. You should see the page, and the chatbot should appear shortly.

## 4) Quick validation steps

- Open DevTools → Network tab → confirm `evi-chatbot-loader.js` and `evi-chatbot.js` load from `https://eventumortho.click/`.
- Open DevTools → Console and check for errors. You may run:
```js
window.EviChatBot && typeof window.EviChatBot.init === 'function'
```
Should return `true`. If not, the loader may not have finished loading yet.

## 5) Optional: Delay load or conditionally init

If you want to delay the widget (e.g., after a user click), remove the `<script>` tag above and add this in the body:

```html
<button id="show-chat">Show Chat</button>
<script>
  document.getElementById('show-chat').addEventListener('click', function () {
    var s = document.createElement('script');
    s.src = 'https://eventumortho.click/evi-chatbot-loader.js?v=2025-12-12-03';
    s.async = true;
    document.body.appendChild(s);
  });
</script>
```

## 6) Common issues

- CSP blocking remote scripts: if your host enforces a strict Content Security Policy, allow `https://eventumortho.click` for `script-src`, or host a local copy of `evi-chatbot-loader.js`.
- Ad/script blockers: try an incognito window or different browser/profile.
- CORS: your chatbot backend runs on n8n; ensure its CORS allows the embedding site’s Origin. If you change domains, update CORS on the n8n endpoint accordingly.

## 7) Deploying the test page

Any static host works (Netlify, Vercel, S3). Deploy the folder with only `index.html`.

That’s it. This page is intentionally minimal so you can quickly verify remote loading and chatbot behavior in isolation.

