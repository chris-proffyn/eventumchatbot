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

# Build for production
npm run build

# Build embeddable library bundle
npx vite build -c vite.lib.config.ts
```

## Deployment

The app is deployed to S3 at `eventumortho.click`:

```bash
# Build both app and library
npm run build
npx vite build -c vite.lib.config.ts

# Deploy to S3
aws s3 sync dist s3://eventumortho.click --delete
```

## Embedding the Chatbot

See `eo-chatbot-kit/README.md` for instructions on embedding the chatbot into other websites.

## Environment Variables

- `VITE_OPENAI_API_KEY`: OpenAI API key (if needed)

## License

Private - Eventum Orthopaedics
