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

// Store references for cleanup
let currentRoot: ReactDOM.Root | null = null;
let currentContainer: HTMLElement | null = null;

function injectChatBot() {
  // Prevent multiple instances
  if (currentContainer && document.getElementById('evi-chat-container')) {
    return;
  }

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

  const handleClose = () => {
    try {
      root.unmount();
    } catch {}
    container.remove();
    currentRoot = null;
    currentContainer = null;
  };

  root.render(
    <React.StrictMode>
      <GlobalStyles />
      <ChatBotV2 isOpen={true} onClose={handleClose} />
    </React.StrictMode>
  );
}

function closeChatBot() {
  if (currentContainer) {
    const container = currentContainer;
    if (currentRoot) {
      try {
        currentRoot.unmount();
      } catch {}
    }
    container.remove();
    currentRoot = null;
    currentContainer = null;
  }
}

// Expose global API for embedding
window.EviChatBot = {
  init: injectChatBot,
  close: closeChatBot,
};


