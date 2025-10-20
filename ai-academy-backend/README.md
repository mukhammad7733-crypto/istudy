# AI Academy - Django Backend

Полнофункциональный бэкенд для AI Academy на Django с REST API.

## Требования

- Python 3.10 или выше
- pip (Python package manager)

## Установка

### 1. Установите Python
Если Python не установлен, скачайте и установите с официального сайта:
https://www.python.org/downloads/

При установке обязательно отметьте "Add Python to PATH"

### 2. Создайте виртуальное окружение

```bash
cd ai-academy-backend
python -m venv venv
```

### 3. Активируйте виртуальное окружение

**Windows:**
```bash
venv\Scripts\activate
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

### 4. Установите зависимости

```bash
pip install -r requirements.txt
```

### 5. Настройте базу данных

Обновите файл `backend/settings.py` в соответствии с вашей базой данных.

Для SQLite (по умолчанию) ничего менять не нужно.

### 6. Примените миграции

```bash
python manage.py makemigrations
python manage.py migrate
```

### 7. Создайте суперпользователя

```bash
python manage.py createsuperuser
```

Следуйте инструкциям для создания администратора.

### 8. Загрузите начальные данные (опционально)

```bash
python manage.py loaddata fixtures/initial_data.json
```

### 9. Запустите сервер

```bash
python manage.py runserver
```

Сервер будет доступен по адресу: http://localhost:8000

## API Endpoints

### Пользователи
- `GET /api/users/` - Список всех пользователей
- `POST /api/users/` - Создать нового пользователя
- `GET /api/users/{id}/` - Детали пользователя
- `PUT /api/users/{id}/` - Обновить пользователя
- `DELETE /api/users/{id}/` - Удалить пользователя
- `GET /api/users/{id}/detail_with_progress/` - Детали с прогрессом
- `GET /api/users/search/?q={query}` - Поиск пользователей

### Модули
- `GET /api/modules/` - Список активных модулей
- `POST /api/modules/` - Создать новый модуль
- `GET /api/modules/{id}/` - Детали модуля с уроками
- `PUT /api/modules/{id}/` - Обновить модуль
- `DELETE /api/modules/{id}/` - Удалить модуль
- `GET /api/modules/all_with_inactive/` - Все модули включая неактивные

### Уроки
- `GET /api/lessons/` - Список уроков
- `POST /api/lessons/` - Создать урок
- `GET /api/lessons/{id}/` - Детали урока
- `PUT /api/lessons/{id}/` - Обновить урок
- `DELETE /api/lessons/{id}/` - Удалить урок
- `GET /api/lessons/by_module/?module_id={id}` - Уроки по модулю

### Вопросы
- `GET /api/questions/` - Список вопросов
- `POST /api/questions/` - Создать вопрос
- `GET /api/questions/{id}/` - Детали вопроса с ответами
- `PUT /api/questions/{id}/` - Обновить вопрос
- `DELETE /api/questions/{id}/` - Удалить вопрос
- `GET /api/questions/by_module/?module_id={id}` - Вопросы по модулю

### Прогресс
- `GET /api/progress/` - Список прогресса
- `POST /api/progress/` - Создать прогресс
- `GET /api/progress/{id}/` - Детали прогресса
- `PUT /api/progress/{id}/` - Обновить прогресс
- `DELETE /api/progress/{id}/` - Удалить прогресс
- `GET /api/progress/by_user/?user_id={id}` - Прогресс пользователя
- `POST /api/progress/update_or_create/` - Создать или обновить прогресс

### Результаты тестов
- `GET /api/test-results/` - Список результатов
- `POST /api/test-results/` - Создать результат
- `GET /api/test-results/{id}/` - Детали результата
- `PUT /api/test-results/{id}/` - Обновить результат
- `DELETE /api/test-results/{id}/` - Удалить результат
- `GET /api/test-results/by_user/?user_id={id}` - Результаты пользователя

### AI Агенты
- `GET /api/ai-agents/` - Список агентов
- `POST /api/ai-agents/` - Создать агента
- `GET /api/ai-agents/{id}/` - Детали агента
- `PUT /api/ai-agents/{id}/` - Обновить агента
- `DELETE /api/ai-agents/{id}/` - Удалить агента
- `GET /api/ai-agents/by_user/?user_id={id}` - Агент пользователя

### Вопросы для AI агентов
- `GET /api/ai-agent-questions/` - Список вопросов с опциями
- `GET /api/ai-agent-questions/{id}/` - Детали вопроса

## Admin Panel

Django Admin доступен по адресу: http://localhost:8000/admin

Войдите с помощью учетных данных суперпользователя.

## Настройка CORS

По умолчанию CORS настроен для работы с React фронтендом на:
- http://localhost:5173
- http://localhost:3000

Для изменения отредактируйте `backend/settings.py` в разделе CORS_ALLOWED_ORIGINS.

## Структура проекта

```
ai-academy-backend/
├── backend/              # Главные настройки Django
│   ├── __init__.py
│   ├── settings.py      # Настройки проекта
│   ├── urls.py          # Главные URL роуты
│   ├── wsgi.py          # WSGI конфигурация
│   └── asgi.py          # ASGI конфигурация
├── api/                 # API приложение
│   ├── migrations/      # Миграции базы данных
│   ├── __init__.py
│   ├── admin.py         # Django Admin конфигурация
│   ├── apps.py          # Конфигурация приложения
│   ├── models.py        # Модели базы данных
│   ├── serializers.py   # DRF сериализаторы
│   ├── views.py         # API views
│   └── urls.py          # API URL роуты
├── manage.py            # Django управляющий скрипт
├── requirements.txt     # Python зависимости
└── README.md           # Документация
```

## Модели базы данных

1. **User** - Кастомная модель пользователя
2. **Module** - Учебные модули
3. **Lesson** - Уроки в модулях
4. **Question** - Вопросы для тестов
5. **Answer** - Варианты ответов
6. **UserProgress** - Прогресс пользователя
7. **TestResult** - Результаты тестов
8. **AIAgent** - Конфигурации AI агентов
9. **AIAgentQuestion** - Вопросы для создания агентов
10. **AIAgentQuestionOption** - Опции вопросов

## Команды для разработки

### Создать миграции
```bash
python manage.py makemigrations
```

### Применить миграции
```bash
python manage.py migrate
```

### Создать суперпользователя
```bash
python manage.py createsuperuser
```

### Запустить сервер
```bash
python manage.py runserver
```

### Запустить сервер на другом порту
```bash
python manage.py runserver 8080
```

### Очистить базу данных
```bash
python manage.py flush
```

### Создать фикстуры (сохранить данные)
```bash
python manage.py dumpdata api --indent 2 > fixtures/data.json
```

### Загрузить фикстуры
```bash
python manage.py loaddata fixtures/data.json
```

## Подключение к React фронтенду

Обновите файл конфигурации в React проекте для подключения к API:

```javascript
// src/config.js
export const API_BASE_URL = 'http://localhost:8000/api';
```

Теперь можете использовать API endpoints из React приложения.

## Поддержка

При возникновении проблем проверьте:
1. Активировано ли виртуальное окружение
2. Установлены ли все зависимости
3. Применены ли миграции
4. Запущен ли сервер

## Лицензия

MIT License
