import { useState, useEffect } from 'react';
import { BookOpen, FileText, Eye, Edit, Upload, Download, Plus, Save, X, ChevronLeft, Check, Trash2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { modulesData } from '../../data/mockData';
import { lessonContent } from '../../data/lessonContent';
import { lessonVideos, getVideoEmbedUrl } from '../../data/lessonVideos';
import AddModuleModal from './AddModuleModal';

function AdminContent({ users, setUsers }) {
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [editedTest, setEditedTest] = useState([]);

  // Загружаем данные из localStorage или используем дефолтные
  const [localContent, setLocalContent] = useState(() => {
    const saved = localStorage.getItem('adminLessonContent');
    return saved ? JSON.parse(saved) : { ...lessonContent };
  });
  const [moduleList, setModuleList] = useState(() => {
    const saved = localStorage.getItem('adminModuleList');
    return saved ? JSON.parse(saved) : [...modulesData];
  });

  // Хранилище тестов для модулей
  const [moduleTests, setModuleTests] = useState(() => {
    const saved = localStorage.getItem('adminModuleTests');
    return saved ? JSON.parse(saved) : {};
  });

  const [showAddLesson, setShowAddLesson] = useState(false);
  const [newLessonName, setNewLessonName] = useState('');
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [showAddModuleModal, setShowAddModuleModal] = useState(false);
  const [editModuleTest, setEditModuleTest] = useState(false);

  // Сохраняем изменения в localStorage
  useEffect(() => {
    localStorage.setItem('adminLessonContent', JSON.stringify(localContent));
  }, [localContent]);

  useEffect(() => {
    localStorage.setItem('adminModuleList', JSON.stringify(moduleList));
  }, [moduleList]);

  useEffect(() => {
    localStorage.setItem('adminModuleTests', JSON.stringify(moduleTests));
  }, [moduleTests]);

  const getIconComponent = (iconName) => {
    const iconMap = {
      brain: LucideIcons.Brain,
      cpu: LucideIcons.Cpu,
      'file-spreadsheet': LucideIcons.FileSpreadsheet,
      image: LucideIcons.Image,
      'file-text': LucideIcons.FileText,
    };
    return iconMap[iconName] || LucideIcons.BookOpen;
  };

  const handleStartEdit = (lessonName, content) => {
    setEditMode(true);
    setPreviewMode(false);
    setEditedTitle(content?.title || lessonName);
    setEditedContent(content?.content || '');
    setEditedTest(content?.test || []);
  };

  const handleSaveEdit = (lessonName) => {
    const updatedContent = {
      title: editedTitle,
      content: editedContent
    };

    console.log(`Сохранение урока "${lessonName}":`, {
      title: editedTitle,
      contentLength: editedContent.length
    });

    setLocalContent({
      ...localContent,
      [lessonName]: updatedContent
    });
    setEditMode(false);
    setSaveMessage('Изменения сохранены!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditedTitle('');
    setEditedContent('');
    setEditedTest([]);
  };

  const handlePreview = (lessonName, content) => {
    setPreviewMode(true);
    setEditMode(false);
  };

  // Функции для управления тестами модуля
  const handleStartEditModuleTest = (moduleId) => {
    setEditModuleTest(true);
    setEditedTest(moduleTests[moduleId] || []);
  };

  const handleSaveModuleTest = (moduleId) => {
    console.log(`Сохранение теста для модуля "${moduleId}":`, {
      testCount: editedTest.length,
      tests: editedTest
    });

    setModuleTests({
      ...moduleTests,
      [moduleId]: editedTest
    });
    setEditModuleTest(false);
    setSaveMessage(`Тест модуля сохранен! Вопросов: ${editedTest.length}`);
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleCancelEditModuleTest = () => {
    setEditModuleTest(false);
    setEditedTest([]);
  };

  const handleAddQuestion = () => {
    setEditedTest([
      ...editedTest,
      {
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0
      }
    ]);
  };

  const handleDeleteQuestion = (index) => {
    setEditedTest(editedTest.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index, value) => {
    const newTest = [...editedTest];
    newTest[index].question = value;
    setEditedTest(newTest);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const newTest = [...editedTest];
    newTest[questionIndex].options[optionIndex] = value;
    setEditedTest(newTest);
  };

  const handleCorrectAnswerChange = (questionIndex, optionIndex) => {
    const newTest = [...editedTest];
    newTest[questionIndex].correctAnswer = optionIndex;
    setEditedTest(newTest);
  };

  const handleAddLesson = () => {
    if (!newLessonName.trim()) return;

    const module = moduleList.find(m => m.id === selectedModule);
    const updatedModule = {
      ...module,
      lessons: [...module.lessons, newLessonName]
    };

    const updatedModules = moduleList.map(m =>
      m.id === selectedModule ? updatedModule : m
    );

    setModuleList(updatedModules);

    // Обновляем всех пользователей, увеличивая total для данного модуля
    const updatedUsers = users.map(user => {
      // Проверяем, есть ли у пользователя прогресс для этого модуля
      if (user.progress && user.progress[selectedModule]) {
        return {
          ...user,
          progress: {
            ...user.progress,
            [selectedModule]: {
              ...user.progress[selectedModule],
              total: updatedModule.lessons.length
            }
          }
        };
      }
      return user;
    });

    setUsers(updatedUsers);

    // Добавляем контент для нового урока
    setLocalContent({
      ...localContent,
      [newLessonName]: {
        title: newLessonTitle || newLessonName,
        content: 'Новый урок. Добавьте содержимое здесь.'
      }
    });

    setNewLessonName('');
    setNewLessonTitle('');
    setShowAddLesson(false);
    setSaveMessage('Урок успешно добавлен и обновлен у всех пользователей!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(localContent, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'lessons-content.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setSaveMessage('Контент экспортирован!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        setLocalContent({ ...localContent, ...imported });
        setSaveMessage('Контент импортирован!');
        setTimeout(() => setSaveMessage(''), 3000);
      } catch (error) {
        alert('Ошибка импорта: неверный формат файла');
      }
    };
    reader.readAsText(file);
  };

  const handleAddModule = (newModule) => {
    // Добавляем модуль в список
    setModuleList([...moduleList, newModule]);

    // Обновляем всех пользователей, добавляя новый модуль в их progress
    const updatedUsers = users.map(user => ({
      ...user,
      progress: {
        ...user.progress,
        [newModule.id]: {
          started: false,
          viewed: 0,
          completed: 0,
          total: newModule.lessons.length
        }
      }
    }));

    setUsers(updatedUsers);

    setSaveMessage('Модуль успешно создан и добавлен всем пользователям!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleDeleteModule = (moduleId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот модуль? Все данные, связанные с ним, будут потеряны.')) {
      // Удаляем модуль из списка
      setModuleList(moduleList.filter(m => m.id !== moduleId));

      // Удаляем прогресс этого модуля у всех пользователей
      const updatedUsers = users.map(user => {
        const { [moduleId]: removed, ...remainingProgress } = user.progress;
        return {
          ...user,
          progress: remainingProgress,
          testResults: user.testResults.filter(t => t.moduleId !== moduleId)
        };
      });

      setUsers(updatedUsers);

      setSaveMessage('Модуль успешно удален!');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const handleDeleteLesson = (lessonName) => {
    if (window.confirm('Вы уверены, что хотите удалить этот урок?')) {
      const module = moduleList.find(m => m.id === selectedModule);
      const updatedModule = {
        ...module,
        lessons: module.lessons.filter(l => l !== lessonName)
      };

      const updatedModules = moduleList.map(m =>
        m.id === selectedModule ? updatedModule : m
      );

      setModuleList(updatedModules);

      // Удаляем контент урока
      const { [lessonName]: removed, ...remainingContent } = localContent;
      setLocalContent(remainingContent);

      // Обновляем total у всех пользователей для этого модуля
      const updatedUsers = users.map(user => {
        if (user.progress && user.progress[selectedModule]) {
          return {
            ...user,
            progress: {
              ...user.progress,
              [selectedModule]: {
                ...user.progress[selectedModule],
                total: updatedModule.lessons.length
              }
            }
          };
        }
        return user;
      });

      setUsers(updatedUsers);

      setSaveMessage('Урок успешно удален!');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  // Просмотр урока
  if (selectedModule && selectedLesson !== null) {
    const module = moduleList.find(m => m.id === selectedModule);
    const lessonName = module.lessons[selectedLesson];
    const content = localContent[lessonName];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setSelectedLesson(null);
              setEditMode(false);
              setPreviewMode(false);
            }}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            Назад к модулю
          </button>
          {saveMessage && (
            <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg">
              <Check className="w-4 h-4" />
              {saveMessage}
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
            <div className="text-sm opacity-90 mb-2">
              {module.title} • Урок {selectedLesson + 1}
            </div>
            {editMode ? (
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="text-2xl font-bold mb-4 bg-white/20 border-2 border-white/50 rounded px-3 py-2 w-full outline-none"
                placeholder="Заголовок урока"
              />
            ) : (
              <h1 className="text-2xl font-bold mb-4">{content?.title || lessonName}</h1>
            )}
            <div className="flex gap-3">
              {!editMode && !previewMode && (
                <>
                  <button
                    onClick={() => handleStartEdit(lessonName, content)}
                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Редактировать
                  </button>
                  <button
                    onClick={() => handlePreview(lessonName, content)}
                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Предпросмотр
                  </button>
                </>
              )}
              {editMode && (
                <>
                  <button
                    onClick={() => handleSaveEdit(lessonName)}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Сохранить
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Отмена
                  </button>
                </>
              )}
              {previewMode && (
                <button
                  onClick={() => setPreviewMode(false)}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  Закрыть
                </button>
              )}
            </div>
          </div>

          <div className="p-8">
            {editMode ? (
              // Режим редактирования
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Содержание урока:
                  </label>
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    rows={15}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono text-sm"
                    placeholder="Введите содержание урока..."
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Используйте обычный текст. Можно использовать эмодзи и форматирование.
                  </p>
                </div>
              </div>
            ) : previewMode ? (
              // Режим предпросмотра (как у пользователя)
              <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                  <div className="flex gap-2 mb-6">
                    {module.lessons.map((_, index) => (
                      <div
                        key={index}
                        className={`flex-1 h-2 rounded-full ${
                          index < selectedLesson
                            ? 'bg-green-500'
                            : index === selectedLesson
                            ? 'bg-blue-600'
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="prose max-w-none">
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {content?.content || 'Контент отсутствует'}
                    </div>
                  </div>
                </div>

                {/* Видео-плеер */}
                {getVideoEmbedUrl(lessonName) ? (
                  <div className="mb-6">
                    <div className="relative rounded-lg overflow-hidden shadow-lg" style={{ paddingBottom: '56.25%', height: 0 }}>
                      <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src={getVideoEmbedUrl(lessonName)}
                        title={lessonVideos[lessonName]?.title || lessonName}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                    {lessonVideos[lessonName] && (
                      <div className="mt-3 text-sm text-gray-600">
                        <p className="font-medium">{lessonVideos[lessonName].title}</p>
                        <p className="text-gray-500">
                          {lessonVideos[lessonName].channel} • {lessonVideos[lessonName].duration}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center mb-6">
                    <div className="text-center text-white">
                      <Eye className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-sm opacity-75">Видео-контент (предпросмотр)</p>
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-sm text-blue-800">
                    👁️ Режим предпросмотра - так урок будет выглядеть для пользователей
                  </p>
                </div>
              </div>
            ) : (
              // Обычный просмотр (для админа)
              <div className="prose max-w-none">
                <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-600 mb-3">Содержание урока:</h3>
                  <div className="text-gray-700 whitespace-pre-line">
                    {content?.content || 'Контент не найден'}
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    💡 Нажмите "Редактировать" для изменения контента или "Предпросмотр" для просмотра в режиме пользователя
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Просмотр модуля
  if (selectedModule) {
    const module = moduleList.find(m => m.id === selectedModule);
    const IconComponent = getIconComponent(module.icon);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setSelectedModule(null);
              setShowAddLesson(false);
            }}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            Назад к списку модулей
          </button>
          {saveMessage && (
            <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg">
              <Check className="w-4 h-4" />
              {saveMessage}
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-blue-100 p-3 rounded-xl">
              <IconComponent className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{module.title}</h2>
              <p className="text-gray-600">Управление уроками модуля</p>
            </div>
            <button
              onClick={() => setShowAddLesson(!showAddLesson)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Добавить урок
            </button>
          </div>

          {showAddLesson && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Новый урок</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Название урока
                  </label>
                  <input
                    type="text"
                    value={newLessonName}
                    onChange={(e) => setNewLessonName(e.target.value)}
                    placeholder="Например: Основы машинного обучения"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Заголовок урока (опционально)
                  </label>
                  <input
                    type="text"
                    value={newLessonTitle}
                    onChange={(e) => setNewLessonTitle(e.target.value)}
                    placeholder="Полный заголовок урока"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddLesson}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Создать урок
                  </button>
                  <button
                    onClick={() => {
                      setShowAddLesson(false);
                      setNewLessonName('');
                      setNewLessonTitle('');
                    }}
                    className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Отмена
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {module.lessons.map((lesson, index) => {
              const hasContent = localContent[lesson];
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-semibold text-gray-600">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{lesson}</div>
                      {hasContent && (
                        <div className="text-xs text-gray-500">
                          {hasContent.title}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        hasContent
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {hasContent ? 'Готов' : 'Шаблон'}
                    </span>
                    <button
                      onClick={() => setSelectedLesson(index)}
                      className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Просмотреть урок"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedLesson(index);
                        setTimeout(() => handleStartEdit(lesson, hasContent), 100);
                      }}
                      className="text-green-600 hover:text-green-700 p-2 hover:bg-green-50 rounded-lg transition-colors"
                      title="Редактировать урок"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteLesson(lesson);
                      }}
                      className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Удалить урок"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Управление тестом модуля */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Итоговый тест модуля</h3>
              <p className="text-sm text-gray-600">
                Тест будет показан после завершения всех уроков модуля
              </p>
            </div>
            {!editModuleTest && (
              <button
                onClick={() => handleStartEditModuleTest(module.id)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-4 h-4" />
                {moduleTests[module.id] && moduleTests[module.id].length > 0 ? 'Редактировать тест' : 'Создать тест'}
              </button>
            )}
          </div>

          {editModuleTest ? (
            // Режим редактирования теста
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900">
                    Вопросов в тесте: {editedTest.length}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddQuestion}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Добавить вопрос
                  </button>
                  <button
                    onClick={() => handleSaveModuleTest(module.id)}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                  >
                    <Save className="w-4 h-4" />
                    Сохранить
                  </button>
                  <button
                    onClick={handleCancelEditModuleTest}
                    className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    <X className="w-4 h-4" />
                    Отмена
                  </button>
                </div>
              </div>

              {editedTest.length === 0 ? (
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <p className="text-gray-600">Нет вопросов. Нажмите "Добавить вопрос" для создания теста.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {editedTest.map((q, qIndex) => (
                    <div key={qIndex} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start justify-between mb-3">
                        <label className="text-sm font-semibold text-gray-700">
                          Вопрос {qIndex + 1}
                        </label>
                        <button
                          onClick={() => handleDeleteQuestion(qIndex)}
                          className="text-red-600 hover:text-red-700 p-1"
                          title="Удалить вопрос"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <input
                        type="text"
                        value={q.question}
                        onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                        placeholder="Введите текст вопроса..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none mb-3"
                      />

                      <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-600">Варианты ответов:</label>
                        {q.options.map((option, oIndex) => (
                          <div key={oIndex} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`correct-${qIndex}`}
                              checked={q.correctAnswer === oIndex}
                              onChange={() => handleCorrectAnswerChange(qIndex, oIndex)}
                              className="w-4 h-4 text-green-600 focus:ring-green-500"
                              title="Отметить как правильный ответ"
                            />
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                              placeholder={`Вариант ${oIndex + 1}`}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                            />
                            {q.correctAnswer === oIndex && (
                              <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                            )}
                          </div>
                        ))}
                        <p className="text-xs text-gray-500 mt-1">
                          ✓ Выберите радиокнопку для отметки правильного ответа
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Режим просмотра теста
            <div>
              {moduleTests[module.id] && moduleTests[module.id].length > 0 ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-green-800">
                      ✅ Тест создан! Вопросов: {moduleTests[module.id].length}
                    </p>
                  </div>
                  {moduleTests[module.id].map((q, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <p className="font-medium text-gray-900 mb-3">
                        {index + 1}. {q.question}
                      </p>
                      <div className="space-y-2">
                        {q.options.map((option, oIndex) => (
                          <div
                            key={oIndex}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                              q.correctAnswer === oIndex
                                ? 'bg-green-100 border border-green-300'
                                : 'bg-white border border-gray-200'
                            }`}
                          >
                            {q.correctAnswer === oIndex && (
                              <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                            )}
                            <span className="text-sm text-gray-700">{option}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium mb-1">Тест не создан</p>
                  <p className="text-sm text-gray-500">
                    Нажмите "Создать тест" чтобы добавить итоговый тест для этого модуля
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Главная страница управления контентом
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Управление контентом</h2>
          <p className="text-sm sm:text-base text-gray-600">Редактирование модулей и уроков</p>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={() => setShowAddModuleModal(true)}
            className="flex items-center gap-1.5 sm:gap-2 bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Новый модуль</span>
            <span className="sm:hidden">Модуль</span>
          </button>
          <label className="flex items-center gap-1.5 sm:gap-2 border border-gray-300 text-gray-700 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors text-sm">
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Импорт</span>
            <span className="sm:hidden">Импорт</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 sm:gap-2 border border-gray-300 text-gray-700 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Экспорт</span>
            <span className="sm:hidden">Эксп.</span>
          </button>
        </div>
      </div>

      {saveMessage && (
        <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-green-200 text-sm">
          <Check className="w-4 h-4 sm:w-5 sm:h-5" />
          {saveMessage}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
        {moduleList.map((module) => {
          const IconComponent = getIconComponent(module.icon);
          const lessonsWithContent = module.lessons.filter(
            lesson => localContent[lesson]
          ).length;
          const completionPercent = Math.round(
            (lessonsWithContent / module.lessons.length) * 100
          );

          // Подсчитываем тесты модуля
          const moduleTestCount = moduleTests[module.id]?.length || 0;

          // Подсчитываем тесты из уроков
          const lessonTestCount = module.lessons.reduce((total, lesson) => {
            const lessonData = localContent[lesson];
            const lessonTests = lessonData?.test || [];
            return total + lessonTests.length;
          }, 0);

          // Общее количество тестов
          const totalTestCount = moduleTestCount + lessonTestCount;
          const hasTest = totalTestCount > 0;

          return (
            <div
              key={module.id}
              className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => setSelectedModule(module.id)}
            >
              <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="bg-blue-100 p-2 sm:p-3 rounded-xl flex-shrink-0">
                  <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 truncate">
                    {module.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{module.lessons.length} уроков</span>
                    </div>
                    {hasTest && (
                      <div className="flex items-center gap-1.5 text-green-600">
                        <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{totalTestCount} {totalTestCount === 1 ? 'вопрос' : totalTestCount < 5 ? 'вопроса' : 'вопросов'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Готовность контента</span>
                  <span className="font-semibold text-gray-900">
                    {lessonsWithContent}/{module.lessons.length}
                  </span>
                </div>
                <div className="bg-gray-200 rounded-full h-1.5 sm:h-2">
                  <div
                    className={`h-1.5 sm:h-2 rounded-full transition-all ${
                      completionPercent === 100
                        ? 'bg-green-600'
                        : completionPercent >= 50
                        ? 'bg-blue-600'
                        : 'bg-yellow-600'
                    }`}
                    style={{ width: `${completionPercent}%` }}
                  ></div>
                </div>
              </div>

              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 flex items-center justify-between">
                <button className="text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2">
                  <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                  Редактировать уроки
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteModule(module.id);
                  }}
                  className="text-red-600 hover:text-red-700 font-medium text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2"
                  title="Удалить модуль"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  Удалить
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Module Modal */}
      {showAddModuleModal && (
        <AddModuleModal
          onClose={() => setShowAddModuleModal(false)}
          onAddModule={handleAddModule}
        />
      )}
    </div>
  );
}

export default AdminContent;
