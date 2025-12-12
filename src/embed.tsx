import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChatBotV2 } from './components/ChatBotV2';
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
  const handleClose = () => {
    try {
      root.unmount();
    } catch {}
    container.remove();
  };

  root.render(
    <React.StrictMode>
      <GlobalStyles />
      <ChatBotV2 isOpen={true} onClose={handleClose} />
    </React.StrictMode>
  );
}

// Expose a simple global API for embedding
(window as any).EviChatBot = {
  init: injectChatBot,
};


