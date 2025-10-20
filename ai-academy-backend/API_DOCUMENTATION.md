# AI Academy API Documentation

## Base URL
```
http://localhost:8000/api/
```

## Authentication
По умолчанию все endpoints открыты (AllowAny). В production рекомендуется добавить аутентификацию.

---

## Users API

### List all users
```
GET /api/users/
```

**Response:**
```json
[
  {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "department": "IT",
    "role": "student",
    "time_spent": 120,
    "last_activity": "2025-01-15",
    "created_at": "2025-01-01T10:00:00Z"
  }
]
```

### Create user
```
POST /api/users/
Content-Type: application/json

{
  "username": "new_user",
  "email": "user@example.com",
  "first_name": "New",
  "last_name": "User",
  "department": "Marketing",
  "role": "student",
  "password": "secure_password"
}
```

### Get user detail
```
GET /api/users/{id}/
```

### Get user with progress
```
GET /api/users/{id}/detail_with_progress/
```

**Response:**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "progress": [
    {
      "module": 1,
      "module_title": "Введение в AI",
      "started": true,
      "viewed_lessons": 3,
      "completed_lessons": 2,
      "total_lessons": 6
    }
  ],
  "test_results": [
    {
      "module": 1,
      "score": 85,
      "passed": true,
      "completed_at": "2025-01-15T14:30:00Z"
    }
  ],
  "ai_agent": {
    "area": "Обслуживание клиентов",
    "language_model": "GPT-4"
  }
}
```

### Search users
```
GET /api/users/search/?q=john
```

### Update user
```
PUT /api/users/{id}/
Content-Type: application/json

{
  "email": "newemail@example.com",
  "department": "Sales"
}
```

### Delete user
```
DELETE /api/users/{id}/
```

---

## Modules API

### List all active modules
```
GET /api/modules/
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Введение в AI",
    "description": "Основы искусственного интеллекта",
    "icon": "Brain",
    "duration": 270,
    "order": 0,
    "is_active": true,
    "lesson_count": 6,
    "lessons": [
      {
        "id": 1,
        "title": "Что такое AI?",
        "content": "...",
        "video_url": "https://youtube.com/...",
        "order": 0
      }
    ],
    "questions": []
  }
]
```

### Get all modules (including inactive)
```
GET /api/modules/all_with_inactive/
```

### Create module
```
POST /api/modules/
Content-Type: application/json

{
  "title": "Новый модуль",
  "description": "Описание модуля",
  "icon": "Cpu",
  "duration": 180,
  "order": 5,
  "is_active": true
}
```

### Update module
```
PUT /api/modules/{id}/
```

### Delete module
```
DELETE /api/modules/{id}/
```

---

## Lessons API

### List all lessons
```
GET /api/lessons/
```

### Get lessons by module
```
GET /api/lessons/by_module/?module_id=1
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Что такое AI?",
    "content": "Искусственный интеллект...",
    "video_url": "https://youtube.com/watch?v=...",
    "video_title": "AI Basics",
    "video_channel": "AI Channel",
    "video_duration": "15:30",
    "order": 0,
    "questions": []
  }
]
```

### Create lesson
```
POST /api/lessons/
Content-Type: application/json

{
  "module": 1,
  "title": "Новый урок",
  "content": "Содержание урока",
  "video_url": "https://youtube.com/...",
  "order": 1
}
```

---

## Questions API

### List all questions
```
GET /api/questions/
```

### Get questions by module
```
GET /api/questions/by_module/?module_id=1
```

**Response:**
```json
[
  {
    "id": 1,
    "question_text": "Что такое нейронная сеть?",
    "question_type": "single",
    "order": 0,
    "answers": [
      {
        "id": 1,
        "answer_text": "Модель машинного обучения",
        "is_correct": true,
        "order": 0
      },
      {
        "id": 2,
        "answer_text": "База данных",
        "is_correct": false,
        "order": 1
      }
    ]
  }
]
```

### Create question
```
POST /api/questions/
Content-Type: application/json

{
  "module": 1,
  "question_text": "Новый вопрос?",
  "question_type": "single",
  "order": 0
}
```

---

## User Progress API

### List all progress
```
GET /api/progress/
```

### Get progress by user
```
GET /api/progress/by_user/?user_id=1
```

**Response:**
```json
[
  {
    "id": 1,
    "user": 1,
    "user_name": "john_doe",
    "module": 1,
    "module_title": "Введение в AI",
    "started": true,
    "viewed_lessons": 3,
    "completed_lessons": 2,
    "total_lessons": 6,
    "updated_at": "2025-01-15T10:30:00Z"
  }
]
```

### Create or update progress
```
POST /api/progress/update_or_create/
Content-Type: application/json

{
  "user_id": 1,
  "module_id": 1,
  "started": true,
  "viewed_lessons": 4,
  "completed_lessons": 3,
  "total_lessons": 6
}
```

---

## Test Results API

### List all test results
```
GET /api/test-results/
```

### Get results by user
```
GET /api/test-results/by_user/?user_id=1
```

**Response:**
```json
[
  {
    "id": 1,
    "user": 1,
    "user_name": "john_doe",
    "module": 1,
    "module_title": "Введение в AI",
    "lesson": null,
    "lesson_title": null,
    "score": 85,
    "passed": true,
    "completed_at": "2025-01-15T14:30:00Z"
  }
]
```

### Create test result
```
POST /api/test-results/
Content-Type: application/json

{
  "user": 1,
  "module": 1,
  "lesson": null,
  "score": 90,
  "passed": true
}
```

---

## AI Agents API

### List all AI agents
```
GET /api/ai-agents/
```

### Get agent by user
```
GET /api/ai-agents/by_user/?user_id=1
```

**Response:**
```json
{
  "id": 1,
  "user": 1,
  "user_name": "john_doe",
  "area": "Обслуживание клиентов",
  "autonomy_level": "С одобрением пользователя",
  "data_types": "Текстовые данные",
  "language_model": "GPT-4",
  "response_speed": "Быстрая (1-3 сек)",
  "integrations": "Да, с CRM",
  "personalization": "Высокий (изучение пользователя)",
  "success_metrics": "Точность ответов",
  "learning_capability": "Да, постоянное обучение",
  "budget": "Средний",
  "created_at": "2025-01-15T12:00:00Z"
}
```

### Create AI agent
```
POST /api/ai-agents/
Content-Type: application/json

{
  "user": 1,
  "area": "Анализ данных",
  "autonomy_level": "Полностью автономный",
  "data_types": "Смешанные данные",
  "language_model": "Claude",
  "response_speed": "Мгновенная (< 1 сек)",
  "integrations": "Да, с базами данных",
  "personalization": "Средний (базовые настройки)",
  "success_metrics": "Скорость обработки",
  "learning_capability": "Периодическое обновление",
  "budget": "Высокий"
}
```

---

## AI Agent Questions API

### List all questions with options
```
GET /api/ai-agent-questions/
```

**Response:**
```json
[
  {
    "id": 1,
    "question_id": 1,
    "question_text": "Какую область применения вы хотите для вашего AI агента?",
    "order": 0,
    "options": [
      {
        "id": 1,
        "option_text": "Обслуживание клиентов",
        "order": 0
      },
      {
        "id": 2,
        "option_text": "Анализ данных",
        "order": 1
      }
    ]
  }
]
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid data provided"
}
```

### 404 Not Found
```json
{
  "detail": "Not found."
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Pagination

Все list endpoints поддерживают пагинацию:

```
GET /api/users/?page=2&page_size=10
```

**Response:**
```json
{
  "count": 50,
  "next": "http://localhost:8000/api/users/?page=3",
  "previous": "http://localhost:8000/api/users/?page=1",
  "results": [...]
}
```

---

## Filtering and Ordering

Некоторые endpoints поддерживают фильтрацию и сортировку через query parameters.

Примеры будут добавлены по мере необходимости.
