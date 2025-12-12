import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChatBotV2 } from './components/ChatBotV2';
import { createGlobalStyle } from 'styled-components';

declare global {
  interface Window {
    EviChatBot?: {
      init: () => void;
      close: () => void;
    };
  }
}

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
`;

// Prevent the embed script from running multiple times if loaded twice
if ((window as any).__EVI_CHATBOT_EMBED_LOADED__) {
  // Already loaded, exit early - but still expose API if it doesn't exist
  if (!window.EviChatBot) {
    window.EviChatBot = {
      init: () => {},
      close: () => {},
    };
  }
} else {
  (window as any).__EVI_CHATBOT_EMBED_LOADED__ = true;

// Store references for cleanup
let currentRoot: ReactDOM.Root | null = null;
let currentContainer: HTMLElement | null = null;
let isInitializing = false;

function injectChatBot() {
  // Prevent multiple instances - check both our reference and DOM
  const existingContainer = document.getElementById('evi-chat-container');
  if (existingContainer || currentContainer || isInitializing) {
    // If container exists but our reference is lost, restore it
    if (existingContainer && !currentContainer) {
      currentContainer = existingContainer;
    }
    return;
  }

  // Set flag to prevent concurrent initialization
  isInitializing = true;

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
  currentRoot = root;
  currentContainer = container;
  isInitializing = false; // Clear flag after container is created

  const handleClose = () => {
    try {
      root.unmount();
    } catch {}
    container.remove();
    currentRoot = null;
    currentContainer = null;
  };

  root.render(
    <>
      <GlobalStyles />
      <ChatBotV2 isOpen={true} onClose={handleClose} />
    </>
  );
}

function closeChatBot() {
  // Also check DOM in case reference is lost
  const container = currentContainer || document.getElementById('evi-chat-container');
  if (container) {
    if (currentRoot) {
      try {
        currentRoot.unmount();
      } catch {}
    }
    try {
      container.remove();
    } catch {}
    currentRoot = null;
    currentContainer = null;
    isInitializing = false;
  }
}

  // Expose global API for embedding
  window.EviChatBot = {
    init: injectChatBot,
    close: closeChatBot,
  };
}


