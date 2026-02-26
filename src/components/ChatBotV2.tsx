import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../theme';
import { FaPaperPlane, FaTimes } from 'react-icons/fa';
import { FiEdit2, FiRotateCw } from 'react-icons/fi';
import { ANNABEL_COLOUR_LOGO_URL, ANNABEL_MONO_LOGO_URL } from '../config/assets';

interface Message {
  text: string;
  isUser: boolean;
}

interface ChatBotContainerProps {
  $isOpen: boolean;
}

interface MessageProps {
  $isUser: boolean;
}

const ChatBotContainer = styled.div<ChatBotContainerProps>`
  position: absolute;
  bottom: ${props => props.$isOpen ? '0' : '-100%'};
  right: 0;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  background: white;
  border-radius: 10px 10px 0 0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: bottom 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  overflow: auto;

  @media (min-width: ${theme.breakpoints.md}) {
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    right: 0;
    bottom: ${props => props.$isOpen ? '0' : '-100%'};
  }
`;

const ChatHeader = styled.div`
  background: ${theme.colors.secondary};
  color: white;
  padding: 12px 15px;
  border-radius: 10px 10px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 2;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
`;

const HeaderTitle = styled.span`
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const InputContainer = styled.div`
  padding: 15px;
  border-top: 1px solid ${theme.colors.lightGray};
  display: flex;
  gap: 10px;
  position: sticky;
  bottom: 0;
  background: white;
  z-index: 2;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid ${theme.colors.lightGray};
  border-radius: 5px;
  outline: none;
  font-size: 16px;
  
  &:focus {
    border-color: ${theme.colors.secondary};
  }
`;

const SendButton = styled.button`
  background: ${theme.colors.primary};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: opacity 0.2s;
  white-space: nowrap;
  
  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  -webkit-overflow-scrolling: touch;
`;

const Message = styled.div<MessageProps>`
  max-width: 85%;
  padding: 10px 15px;
  border-radius: 15px;
  align-self: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
  background: ${props => props.$isUser ? theme.colors.secondary : theme.colors.lightGray};
  color: ${props => props.$isUser ? 'white' : 'black'};
  word-wrap: break-word;
  hyphens: auto;
  text-align: ${props => props.$isUser ? 'right' : 'left'};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 0.8;
  }
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  color: ${theme.colors.text};
  font-style: italic;
  padding: 10px;
`;

// Tooltip styled component
const Tooltip = styled.span`
  visibility: hidden;
  background: #333;
  color: #fff;
  text-align: center;
  border-radius: 4px;
  padding: 2px 6px;
  position: absolute;
  z-index: 1;
  bottom: 120%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  white-space: nowrap;
`;

const IconButtonWrapper = styled.span`
  position: relative;
  &:hover ${Tooltip} {
    visibility: visible;
  }
`;

interface ChatBotV2Props {
  isOpen: boolean;
  onClose: () => void;
}

// Add a simple markdown-to-HTML function for [text](url) links
function renderMarkdownLinks(text: string) {
  // Replace [text](url) with <a href="url" target="_blank" rel="noopener noreferrer">text</a>
  return text.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, (_unused, linkText, url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
  });
}

export const ChatBotV2: React.FC<ChatBotV2Props> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello, I'm Annabel, the enhanced Eventum Orthopaedics chatbot. What would you like to know about Eventum, its people and products?",
      isUser: false
    }
  ]);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sessionId] = useState(() => {
    return `session-v2-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (overrideMessage?: string) => {
    const msgToSend = overrideMessage !== undefined ? overrideMessage : message;
    if (!msgToSend.trim()) return;

    const userMessage = msgToSend.trim();
    if (!overrideMessage) setMessage('');
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setIsTyping(true);

    // Cloudflare Worker reverse proxy for chatbot
    const webhookUrl = 'https://eo-chatbot-cors-proxy.proffyn-chat.workers.dev'
    console.log('=== CHATBOT V2 DEBUG START ===');
    console.log('Webhook URL:', webhookUrl);

    try {
      const requestBody = {
        chatInput: userMessage,
        sessionId: sessionId
      };
      console.log('Request body:', JSON.stringify(requestBody, null, 2));

      // Timeout after 60 seconds
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Timed out waiting for response')), 60000));

      console.log('Sending fetch request...');
      const fetchPromise = fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': window.location.origin,
          'Access-Control-Allow-Origin': '*',
        },
        mode: 'cors',
        credentials: 'omit',
        body: JSON.stringify(requestBody),
      })
        .then(async response => {
          console.log('Response received:');
          console.log('- Status:', response.status);
          console.log('- Status Text:', response.statusText);
          console.log('- Headers:', Object.fromEntries(response.headers.entries()));

          if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response text:', errorText);
            try {
              const errorData = JSON.parse(errorText);
              console.error('Error response JSON:', errorData);
            } catch (e) {
              console.error('Error response is not JSON:', e);
            }
            throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
          }

          const responseText = await response.text();
          console.log('Raw response text:', responseText);

          if (!responseText.trim()) {
            console.log('Empty response received');
            throw new Error('Empty response from server');
          }

          let data;
          try {
            data = JSON.parse(responseText);
            console.log('Parsed response data:', JSON.stringify(data, null, 2));
          } catch (e) {
            console.error('Failed to parse response as JSON:', e);
            throw new Error('Invalid JSON response from server');
          }

          return data.response || data.output || JSON.stringify(data);
        });

      let botResponse;
      try {
        console.log('Waiting for response...');
        botResponse = await Promise.race([fetchPromise, timeoutPromise]);
        console.log('Final bot response:', botResponse);
        // Format YouTube video links with timestamps
        if (typeof botResponse === 'string') {
          botResponse = botResponse.replace(/(https:\/\/youtu\.be\/[^\s\)\]]+\?t=)(\d+)([^\s\)]*)\)(, starting at )(\d{1,2}:\d{2}:\d{2}|\d{1,2}:\d{2}:\d{2}|\d{1,2}:\d{2})/g, (_unused, urlStart, _unusedTValue, urlEnd, label, timeStr) => {
            // Convert timeStr (hh:mm:ss or mm:ss) to seconds
            const timeParts = timeStr.split(':').map(Number);
            let seconds = 0;
            if (timeParts.length === 3) {
              seconds = timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2];
            } else if (timeParts.length === 2) {
              seconds = timeParts[0] * 60 + timeParts[1];
            }
            // Format new time as mm:ss
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            const newTimeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            // Format new t param (seconds)
            const newT = mins * 60 + secs;
            return `${urlStart}${newT}${urlEnd})${label}${newTimeStr}`;
          });
        }
      } catch (err) {
        const error = err as Error;
        console.error('Error during fetch:', error);
        if (error.message === 'Timed out waiting for response' || error.message === 'Empty response from server') {
          botResponse = "I'm processing your request. Please try again in a moment.";
        } else {
          throw error;
        }
      }

      setMessages(prev => [...prev, { 
        text: botResponse || 'I received your message but need a moment to process it. Please try again.', 
        isUser: false 
      }]);
    } catch (error) {
      console.error('Fatal error:', error);
      setMessages(prev => [...prev, { 
        text: 'Sorry, there was an error connecting to the server. Please try again later.', 
        isUser: false 
      }]);
    } finally {
      setIsTyping(false);
      console.log('=== CHATBOT V2 DEBUG END ===');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <ChatBotContainer $isOpen={isOpen}>
      <ChatHeader>
        <HeaderLeft>
          <img src={ANNABEL_COLOUR_LOGO_URL} alt="Annabel v2 Logo" style={{ width: 28, height: 28, marginRight: 8, borderRadius: '50%' }} />
          <HeaderTitle>Annabel</HeaderTitle>
        </HeaderLeft>
        <CloseButton onClick={onClose}>
          <FaTimes size={20} />
        </CloseButton>
      </ChatHeader>
      
      <ChatMessages>
        {messages.map((msg, index) => {
          const isLastUserMsg = msg.isUser && index === messages.length - 2 && messages[messages.length - 1] && !messages[messages.length - 1].isUser;
          return (
            <Message key={index} $isUser={msg.isUser}>
              {msg.isUser
                ? (
                  <>
                    {msg.text}
                    {isLastUserMsg && (
                      <span style={{ marginLeft: 8 }}>
                        <IconButtonWrapper>
                          <button
                            style={{
                              background: theme.colors.secondary,
                              border: 'none',
                              borderRadius: 4,
                              cursor: 'pointer',
                              color: 'white',
                              marginRight: 4,
                              padding: '2px 6px',
                              transition: 'background 0.2s',
                            }}
                            title="Edit"
                            onClick={() => {
                              setMessage(msg.text);
                            }}
                          >
                            <FiEdit2 color="white" size={10} />
                          </button>
                          <Tooltip>Edit</Tooltip>
                        </IconButtonWrapper>
                        <IconButtonWrapper>
                          <button
                            style={{
                              background: theme.colors.secondary,
                              border: 'none',
                              borderRadius: 4,
                              cursor: 'pointer',
                              color: 'white',
                              padding: '2px 6px',
                              transition: 'background 0.2s',
                            }}
                            title="Re-Run"
                            onClick={async () => {
                              setMessage('');
                              await handleSendMessage(msg.text);
                            }}
                          >
                            <FiRotateCw color="white" size={10} />
                          </button>
                          <Tooltip>Re-Run</Tooltip>
                        </IconButtonWrapper>
                      </span>
                    )}
                  </>
                )
                : <span dangerouslySetInnerHTML={{ __html: renderMarkdownLinks(msg.text) }} />}
            </Message>
          );
        })}
        {isTyping && (
          <TypingIndicator>
            <img src={ANNABEL_MONO_LOGO_URL} alt="Annabel v2 Mono Logo" style={{ width: 16, height: 16, marginRight: 6, verticalAlign: 'middle' }} />
            Annabel v2 is typing...
          </TypingIndicator>
        )}
        <div ref={messagesEndRef} />
      </ChatMessages>

      <InputContainer>
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={isTyping}
        />
        <SendButton onClick={() => handleSendMessage()} disabled={isTyping || !message.trim()}>
          <FaPaperPlane />
        </SendButton>
      </InputContainer>
    </ChatBotContainer>
  );
}; 