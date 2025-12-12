# 🧠 Method B: Floating Chatbot Script Embed (Hosted on AWS S3)

This guide will help you build and deploy a **floating chatbot widget** (not using an iframe) that can be embedded into **any WordPress site** using a single `<script>` tag.

The chatbot will be hosted on **AWS S3**, alongside your existing `index.html` React app.

---

## 📦 Project Overview

- **Framework**: React (Vite)
- **Chatbot Component**: `ChatBotV2` (`src/components/ChatBotV2.tsx`)
- **Backend**: n8n workflow (with CORS enabled)
- **Hosting**: AWS S3 static website (`https://proffyn.click`)
- **Widget Script**: Will be named `evi-chatbot.js`

---

## ✅ Goals

- ✅ Add a **floating chatbot button and widget** to WordPress via script embed.
- ✅ Host the chatbot script on AWS S3 at `https://proffyn.click/evi-chatbot.js`.
- ✅ Avoid iframe; inject chatbot directly into the page.
- ✅ Ensure styled-components and React render correctly.
- ✅ Enable requests to n8n with correct CORS settings.

---

## 🔧 Step-by-Step Instructions

---

### 1. Create `embed.tsx` (New Entry Point)

Create a new file:

```

src/embed.tsx

````

Paste this code:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import ChatBotV2 from './components/ChatBotV2';
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
`;

function injectChatBot() {
  if (document.getElementById('evi-chat-container')) return;

  const container = document.createElement('div');
  container.id = 'evi-chat-container';
  container.style.position = 'fixed';
  container.style.bottom = '20px';
  container.style.right = '20px';
  container.style.width = '400px';
  container.style.height = '600px';
  container.style.zIndex = '9999';
  container.style.borderRadius = '8px';
  container.style.overflow = 'hidden';
  container.style.boxShadow = '0 8px 20px rgba(0,0,0,0.3)';
  container.style.backgroundColor = 'white';

  document.body.appendChild(container);

  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <GlobalStyles />
      <ChatBotV2 />
    </React.StrictMode>
  );
}

(window as any).EviChatBot = {
  init: injectChatBot,
};
````

---

### 2. Update Vite Config to Build an IIFE Script

In `vite.config.ts`, replace contents with:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: './src/embed.tsx',
      name: 'EviChatBot',
      formats: ['iife'],
      fileName: () => 'evi-chatbot.js',
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});
```

This configuration creates a self-contained script bundle compatible with WordPress `<script>` tags.

---

### 3. Build the Widget Script

In your terminal:

```bash
npm run build
```

After build completes, confirm that this file exists:

```
dist/evi-chatbot.js
```

---

### 4. Upload `evi-chatbot.js` to AWS S3

Use your existing S3 bucket (`proffyn.click`) where `index.html` is already deployed.

#### Option A: AWS S3 Console

1. Open the AWS Console: [https://s3.console.aws.amazon.com/s3/](https://s3.console.aws.amazon.com/s3/)
2. Navigate to your bucket: `proffyn.click`
3. Click “Upload” and select `dist/evi-chatbot.js`
4. During upload, click **“Set metadata”** and set:

   * Key: `Content-Type`
   * Value: `application/javascript`
5. Upload the file.
6. After upload, click the file → Go to **Permissions**
7. If needed, click **“Make public”**

#### Optional: Using AWS CLI

```bash
aws s3 cp ./dist/evi-chatbot.js s3://proffyn.click/evi-chatbot.js \
  --acl public-read \
  --content-type application/javascript
```

---

### 5. Confirm Public Access

In your browser, visit:

```
https://proffyn.click/evi-chatbot.js
```

✅ If the file loads as raw JavaScript text, it's public.

❌ If you get "Access Denied", ensure:

* The bucket allows public access
* The object has ACL set to public-read
* The object has `Content-Type: application/javascript`

---

### 6. Embed the Script in WordPress

Paste the following code into WordPress:

#### Use one of:

* “Insert Headers and Footers” plugin
* “Code Snippets” plugin
* Theme's `footer.php` file (before `</body>`)

#### Script to Embed:

```html
<script>
  (function () {
    var script = document.createElement('script');
    script.src = "https://proffyn.click/evi-chatbot.js";
    script.onload = function () {
      if (window.EviChatBot && typeof window.EviChatBot.init === 'function') {
        window.EviChatBot.init();
      }
    };
    document.body.appendChild(script);
  })();
</script>
```

✅ This will inject the chatbot widget into the page when it loads.

---

### 7. Ensure CORS Is Enabled in n8n

Your chatbot sends POST requests to:

```
https://proffyn.app.n8n.cloud/webhook/488e479e-1729-428b-9c13-cc155889682c/chat
```

In your n8n workflow:

1. Add a **Set HTTP Header** node (or edit HTTP Response node).
2. Set the following headers:

| Header                       | Value                   |
| ---------------------------- | ----------------------- |
| Access-Control-Allow-Origin  | `https://proffyn.click` |
| Access-Control-Allow-Methods | `POST, OPTIONS`         |
| Access-Control-Allow-Headers | `Content-Type`          |

To test CORS:

```bash
curl -X OPTIONS https://proffyn.app.n8n.cloud/webhook/488e479e-1729-428b-9c13-cc155889682c/chat \
  -H "Origin: https://proffyn.click" \
  -H "Access-Control-Request-Method: POST" \
  -i
```

Look for the correct CORS headers in the response.

---

## ✅ Final Checklist

| Task                                       | Complete |
| ------------------------------------------ | -------- |
| `embed.tsx` file created                   | ✅        |
| Vite config updated for IIFE output        | ✅        |
| `evi-chatbot.js` built via `npm run build` | ✅        |
| Script uploaded to S3 with public access   | ✅        |
| Public URL confirmed: `/evi-chatbot.js`    | ✅        |
| Script embedded in WordPress               | ✅        |
| CORS headers added to n8n workflow         | ✅        |

---

## 🧠 Optional Next Steps

Let us know if you want to:

* Add a **floating button** that toggles the chatbot open/closed
* Show chatbot only after a **delay or scroll**
* Customize the **position, theme, or size**
* Embed the chatbot via a **WordPress shortcode** or plugin

```

---

Let me know if you want this saved as a downloadable `.md` file or if you'd like a separate developer handoff doc (PDF or GitHub-ready).
```
