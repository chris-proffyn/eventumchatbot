# Eventum Orthopaedics Chatbot

A React-based chatbot application for Eventum Orthopaedics, featuring the Annabel AI assistant. The chatbot can be used as a standalone web app or embedded into other websites.

## Features

- **Annabel Chatbot**: AI-powered chatbot for orthopaedic questions
- **Embeddable Widget**: Can be embedded into any website via a simple script tag
- **React + TypeScript**: Built with modern React and TypeScript
- **Styled Components**: UI styling with styled-components
- **Cloudflare Worker Proxy**: Uses Cloudflare Worker for CORS handling

## Project Structure

- `src/components/`: React components (ChatBot, ChatBotV2, LandingPage)
- `src/embed.tsx`: Entry point for embeddable library bundle
- `src/chatbotLoader.ts`: Utility for programmatic loading
- `eo-chatbot-kit/`: Integration kit for embedding into other projects
- `vite.config.ts`: Main app build configuration
- `vite.lib.config.ts`: Library build configuration for embeddable bundle

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production (SPA)
npm run build:app

# Build embeddable library bundle
npm run build:lib

# Build both app and library
npm run build:all
```

## Building the Library Bundle

To build the embeddable chatbot library:

```bash
npm run build:lib
```

This creates `dist/evi-chatbot.js` - a self-contained IIFE bundle that can be loaded via `<script>` tag. The bundle:
- Is minified and optimized for production
- Contains no runtime dependencies on `process.env`
- Includes React and all dependencies (self-contained)
- Exposes `window.EviChatBot` global API

## Global API Reference

The library exposes `window.EviChatBot` with the following methods:

### `EviChatBot.init()`
Opens and renders the chatbot widget. Safe to call multiple times (will not create duplicate widgets).

### `EviChatBot.close()`
Closes and removes the chatbot widget. Cleans up React root and DOM elements.

### Example Usage

```html
<script src="https://eventumortho.click/evi-chatbot.js?v=2025-12-12-03"></script>
<script>
  // Open chatbot
  window.EviChatBot.init();
  
  // Later, close it
  window.EviChatBot.close();
</script>
```

**Note:** Bump the version query parameter (`?v=2025-12-12-03`) whenever you deploy a new version to ensure browsers fetch the latest bundle.

## Deployment

The app is deployed to S3 at `eventumortho.click`:

```bash
# Build both app and library
npm run build:all

# Deploy to S3
aws s3 sync dist s3://eventumortho.click --delete
```

## Embedding the Chatbot

See `eo-chatbot-kit/README.md` for detailed instructions on embedding the chatbot into other websites.

For quick testing, use `embed-test.html` in the project root to test the library bundle locally.

## Environment Variables

- `VITE_OPENAI_API_KEY`: OpenAI API key (if needed)

## License

Private - Eventum Orthopaedics
