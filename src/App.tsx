import { useState, useEffect } from 'react'
import LandingPage from './components/LandingPage'
import { ChatBot } from './components/ChatBot'
import { ChatBotV2 } from './components/ChatBotV2'
import { createGlobalStyle } from 'styled-components'
import { theme } from './theme'
import { initializeOpenAI } from './services/openai'
import './App.css'

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: ${theme.fonts.body};
    line-height: 1.5;
    color: ${theme.colors.text};
  }
`

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isChatV2Open, setIsChatV2Open] = useState(false)

  useEffect(() => {
    // Initialize OpenAI with your API key
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OpenAI API key not found. Please add it to your .env file as VITE_OPENAI_API_KEY');
    } else {
      initializeOpenAI(apiKey);
    }
  }, []);

  const handleChatClick = (version: 'v1' | 'v2') => {
    if (version === 'v1') {
      setIsChatOpen(true);
      setIsChatV2Open(false);
    } else {
      setIsChatV2Open(true);
      setIsChatOpen(false);
    }
  };

  return (
    <>
      <GlobalStyle />
      <LandingPage 
        onChatV2Click={() => handleChatClick('v2')}
      />
      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <ChatBotV2 isOpen={isChatV2Open} onClose={() => setIsChatV2Open(false)} />
    </>
  )
}

export default App
