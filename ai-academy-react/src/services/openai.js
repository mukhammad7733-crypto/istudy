// OpenAI Chat Completions API Integration Service
// This service handles all interactions with OpenAI using GPT-4o Mini

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

class OpenAIService {
  constructor() {
    this.apiKey = OPENAI_API_KEY;
    this.model = 'gpt-4o-mini'; // Fast and cost-effective model
    this.conversationHistory = [];
    this.systemPrompt = '';
  }

  /**
   * Initialize agent with user preferences from questions
   * @param {Array} userAnswers - Answers from the AI agent creation questions
   */
  initializeAgent(userAnswers = []) {
    try {
      // Extract key information from user answers
      const area = userAnswers[0]?.answer || 'general assistance';
      const preferences = userAnswers.map(a => a.answer).join(', ');

      // Create personalized system prompt
      this.systemPrompt = `You are a helpful AI assistant specialized in ${area}.
Your primary goal is to help users with tasks and questions related to ${area}.
User preferences: ${preferences}

Always respond in Russian language since the user interface is in Russian.
Be friendly, professional, and provide accurate, helpful responses.
Keep your responses concise and clear.`;

      // Initialize conversation history with system prompt
      this.conversationHistory = [
        {
          role: 'system',
          content: this.systemPrompt
        }
      ];

      console.log('Agent initialized with preferences:', area);
      return true;

    } catch (error) {
      console.error('Error initializing agent:', error);
      // Fallback to default system prompt
      this.systemPrompt = 'You are a helpful AI assistant. Always respond in Russian language. Be friendly and professional.';
      this.conversationHistory = [
        {
          role: 'system',
          content: this.systemPrompt
        }
      ];
      return false;
    }
  }

  /**
   * Send a message to OpenAI and get response
   * @param {string} message - User's message
   * @returns {Promise<string>} - AI's response
   */
  async sendMessage(message) {
    try {
      // Ensure system prompt is set
      if (this.conversationHistory.length === 0) {
        this.conversationHistory.push({
          role: 'system',
          content: this.systemPrompt || 'You are a helpful AI assistant. Always respond in Russian language.'
        });
      }

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
          max_tokens: 800,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0
        })
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('OpenAI API Error:', error);
        throw new Error(error.error?.message || 'API request failed');
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
      console.error('OpenAI Service Error:', error);

      // Return user-friendly error messages in Russian
      if (error.message.includes('API key') || error.message.includes('Incorrect API key')) {
        return 'Ошибка: неверный API ключ OpenAI. Пожалуйста, проверьте конфигурацию.';
      } else if (error.message.includes('quota') || error.message.includes('insufficient_quota')) {
        return 'Ошибка: превышен лимит API. Пожалуйста, проверьте ваш аккаунт OpenAI.';
      } else if (error.message.includes('timeout')) {
        return 'Ошибка: превышено время ожидания ответа. Попробуйте еще раз.';
      } else if (error.message.includes('Failed to fetch') || error.message.includes('network')) {
        return 'Ошибка сети: проверьте подключение к интернету.';
      } else if (error.message.includes('model') || error.message.includes('gpt-4o-mini')) {
        return 'Ошибка: модель GPT-4o Mini недоступна. Проверьте доступ к модели в вашем аккаунте OpenAI.';
      } else {
        return `Извините, произошла ошибка: ${error.message}. Пожалуйста, попробуйте снова.`;
      }
    }
  }

  /**
   * Clear conversation history and reset
   */
  clearConversation() {
    this.conversationHistory = [];
    if (this.systemPrompt) {
      this.conversationHistory.push({
        role: 'system',
        content: this.systemPrompt
      });
    }
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
   * @param {string} modelName - Model name (e.g., 'gpt-4', 'gpt-4o-mini', 'gpt-3.5-turbo')
   */
  setModel(modelName) {
    this.model = modelName;
  }

  /**
   * Get current model
   * @returns {string} - Model name
   */
  getModel() {
    return this.model;
  }
}

// Export singleton instance
export const openAIService = new OpenAIService();
export default openAIService;
