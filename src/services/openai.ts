import OpenAI from 'openai';

let openai: OpenAI;
let conversationHistory: Array<{ role: 'system' | 'user' | 'assistant', content: string }> = [];

const SYSTEM_PROMPT = `You are a knowledgeable and friendly expert representing Eventum Orthopedics. Your role is to clearly, accurately, and professionally answer queries regarding Eventum's services, products, technologies, and innovations. Your primary audience includes surgeons, medical professionals, and healthcare administrators who depend on precise, trustworthy information to make decisions that impact patient outcomes.`;

export const initializeOpenAI = (apiKey: string) => {
  openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // Note: In production, you should use a backend server
  });
  // Initialize conversation with system prompt
  conversationHistory = [{ role: 'system', content: SYSTEM_PROMPT }];
};

export const sendMessage = async (message: string) => {
  if (!openai) {
    throw new Error('OpenAI client not initialized. Call initializeOpenAI first.');
  }

  try {
    // Add user message to history
    conversationHistory.push({ role: 'user', content: message });

    const completion = await openai.chat.completions.create({
      messages: conversationHistory,
      model: 'gpt-4-turbo-preview',
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0].message.content;
    
    // Add assistant's response to history
    if (response) {
      conversationHistory.push({ role: 'assistant', content: response });
    }

    return response;
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    throw error;
  }
};

// Optional: Add a function to clear conversation history if needed
export const clearConversation = () => {
  conversationHistory = [{ role: 'system', content: SYSTEM_PROMPT }];
}; 