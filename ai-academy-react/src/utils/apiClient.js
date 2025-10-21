// API Client для работы с backend
// Использование: import { apiClient } from '../utils/apiClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

class APIClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'API request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // AI Agent Questions
  async getAIQuestions() {
    return this.request('/ai-agent-questions/');
  }

  async createAIQuestion(questionData) {
    return this.request('/ai-agent-questions/', {
      method: 'POST',
      body: JSON.stringify(questionData),
    });
  }

  async updateAIQuestion(questionId, questionData) {
    return this.request(`/ai-agent-questions/${questionId}/`, {
      method: 'PUT',
      body: JSON.stringify(questionData),
    });
  }

  async deleteAIQuestion(questionId) {
    return this.request(`/ai-agent-questions/${questionId}/`, {
      method: 'DELETE',
    });
  }

  // AI Agent Question Options
  async createAIQuestionOption(optionData) {
    return this.request('/ai-agent-question-options/', {
      method: 'POST',
      body: JSON.stringify(optionData),
    });
  }

  async updateAIQuestionOption(optionId, optionData) {
    return this.request(`/ai-agent-question-options/${optionId}/`, {
      method: 'PUT',
      body: JSON.stringify(optionData),
    });
  }

  async deleteAIQuestionOption(optionId) {
    return this.request(`/ai-agent-question-options/${optionId}/`, {
      method: 'DELETE',
    });
  }

  // Modules
  async getModules() {
    return this.request('/modules/');
  }

  async createModule(moduleData) {
    return this.request('/modules/', {
      method: 'POST',
      body: JSON.stringify(moduleData),
    });
  }

  // Users
  async getUsers() {
    return this.request('/users/');
  }

  async createUser(userData) {
    return this.request('/users/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Test Results
  async createTestResult(resultData) {
    return this.request('/test-results/', {
      method: 'POST',
      body: JSON.stringify(resultData),
    });
  }
}

export const apiClient = new APIClient(API_BASE_URL);
export default apiClient;
