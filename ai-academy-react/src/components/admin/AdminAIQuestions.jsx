import { useState, useEffect } from 'react';
import { Brain, Plus, Edit, Trash2, Save, X, Eye, Check, Cloud, HardDrive } from 'lucide-react';
import apiClient from '../../utils/apiClient';

function AdminAIQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [useAPI, setUseAPI] = useState(false); // Переключатель API/LocalStorage

  // Новая форма вопроса
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: ['', '', '', '']
  });

  // Загружаем вопросы при монтировании
  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);

      if (useAPI) {
        // Загружаем из API
        try {
          const data = await apiClient.getAIQuestions();
          setQuestions(data);
          setSaveMessage('Загружено из Backend API');
          setTimeout(() => setSaveMessage(''), 2000);
        } catch (apiError) {
          console.error('API Error, falling back to localStorage:', apiError);
          setSaveMessage('⚠️ API недоступен, используется локальное хранилище');
          setTimeout(() => setSaveMessage(''), 3000);
          loadFromLocalStorage();
        }
      } else {
        // Загружаем из localStorage
        loadFromLocalStorage();
      }
    } catch (error) {
      console.error('Error loading questions:', error);
      loadFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem('aiAgentQuestions');
    if (saved) {
      setQuestions(JSON.parse(saved));
    } else {
      // Дефолтные вопросы
      const defaultQuestions = [
        {
          id: 1,
          question: "Какую область применения вы хотите для вашего AI агента?",
          options: [
            { id: 1, option_text: "Обслуживание клиентов", order: 0 },
            { id: 2, option_text: "Анализ данных", order: 1 },
            { id: 3, option_text: "Создание контента", order: 2 },
            { id: 4, option_text: "Автоматизация задач", order: 3 }
          ],
          order: 1
        }
      ];
      setQuestions(defaultQuestions);
      localStorage.setItem('aiAgentQuestions', JSON.stringify(defaultQuestions));
    }
  };

  const saveQuestions = (updatedQuestions) => {
    // Сохраняем в localStorage
    localStorage.setItem('aiAgentQuestions', JSON.stringify(updatedQuestions));
    setQuestions(updatedQuestions);

    // TODO: Отправка на backend
    // fetch('http://localhost:8000/api/ai-agent-questions/', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(updatedQuestions)
    // });
  };

  const handleAddQuestion = () => {
    if (!newQuestion.question.trim() || newQuestion.options.some(opt => !opt.trim())) {
      alert('Пожалуйста, заполните вопрос и все варианты ответов');
      return;
    }

    const question = {
      id: Date.now(),
      question: newQuestion.question,
      options: newQuestion.options.map((opt, index) => ({
        id: Date.now() + index,
        option_text: opt,
        order: index
      })),
      order: questions.length + 1
    };

    const updated = [...questions, question];
    saveQuestions(updated);

    setShowAddModal(false);
    setNewQuestion({ question: '', options: ['', '', '', ''] });
    setSaveMessage('Вопрос успешно добавлен!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion({
      ...question,
      question: question.question,
      options: question.options.map(opt => opt.option_text)
    });
  };

  const handleSaveEdit = () => {
    if (!editingQuestion.question.trim() || editingQuestion.options.some(opt => !opt.trim())) {
      alert('Пожалуйста, заполните вопрос и все варианты ответов');
      return;
    }

    const updated = questions.map(q =>
      q.id === editingQuestion.id
        ? {
            ...q,
            question: editingQuestion.question,
            options: editingQuestion.options.map((opt, index) => ({
              id: q.options[index]?.id || Date.now() + index,
              option_text: opt,
              order: index
            }))
          }
        : q
    );

    saveQuestions(updated);
    setEditingQuestion(null);
    setSaveMessage('Вопрос успешно обновлен!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleDeleteQuestion = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот вопрос?')) {
      const updated = questions.filter(q => q.id !== id);
      saveQuestions(updated);
      setSaveMessage('Вопрос удален!');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...(editingQuestion?.options || newQuestion.options)];
    newOptions[index] = value;

    if (editingQuestion) {
      setEditingQuestion({ ...editingQuestion, options: newOptions });
    } else {
      setNewQuestion({ ...newQuestion, options: newOptions });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Загрузка вопросов...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Brain className="w-7 h-7 text-blue-600" />
            Вопросы для AI Агента
          </h2>
          <p className="text-gray-600 mt-1">Управление вопросами для создания персонального AI агента</p>
        </div>
        <div className="flex items-center gap-3">
          {/* API/LocalStorage Toggle */}
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
            <HardDrive className="w-4 h-4 text-gray-600" />
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={useAPI}
                onChange={(e) => {
                  setUseAPI(e.target.checked);
                  // Перезагружаем вопросы из нового источника
                  setTimeout(() => loadQuestions(), 100);
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
            <Cloud className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              {useAPI ? 'Backend API' : 'LocalStorage'}
            </span>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Добавить вопрос
          </button>
        </div>
      </div>

      {saveMessage && (
        <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-3 rounded-lg border border-green-200">
          <Check className="w-5 h-5" />
          {saveMessage}
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        {questions.length === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
            <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Нет вопросов</h3>
            <p className="text-gray-600 mb-4">Добавьте первый вопрос для AI агента</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Добавить вопрос
            </button>
          </div>
        ) : (
          questions.map((q, index) => (
            <div key={q.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
              {editingQuestion?.id === q.id ? (
                // Edit Mode
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-gray-600">Редактирование вопроса #{index + 1}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveEdit}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        <Save className="w-4 h-4" />
                        Сохранить
                      </button>
                      <button
                        onClick={() => setEditingQuestion(null)}
                        className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                      >
                        <X className="w-4 h-4" />
                        Отмена
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Вопрос:</label>
                    <input
                      type="text"
                      value={editingQuestion.question}
                      onChange={(e) => setEditingQuestion({ ...editingQuestion, question: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Введите текст вопроса..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Варианты ответов:</label>
                    <div className="space-y-2">
                      {editingQuestion.options.map((option, optIndex) => (
                        <input
                          key={optIndex}
                          type="text"
                          value={option}
                          onChange={(e) => handleOptionChange(optIndex, e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          placeholder={`Вариант ${optIndex + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                // View Mode
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-blue-600">Вопрос #{index + 1}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">{q.question}</h3>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditQuestion(q)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Редактировать"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Удалить"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Варианты ответов:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((option, optIndex) => (
                        <div
                          key={option.id}
                          className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700"
                        >
                          <span className="font-semibold text-gray-500">{optIndex + 1}.</span>
                          <span>{option.option_text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Question Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Добавить новый вопрос</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewQuestion({ question: '', options: ['', '', '', ''] });
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Вопрос:</label>
                <input
                  type="text"
                  value={newQuestion.question}
                  onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Введите текст вопроса..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Варианты ответов (4 варианта):</label>
                <div className="space-y-2">
                  {newQuestion.options.map((option, optIndex) => (
                    <input
                      key={optIndex}
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(optIndex, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder={`Вариант ${optIndex + 1}`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddQuestion}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Save className="w-5 h-5" />
                  Сохранить вопрос
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewQuestion({ question: '', options: ['', '', '', ''] });
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminAIQuestions;
