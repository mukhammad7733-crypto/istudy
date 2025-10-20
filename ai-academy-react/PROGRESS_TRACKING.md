# Система отслеживания прогресса обучения

## 📊 Обзор изменений

Исправлена система подсчета прогресса и улучшена логика взаимодействия с завершенными модулями.

---

## ✅ Что было исправлено

### 1. **Правильный подсчет прогресса**

#### Было:
- Прогресс увеличивался некорректно
- Тесты не учитывались в общем прогрессе модуля
- При повторном прохождении прогресс не сбрасывался

#### Стало:
- ✅ Каждый завершенный урок увеличивает `completed` на 1
- ✅ Завершение теста также учитывается и увеличивает `completed`
- ✅ При нажатии "Начать заново" прогресс сбрасывается до 0

### 2. **Изменена кнопка для завершенных модулей**

#### Было:
```
"Пройти снова"
```

#### Стало:
```
"Начать заново"
```

Более понятное действие для пользователя.

### 3. **Умное продолжение обучения**

#### Функциональность:

**При первом запуске модуля:**
- Начинается с урока 0 (первый урок)
- `completed = 0`

**При нажатии "Продолжить":**
- Начинается с урока под номером `completed`
- Продолжение с последнего незавершенного урока
- Сохраняется предыдущий прогресс

**При нажатии "Начать заново":**
- Начинается с урока 0
- `completed` сбрасывается до 0
- Полный перезапуск модуля

---

## 🔧 Технические детали

### Файл: `UserDashboard.jsx`

#### 1. Функция `handleStartModule`

```javascript
const handleStartModule = (moduleId, restart = false) => {
  const moduleProgress = currentUser.progress[moduleId];

  // Если restart или не начат - начинаем с первого урока
  // Если продолжаем - начинаем с урока, равного completed
  const startLesson = restart || !moduleProgress.started
    ? 0
    : moduleProgress.completed;

  setSelectedModule(moduleId);
  setSelectedLesson(startLesson);
  setCurrentView('lesson');

  // Обновляем прогресс
  setCurrentUser(prev => ({
    ...prev,
    progress: {
      ...prev.progress,
      [moduleId]: {
        ...prev.progress[moduleId],
        started: true,
        completed: restart ? 0 : prev.progress[moduleId].completed
      }
    }
  }));
};
```

**Параметры:**
- `moduleId` - ID модуля
- `restart` - флаг для полного перезапуска (default: false)

**Логика:**
- `restart = true` → урок 0, completed = 0
- `restart = false` и не начат → урок 0
- `restart = false` и начат → урок = completed

#### 2. Функция `handleCompleteLesson`

```javascript
const handleCompleteLesson = () => {
  setCurrentUser(prev => {
    const moduleProgress = prev.progress[selectedModule];
    return {
      ...prev,
      progress: {
        ...prev.progress,
        [selectedModule]: {
          ...moduleProgress,
          completed: Math.min(
            moduleProgress.completed + 1,
            moduleProgress.total
          )
        }
      }
    };
  });
};
```

**Действие:**
- Увеличивает `completed` на 1
- Максимум до значения `total`
- Вызывается при завершении каждого урока

#### 3. Функция `handleCompleteTest`

```javascript
const handleCompleteTest = (score) => {
  const newTestResult = {
    moduleId: selectedModule,
    score: score,
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].substring(0, 5)
  };

  // Увеличиваем прогресс на 1 за тест
  setCurrentUser(prev => {
    const moduleProgress = prev.progress[selectedModule];
    return {
      ...prev,
      testResults: [...prev.testResults, newTestResult],
      progress: {
        ...prev.progress,
        [selectedModule]: {
          ...moduleProgress,
          completed: Math.min(
            moduleProgress.completed + 1,
            moduleProgress.total
          )
        }
      }
    };
  });

  setCurrentView('catalog');
  setSelectedModule(null);
  setSelectedLesson(null);
};
```

**Действие:**
- Сохраняет результат теста
- Увеличивает `completed` на 1
- Возвращает в каталог курсов

---

### Файл: `ModuleCatalog.jsx`

#### Изменения в кнопке

```javascript
<button
  onClick={() => onStartModule(module.id, isCompleted)}
  className={`w-full py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold transition-colors ${
    isCompleted
      ? 'bg-green-600 hover:bg-green-700 text-white'
      : isStarted
      ? 'bg-blue-600 hover:bg-blue-700 text-white'
      : 'bg-gray-900 hover:bg-gray-800 text-white'
  }`}
>
  {isCompleted ? 'Начать заново' : isStarted ? 'Продолжить' : 'Начать'}
</button>
```

**Параметры:**
- Первый параметр: `module.id`
- Второй параметр: `isCompleted` (если true, будет restart)

**Текст кнопки:**
- `isCompleted = true` → "Начать заново" (зеленая)
- `isStarted = true` → "Продолжить" (синяя)
- Иначе → "Начать" (черная)

---

## 📈 Структура прогресса

### Объект прогресса модуля

```javascript
progress: {
  1: {
    started: true,      // Начат ли модуль
    completed: 5,       // Количество завершенных уроков
    total: 7           // Всего уроков (включая тест)
  }
}
```

### Расчет завершенности

```javascript
const isCompleted = progress.completed === progress.total;
const progressPercent = Math.round(
  (progress.completed / progress.total) * 100
);
```

---

## 🎯 Примеры использования

### Сценарий 1: Новый пользователь начинает модуль

```
1. Нажимает "Начать" → урок 0, completed = 0
2. Завершает урок 1 → completed = 1
3. Завершает урок 2 → completed = 2
...
6. Завершает урок 6 → completed = 6
7. Проходит тест → completed = 7 (завершено!)
```

### Сценарий 2: Продолжение прерванного модуля

```
Состояние: started = true, completed = 3

1. Нажимает "Продолжить" → начинается урок 3
2. Продолжает с момента остановки
3. completed остается 3 до завершения урока 3
```

### Сценарий 3: Повторное прохождение

```
Состояние: started = true, completed = 7 (завершен)

1. Нажимает "Начать заново" → урок 0, completed = 0
2. Прогресс полностью сбрасывается
3. Можно пройти модуль заново
```

---

## 🔍 Отладка

### Проверка текущего прогресса

В консоли браузера:
```javascript
// Посмотреть прогресс всех модулей
console.log(currentUser.progress);

// Проверить конкретный модуль
console.log(currentUser.progress[1]);
```

### Типичные проблемы

**Проблема:** Прогресс не увеличивается
- Проверьте, вызывается ли `handleCompleteLesson()`
- Убедитесь, что `completed < total`

**Проблема:** Кнопка показывает неверный текст
- Проверьте значения `isCompleted` и `isStarted`
- Убедитесь, что `progress.completed === progress.total`

---

## 📝 Заметки для разработчиков

1. **Каждый модуль имеет 7 уроков** (6 обычных + 1 тест)
2. **`completed` отражает количество завершенных уроков**, включая тест
3. **Прогресс сохраняется в состоянии компонента** `UserDashboard`
4. **Для production** потребуется сохранение в backend/localStorage

---

## ✨ Будущие улучшения

- [ ] Сохранение прогресса в localStorage
- [ ] Синхронизация с backend API
- [ ] Подтверждение при нажатии "Начать заново"
- [ ] Детальная статистика по каждому уроку
- [ ] Время, затраченное на модуль
- [ ] Система достижений

---

**Дата обновления:** 2025-10-17
**Версия:** 2.0
