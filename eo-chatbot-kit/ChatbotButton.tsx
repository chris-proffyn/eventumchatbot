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


