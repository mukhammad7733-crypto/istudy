// OpenAI Assistants API Integration Service
// This service handles all interactions with OpenAI Assistants API

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const ASSISTANT_ID = 'asst_svIGGgaQ1nptzM8lYSep6SgU'; // Your OpenAI Assistant ID
const OPENAI_API_BASE = 'https://api.openai.com/v1';

class OpenAIAssistantService {
  constructor() {
    this.apiKey = OPENAI_API_KEY;
    this.assistantId = ASSISTANT_ID;
    this.threadId = null; // Current conversation thread
    this.conversationHistory = [];
  }

  /**
   * Create a new thread for conversation
   * @returns {Promise<string>} - Thread ID
   */
  async createThread() {
    try {
      const response = await fetch(`${OPENAI_API_BASE}/threads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to create thread');
      }

      const data = await response.json();
      this.threadId = data.id;
      console.log('Thread created:', this.threadId);
      return this.threadId;

    } catch (error) {
      console.error('Error creating thread:', error);
      throw error;
    }
  }

  /**
   * Initialize assistant for a new user
   * This creates a new thread for the conversation
   * @param {Array} userAnswers - Optional user answers from agent creation
   */
  async initializeAgent(userAnswers = []) {
    try {
      await this.createThread();

      // If we have user answers, send them as context
      if (userAnswers && userAnswers.length > 0) {
        const contextMessage = this.buildContextFromAnswers(userAnswers);
        // Send context as first message (optional, depending on your assistant setup)
        console.log('User context:', contextMessage);
      }

      return this.threadId;
    } catch (error) {
      console.error('Error initializing agent:', error);
      throw error;
    }
  }

  /**
   * Build context message from user answers
   * @param {Array} userAnswers - User answers from questions
   * @returns {string} - Formatted context
   */
  buildContextFromAnswers(userAnswers) {
    const context = userAnswers.map((ans, idx) =>
      `Вопрос ${idx + 1}: ${ans.answer}`
    ).join('\n');
    return `Контекст пользователя:\n${context}`;
  }

  /**
   * Add a message to the thread
   * @param {string} message - User's message
   * @returns {Promise<object>} - Message object
   */
  async addMessage(message) {
    if (!this.threadId) {
      await this.createThread();
    }

    try {
      const response = await fetch(`${OPENAI_API_BASE}/threads/${this.threadId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'OpenAI-Beta': 'assistants=v2'
        },
        body: JSON.stringify({
          role: 'user',
          content: message
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to add message');
      }

      const data = await response.json();
      return data;

    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  }

  /**
   * Create and poll a run
   * @returns {Promise<object>} - Run result
   */
  async createRun() {
    try {
      const response = await fetch(`${OPENAI_API_BASE}/threads/${this.threadId}/runs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'OpenAI-Beta': 'assistants=v2'
        },
        body: JSON.stringify({
          assistant_id: this.assistantId,
          model: 'gpt-4o-mini' // Using GPT-4 mini as requested
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to create run');
      }

      const run = await response.json();
      return run;

    } catch (error) {
      console.error('Error creating run:', error);
      throw error;
    }
  }

  /**
   * Poll run status until completion
   * @param {string} runId - Run ID to poll
   * @returns {Promise<object>} - Completed run
   */
  async pollRunStatus(runId) {
    const maxAttempts = 60; // 60 seconds timeout
    let attempts = 0;

    while (attempts < maxAttempts) {
      try {
        const response = await fetch(`${OPENAI_API_BASE}/threads/${this.threadId}/runs/${runId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'OpenAI-Beta': 'assistants=v2'
          }
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error?.message || 'Failed to get run status');
        }

        const run = await response.json();
        console.log('Run status:', run.status);

        if (run.status === 'completed') {
          return run;
        } else if (run.status === 'failed' || run.status === 'cancelled' || run.status === 'expired') {
          throw new Error(`Run ${run.status}: ${run.last_error?.message || 'Unknown error'}`);
        }

        // Wait 1 second before polling again
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;

      } catch (error) {
        console.error('Error polling run:', error);
        throw error;
      }
    }

    throw new Error('Run timeout: Assistant took too long to respond');
  }

  /**
   * Get the latest message from the thread
   * @returns {Promise<string>} - Assistant's response
   */
  async getLatestMessage() {
    try {
      const response = await fetch(`${OPENAI_API_BASE}/threads/${this.threadId}/messages?limit=1&order=desc`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to get messages');
      }

      const data = await response.json();
      const messages = data.data;

      if (messages.length === 0) {
        throw new Error('No messages found');
      }

      const latestMessage = messages[0];

      // Extract text from message content
      if (latestMessage.content && latestMessage.content.length > 0) {
        const textContent = latestMessage.content.find(c => c.type === 'text');
        if (textContent) {
          return textContent.text.value;
        }
      }

      throw new Error('No text content found in message');

    } catch (error) {
      console.error('Error getting latest message:', error);
      throw error;
    }
  }

  /**
   * Send a message and get response from assistant
   * @param {string} message - User's message
   * @returns {Promise<string>} - Assistant's response
   */
  async sendMessage(message) {
    try {
      // Add user message to thread
      await this.addMessage(message);

      // Create and run the assistant
      const run = await this.createRun();

      // Poll until run completes
      await this.pollRunStatus(run.id);

      // Get the assistant's response
      const response = await this.getLatestMessage();

      // Store in history
      this.conversationHistory.push({
        role: 'user',
        content: message
      });
      this.conversationHistory.push({
        role: 'assistant',
        content: response
      });

      return response;

    } catch (error) {
      console.error('OpenAI Assistant Error:', error);

      // Return user-friendly error messages in Russian
      if (error.message.includes('API key') || error.message.includes('Incorrect API key')) {
        return 'Ошибка: неверный API ключ OpenAI. Пожалуйста, проверьте конфигурацию.';
      } else if (error.message.includes('quota') || error.message.includes('insufficient_quota')) {
        return 'Ошибка: превышен лимит API. Пожалуйста, проверьте ваш аккаунт OpenAI.';
      } else if (error.message.includes('timeout')) {
        return 'Ошибка: превышено время ожидания ответа. Попробуйте еще раз.';
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        return 'Ошибка сети: проверьте подключение к интернету.';
      } else {
        return `Извините, произошла ошибка: ${error.message}`;
      }
    }
  }

  /**
   * Clear conversation (create new thread)
   */
  async clearConversation() {
    this.conversationHistory = [];
    await this.createThread();
  }

  /**
   * Get conversation history
   * @returns {Array} - Conversation history
   */
  getHistory() {
    return this.conversationHistory;
  }

  /**
   * Get current thread ID
   * @returns {string} - Thread ID
   */
  getThreadId() {
    return this.threadId;
  }
}

// Export singleton instance
export const openAIService = new OpenAIAssistantService();
export default openAIService;
