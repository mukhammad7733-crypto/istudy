// OpenAI API Integration Service
// This service handles all interactions with OpenAI API

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

class OpenAIService {
  constructor() {
    this.apiKey = OPENAI_API_KEY;
    this.model = 'gpt-3.5-turbo'; // Default model
    this.conversationHistory = [];
  }

  /**
   * Initialize conversation with system prompt based on user's agent configuration
   * @param {Array} userAnswers - Answers from the AI agent creation questions
   */
  initializeAgent(userAnswers) {
    // Extract key information from user answers
    const area = userAnswers[0]?.answer || 'general assistance';
    const model = userAnswers[3]?.answer || 'GPT-3.5';
    const personalization = userAnswers[6]?.answer || 'standard';

    // Create personalized system prompt
    const systemPrompt = `You are a helpful AI assistant specialized in ${area}.
Your primary goal is to help users with tasks related to ${area}.
You are configured with ${model} capabilities and ${personalization} personalization level.
Be friendly, professional, and provide accurate, helpful responses.
Always respond in Russian language since the user interface is in Russian.`;

    // Initialize conversation history with system prompt
    this.conversationHistory = [
      {
        role: 'system',
        content: systemPrompt
      }
    ];
  }

  /**
   * Send a message to OpenAI and get response
   * @param {string} message - User's message
   * @returns {Promise<string>} - AI's response
   */
  async sendMessage(message) {
    try {
      // Add user message to history
      this.conversationHistory.push({
        role: 'user',
        content: message
      });

      // Make API request
      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: this.conversationHistory,
          temperature: 0.7,
          max_tokens: 500,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'OpenAI API request failed');
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || 'Извините, я не смог обработать ваш запрос.';

      // Add AI response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: aiResponse
      });

      return aiResponse;

    } catch (error) {
      console.error('OpenAI API Error:', error);

      // Return user-friendly error message
      if (error.message.includes('API key')) {
        return 'Ошибка: неверный API ключ OpenAI. Пожалуйста, проверьте конфигурацию.';
      } else if (error.message.includes('quota')) {
        return 'Ошибка: превышен лимит API. Пожалуйста, проверьте ваш аккаунт OpenAI.';
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        return 'Ошибка сети: проверьте подключение к интернету.';
      } else {
        return `Извините, произошла ошибка при обработке вашего запроса: ${error.message}`;
      }
    }
  }

  /**
   * Clear conversation history
   */
  clearHistory() {
    this.conversationHistory = [];
  }

  /**
   * Get conversation history
   * @returns {Array} - Conversation history
   */
  getHistory() {
    return this.conversationHistory;
  }

  /**
   * Set a different model
   * @param {string} modelName - Model name (e.g., 'gpt-4', 'gpt-3.5-turbo')
   */
  setModel(modelName) {
    this.model = modelName;
  }
}

// Export singleton instance
export const openAIService = new OpenAIService();
export default openAIService;
