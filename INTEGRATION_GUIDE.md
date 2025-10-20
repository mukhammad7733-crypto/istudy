# Руководство по интеграции iStudy Frontend & Backend

## Архитектура проекта

```
ai-study/
├── ai-academy-react/      # React Frontend (Vite)
└── ai-academy-backend/    # Django Backend (REST API)
```

## Запуск проекта

### 1. Запуск Backend (Django)

```bash
cd ai-academy-backend

# Создать виртуальное окружение (первый раз)
python -m venv venv

# Активировать виртуальное окружение
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Установить зависимости (первый раз)
pip install -r requirements.txt

# Применить миграции (первый раз)
python manage.py migrate

# Создать суперпользователя (первый раз)
python manage.py createsuperuser

# Запустить сервер
python manage.py runserver
```

Backend будет доступен на: **http://localhost:8000**

### 2. Запуск Frontend (React)

```bash
cd ai-academy-react

# Установить зависимости (первый раз)
npm install

# Запустить dev-сервер
npm run dev
```

Frontend будет доступен на: **http://localhost:5173**

## Настройка Frontend для работы с API

### Шаг 1: Создайте файл конфигурации API

Создайте файл `ai-academy-react/src/config/api.js`:

```javascript
// API Configuration
export const API_BASE_URL = 'http://localhost:8000/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login/`,
    LOGOUT: `${API_BASE_URL}/auth/logout/`,
    REGISTER: `${API_BASE_URL}/auth/register/`,
  },

  // Users
  USERS: {
    LIST: `${API_BASE_URL}/users/`,
    DETAIL: (id) => `${API_BASE_URL}/users/${id}/`,
    DETAIL_WITH_PROGRESS: (id) => `${API_BASE_URL}/users/${id}/detail_with_progress/`,
    SEARCH: `${API_BASE_URL}/users/search/`,
  },

  // Modules
  MODULES: {
    LIST: `${API_BASE_URL}/modules/`,
    DETAIL: (id) => `${API_BASE_URL}/modules/${id}/`,
    ALL_WITH_INACTIVE: `${API_BASE_URL}/modules/all_with_inactive/`,
  },

  // Lessons
  LESSONS: {
    LIST: `${API_BASE_URL}/lessons/`,
    DETAIL: (id) => `${API_BASE_URL}/lessons/${id}/`,
    BY_MODULE: `${API_BASE_URL}/lessons/by_module/`,
  },

  // Questions (Tests)
  QUESTIONS: {
    LIST: `${API_BASE_URL}/questions/`,
    DETAIL: (id) => `${API_BASE_URL}/questions/${id}/`,
    BY_MODULE: `${API_BASE_URL}/questions/by_module/`,
  },

  // Progress
  PROGRESS: {
    LIST: `${API_BASE_URL}/progress/`,
    DETAIL: (id) => `${API_BASE_URL}/progress/${id}/`,
    BY_USER: `${API_BASE_URL}/progress/by_user/`,
    UPDATE_OR_CREATE: `${API_BASE_URL}/progress/update_or_create/`,
  },

  // Test Results
  TEST_RESULTS: {
    LIST: `${API_BASE_URL}/test-results/`,
    DETAIL: (id) => `${API_BASE_URL}/test-results/${id}/`,
    BY_USER: `${API_BASE_URL}/test-results/by_user/`,
  },

  // AI Agents
  AI_AGENTS: {
    LIST: `${API_BASE_URL}/ai-agents/`,
    DETAIL: (id) => `${API_BASE_URL}/ai-agents/${id}/`,
    BY_USER: `${API_BASE_URL}/ai-agents/by_user/`,
  },

  // AI Agent Questions
  AI_AGENT_QUESTIONS: {
    LIST: `${API_BASE_URL}/ai-agent-questions/`,
    DETAIL: (id) => `${API_BASE_URL}/ai-agent-questions/${id}/`,
  },
};
```

### Шаг 2: Создайте API сервис

Создайте файл `ai-academy-react/src/services/apiService.js`:

```javascript
import { API_ENDPOINTS } from '../config/api';

class ApiService {
  async request(url, options = {}) {
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
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

  // Users
  async getUsers() {
    return this.request(API_ENDPOINTS.USERS.LIST);
  }

  async getUserDetail(userId) {
    return this.request(API_ENDPOINTS.USERS.DETAIL_WITH_PROGRESS(userId));
  }

  async createUser(userData) {
    return this.request(API_ENDPOINTS.USERS.LIST, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(userId, userData) {
    return this.request(API_ENDPOINTS.USERS.DETAIL(userId), {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(userId) {
    return this.request(API_ENDPOINTS.USERS.DETAIL(userId), {
      method: 'DELETE',
    });
  }

  async searchUsers(query) {
    return this.request(`${API_ENDPOINTS.USERS.SEARCH}?q=${query}`);
  }

  // Modules
  async getModules() {
    return this.request(API_ENDPOINTS.MODULES.LIST);
  }

  async getModuleDetail(moduleId) {
    return this.request(API_ENDPOINTS.MODULES.DETAIL(moduleId));
  }

  async createModule(moduleData) {
    return this.request(API_ENDPOINTS.MODULES.LIST, {
      method: 'POST',
      body: JSON.stringify(moduleData),
    });
  }

  async updateModule(moduleId, moduleData) {
    return this.request(API_ENDPOINTS.MODULES.DETAIL(moduleId), {
      method: 'PUT',
      body: JSON.stringify(moduleData),
    });
  }

  async deleteModule(moduleId) {
    return this.request(API_ENDPOINTS.MODULES.DETAIL(moduleId), {
      method: 'DELETE',
    });
  }

  // Questions (Module Tests)
  async getModuleQuestions(moduleId) {
    return this.request(`${API_ENDPOINTS.QUESTIONS.BY_MODULE}?module_id=${moduleId}`);
  }

  async createQuestion(questionData) {
    return this.request(API_ENDPOINTS.QUESTIONS.LIST, {
      method: 'POST',
      body: JSON.stringify(questionData),
    });
  }

  async updateQuestion(questionId, questionData) {
    return this.request(API_ENDPOINTS.QUESTIONS.DETAIL(questionId), {
      method: 'PUT',
      body: JSON.stringify(questionData),
    });
  }

  async deleteQuestion(questionId) {
    return this.request(API_ENDPOINTS.QUESTIONS.DETAIL(questionId), {
      method: 'DELETE',
    });
  }

  // Progress
  async getUserProgress(userId) {
    return this.request(`${API_ENDPOINTS.PROGRESS.BY_USER}?user_id=${userId}`);
  }

  async updateOrCreateProgress(progressData) {
    return this.request(API_ENDPOINTS.PROGRESS.UPDATE_OR_CREATE, {
      method: 'POST',
      body: JSON.stringify(progressData),
    });
  }

  // Test Results
  async getUserTestResults(userId) {
    return this.request(`${API_ENDPOINTS.TEST_RESULTS.BY_USER}?user_id=${userId}`);
  }

  async createTestResult(resultData) {
    return this.request(API_ENDPOINTS.TEST_RESULTS.LIST, {
      method: 'POST',
      body: JSON.stringify(resultData),
    });
  }

  // AI Agents
  async getUserAIAgent(userId) {
    return this.request(`${API_ENDPOINTS.AI_AGENTS.BY_USER}?user_id=${userId}`);
  }

  async createAIAgent(agentData) {
    return this.request(API_ENDPOINTS.AI_AGENTS.LIST, {
      method: 'POST',
      body: JSON.stringify(agentData),
    });
  }

  async getAIAgentQuestions() {
    return this.request(API_ENDPOINTS.AI_AGENT_QUESTIONS.LIST);
  }
}

export default new ApiService();
```

### Шаг 3: Обновите компоненты

Пример использования в `AdminUsers.jsx`:

```javascript
import { useEffect, useState } from 'react';
import apiService from '../../services/apiService';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await apiService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Удалить пользователя?')) {
      try {
        await apiService.deleteUser(userId);
        setUsers(users.filter(u => u.id !== userId));
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  // ... rest of component
}
```

## Миграция данных из localStorage в БД

### Скрипт для экспорта данных из React

Создайте файл `ai-academy-react/src/utils/exportToBackend.js`:

```javascript
import apiService from '../services/apiService';

export async function migrateDataToBackend() {
  // 1. Получить модули из localStorage
  const modulesData = localStorage.getItem('adminModuleList');
  const modules = modulesData ? JSON.parse(modulesData) : [];

  // 2. Создать модули в БД
  for (const module of modules) {
    try {
      const createdModule = await apiService.createModule({
        title: module.title,
        description: module.description || '',
        icon: module.icon,
        duration: module.duration || 60,
        order: modules.indexOf(module),
      });

      // 3. Создать уроки для модуля
      for (const lessonName of module.lessons) {
        const lessonContent = localStorage.getItem('adminLessonContent');
        const content = lessonContent ? JSON.parse(lessonContent)[lessonName] : null;

        await apiService.createLesson({
          module: createdModule.id,
          title: content?.title || lessonName,
          content: content?.content || '',
          order: module.lessons.indexOf(lessonName),
        });
      }

      // 4. Создать тесты модуля
      const moduleTests = localStorage.getItem('adminModuleTests');
      const tests = moduleTests ? JSON.parse(moduleTests)[module.id] : [];

      for (const test of tests) {
        const question = await apiService.createQuestion({
          module: createdModule.id,
          lesson: null, // Итоговый тест модуля
          question_text: test.question,
          question_type: 'single',
          order: tests.indexOf(test),
        });

        // Создать варианты ответов
        for (let i = 0; i < test.options.length; i++) {
          await apiService.createAnswer({
            question: question.id,
            answer_text: test.options[i],
            is_correct: i === test.correctAnswer,
            order: i,
          });
        }
      }
    } catch (error) {
      console.error(`Failed to migrate module ${module.title}:`, error);
    }
  }

  // 5. Получить пользователей из localStorage
  const usersData = localStorage.getItem('adminUsers');
  const users = usersData ? JSON.parse(usersData) : [];

  for (const user of users) {
    try {
      const createdUser = await apiService.createUser({
        username: user.name,
        email: user.email,
        department: user.department,
        role: 'student',
        password: 'password123', // Default password
      });

      // Мигрировать прогресс
      if (user.progress) {
        for (const [moduleId, progress] of Object.entries(user.progress)) {
          await apiService.updateOrCreateProgress({
            user_id: createdUser.id,
            module_id: moduleId,
            started: progress.started,
            viewed_lessons: progress.viewed,
            completed_lessons: progress.completed,
            total_lessons: progress.total,
          });
        }
      }

      // Мигрировать результаты тестов
      if (user.testResults) {
        for (const result of user.testResults) {
          await apiService.createTestResult({
            user: createdUser.id,
            module: result.moduleId,
            lesson: null,
            score: result.score,
            passed: result.score >= 70,
          });
        }
      }
    } catch (error) {
      console.error(`Failed to migrate user ${user.name}:`, error);
    }
  }

  console.log('Migration completed!');
}
```

Вызовите эту функцию из консоли браузера:
```javascript
import { migrateDataToBackend } from './utils/exportToBackend';
migrateDataToBackend();
```

## Тестирование интеграции

### 1. Проверка Backend

Откройте: http://localhost:8000/api/

Вы увидите Django REST Framework browsable API со списком endpoints.

### 2. Проверка CORS

Убедитесь, что в `backend/settings.py` настроен CORS:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
]
```

### 3. Тестирование через Postman/Thunder Client

**GET Modules:**
```
GET http://localhost:8000/api/modules/
```

**Create User:**
```
POST http://localhost:8000/api/users/
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "department": "IT"
}
```

## Troubleshooting

### CORS Error
Убедитесь что:
1. Django сервер запущен
2. В `settings.py` добавлен `corsheaders` в `INSTALLED_APPS`
3. Frontend URL добавлен в `CORS_ALLOWED_ORIGINS`

### 404 Not Found
Проверьте:
1. Правильность URL в `api.js`
2. Запущен ли Django сервер
3. Применены ли миграции

### 500 Server Error
Проверьте:
1. Логи Django сервера
2. Правильность данных в запросе
3. Наличие обязательных полей

## Production Deployment

### Backend (Django)

```bash
# Установить Gunicorn
pip install gunicorn

# Собрать статические файлы
python manage.py collectstatic

# Запустить с Gunicorn
gunicorn backend.wsgi:application --bind 0.0.0.0:8000
```

### Frontend (React)

```bash
# Собрать для production
npm run build

# Результат в папке dist/
# Разместить на Nginx/Apache/Vercel/Netlify
```

### Environment Variables

Создайте `.env` файл для production:

```env
DEBUG=False
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DATABASE_URL=postgresql://user:password@localhost:5432/istudy
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

## Дополнительные ресурсы

- [Django REST Framework Documentation](https://www.django-rest-framework.org/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Django CORS Headers](https://github.com/adamchainz/django-cors-headers)

## Поддержка

При возникновении проблем:
1. Проверьте логи Django: в консоли где запущен `runserver`
2. Проверьте консоль браузера (F12)
3. Убедитесь что оба сервера запущены (Backend и Frontend)
