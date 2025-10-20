# 🚀 iStudy - Быстрый Старт

Полнофункциональная платформа онлайн-обучения с React Frontend и Django Backend.

## 📋 Требования

- **Python 3.10+**
- **Node.js 18+**
- **npm** или **yarn**

## ⚡ Запуск за 5 минут

### 1️⃣ Клонируйте репозиторий (если еще не сделано)

```bash
cd D:\Developer\ai-study
```

### 2️⃣ Настройка Backend (Django)

```bash
cd ai-academy-backend

# Создать виртуальное окружение
python -m venv venv

# Активировать (Windows)
venv\Scripts\activate

# Установить зависимости
pip install -r requirements.txt

# Применить миграции
python manage.py migrate

# Создать администратора
python manage.py createsuperuser
# Email: admin@sqb.uz
# Password: admin123

# Запустить сервер
python manage.py runserver
```

**Backend работает на:** http://localhost:8000

### 3️⃣ Настройка Frontend (React)

Откройте **новое окно терминала**:

```bash
cd D:\Developer\ai-study\ai-academy-react

# Установить зависимости
npm install

# Запустить dev-сервер
npm run dev
```

**Frontend работает на:** http://localhost:5173

## 🎯 Тестирование

### Доступы:

**Администратор:**
- Email: `admin@sqb.uz`
- Password: `admin123`

**API Documentation:**
- Django Admin: http://localhost:8000/admin
- REST API Root: http://localhost:8000/api/

## 📁 Структура проекта

```
ai-study/
├── ai-academy-react/          # React Frontend
│   ├── src/
│   │   ├── components/        # React компоненты
│   │   │   ├── admin/        # Админ панель
│   │   │   └── user/         # Пользовательский интерфейс
│   │   ├── data/             # Mock данные (для разработки без бэкенда)
│   │   ├── App.jsx           # Главный компонент
│   │   └── main.jsx          # Entry point
│   ├── package.json
│   └── vite.config.js
│
└── ai-academy-backend/        # Django Backend
    ├── api/                   # API приложение
    │   ├── models.py         # Модели БД
    │   ├── serializers.py    # DRF сериализаторы
    │   ├── views.py          # API views
    │   └── urls.py           # API маршруты
    ├── backend/              # Настройки проекта
    │   ├── settings.py       # Django settings
    │   └── urls.py           # Главные маршруты
    ├── manage.py
    └── requirements.txt
```

## 🔧 Основные команды

### Backend (Django)

```bash
# Создать миграции
python manage.py makemigrations

# Применить миграции
python manage.py migrate

# Создать суперпользователя
python manage.py createsuperuser

# Запустить сервер
python manage.py runserver

# Запустить на другом порту
python manage.py runserver 8080
```

### Frontend (React)

```bash
# Установить зависимости
npm install

# Запустить dev-сервер
npm run dev

# Собрать для production
npm run build

# Предпросмотр production сборки
npm run preview
```

## 📊 Модели базы данных

1. **User** - Пользователи (студенты и админы)
2. **Module** - Учебные модули
3. **Lesson** - Уроки в модулях
4. **Question** - Вопросы для тестов
5. **Answer** - Варианты ответов
6. **UserProgress** - Прогресс пользователя по модулям
7. **TestResult** - Результаты тестов
8. **AIAgent** - Конфигурации AI агентов пользователей
9. **AIAgentQuestion** - Вопросы для создания AI агента
10. **AIAgentQuestionOption** - Опции вопросов

## 🔌 API Endpoints

### Пользователи
- `GET /api/users/` - Список пользователей
- `POST /api/users/` - Создать пользователя
- `GET /api/users/{id}/` - Детали пользователя
- `GET /api/users/{id}/detail_with_progress/` - Полная информация с прогрессом

### Модули
- `GET /api/modules/` - Список модулей
- `POST /api/modules/` - Создать модуль
- `GET /api/modules/{id}/` - Детали модуля с уроками и тестами

### Уроки
- `GET /api/lessons/` - Список уроков
- `GET /api/lessons/by_module/?module_id={id}` - Уроки по модулю

### Тесты
- `GET /api/questions/by_module/?module_id={id}` - Вопросы теста модуля
- `POST /api/questions/` - Создать вопрос

### Прогресс
- `GET /api/progress/by_user/?user_id={id}` - Прогресс пользователя
- `POST /api/progress/update_or_create/` - Обновить прогресс

### Результаты тестов
- `GET /api/test-results/by_user/?user_id={id}` - Результаты пользователя
- `POST /api/test-results/` - Сохранить результат теста

## 📚 Функциональность

### ✅ Реализовано

**Админ-панель:**
- ✅ Управление пользователями (CRUD)
- ✅ Управление модулями и уроками
- ✅ Создание тестов для модулей
- ✅ Просмотр прогресса пользователей
- ✅ Экспорт данных
- ✅ Статистика

**Пользовательский интерфейс:**
- ✅ Авторизация
- ✅ Каталог модулей
- ✅ Просмотр уроков
- ✅ Прохождение тестов
- ✅ Отслеживание прогресса
- ✅ AI ChatBot (после завершения всех модулей)

**Backend API:**
- ✅ REST API с Django REST Framework
- ✅ Модели базы данных
- ✅ Аутентификация
- ✅ CORS настроен
- ✅ Admin Panel

### 🔨 Работает автономно

Сейчас Frontend работает с **localStorage** (без подключения к Backend).
Для подключения к Backend API см. **[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)**

## 🎨 Особенности

- **Адаптивный дизайн** - работает на всех устройствах
- **Темная тема** - для комфортной работы
- **Прогресс в реальном времени** - видите свой прогресс сразу
- **Интерактивные тесты** - с мгновенной проверкой
- **AI интеграция** - персонализированный AI агент
- **Модульная архитектура** - легко расширять

## 🐛 Troubleshooting

### Backend не запускается

```bash
# Проверьте что виртуальное окружение активировано
venv\Scripts\activate

# Переустановите зависимости
pip install -r requirements.txt

# Примените миграции
python manage.py migrate
```

### Frontend не запускается

```bash
# Очистите node_modules и переустановите
rm -rf node_modules package-lock.json
npm install

# Или используйте чистую установку
npm ci
```

### CORS ошибки

Убедитесь что:
1. Django сервер запущен
2. В `backend/settings.py` добавлен Frontend URL в `CORS_ALLOWED_ORIGINS`

### База данных не создается

```bash
# Удалите файл db.sqlite3 и создайте заново
rm db.sqlite3
python manage.py migrate
python manage.py createsuperuser
```

## 📖 Дополнительная документация

- **[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)** - Полное руководство по интеграции Frontend и Backend
- **[ai-academy-backend/README.md](./ai-academy-backend/README.md)** - Документация Backend
- **[ai-academy-react/README.md](./ai-academy-react/README.md)** - Документация Frontend

## 🤝 Вклад

Проект открыт для улучшений! Предложения и pull requests приветствуются.

## 📝 Лицензия

MIT License

---

**Создано с ❤️ для образования**
