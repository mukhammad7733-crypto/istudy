import { useState, useEffect } from 'react';
import { BookOpen, LogOut } from 'lucide-react';
import ModuleCatalog from './user/ModuleCatalog';
import LessonViewer from './user/LessonViewer';
import TestViewer from './user/TestViewer';
import UserProgress from './user/UserProgress';
import AIChatBot from './user/AIChatBot';
import { modulesData as defaultModulesData } from '../data/mockData';

function UserDashboard({ userName, userEmail, onLogout, users, setUsers }) {
  // Загружаем список модулей из localStorage или используем дефолтный
  const [modulesData, setModulesData] = useState(() => {
    const saved = localStorage.getItem('adminModuleList');
    return saved ? JSON.parse(saved) : [...defaultModulesData];
  });

  // Загружаем тесты модулей из localStorage
  const [moduleTests, setModuleTests] = useState(() => {
    const saved = localStorage.getItem('adminModuleTests');
    return saved ? JSON.parse(saved) : {};
  });

  // Получаем начальные данные пользователя
  const getInitialUser = () => {
    // Сначала проверяем массив users (приоритет - данные из админки)
    const userFromList = users.find(u => u.email.toLowerCase() === userEmail.toLowerCase());
    if (userFromList) {
      return userFromList;
    }

    // Затем проверяем localStorage
    const savedUser = localStorage.getItem(`user_${userName}`);
    if (savedUser) {
      return JSON.parse(savedUser);
    }

    // Если не найден, создаем нового с динамическим прогрессом
    const progress = {};
    modulesData.forEach(module => {
      progress[module.id] = {
        started: false,
        viewed: 0,
        completed: 0,
        total: module.lessons.length
      };
    });

    return {
      id: Date.now(),
      name: userName,
      email: userEmail,
      progress: progress,
      testResults: [],
      timeSpent: 0,
      lastActivity: new Date().toISOString().split('T')[0],
      department: 'Общий'
    };
  };

  const [currentUser, setCurrentUser] = useState(getInitialUser);
  const [currentView, setCurrentView] = useState('catalog'); // 'catalog' | 'lesson' | 'test' | 'tests' | 'progress'
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedTestLesson, setSelectedTestLesson] = useState(null);
  const [showAIChat, setShowAIChat] = useState(() => {
    return localStorage.getItem(`showAIChat_${userName}`) === 'true';
  });
  const [aiAgentData, setAiAgentData] = useState(() => {
    const saved = localStorage.getItem(`aiAgentData_${userName}`);
    return saved ? JSON.parse(saved) : null;
  });

  // Сохраняем данные пользователя в localStorage и обновляем массив users при изменении
  useEffect(() => {
    localStorage.setItem(`user_${userName}`, JSON.stringify(currentUser));

    // Синхронизируем с массивом users в App.jsx
    setUsers(prevUsers => {
      const existingUserIndex = prevUsers.findIndex(u => u.email.toLowerCase() === userEmail.toLowerCase());

      if (existingUserIndex !== -1) {
        // Обновляем существующего пользователя
        const updatedUsers = [...prevUsers];
        updatedUsers[existingUserIndex] = currentUser;
        return updatedUsers;
      } else {
        // Добавляем нового пользователя (если его нет в списке)
        return [...prevUsers, currentUser];
      }
    });
  }, [currentUser, userName, userEmail, setUsers]);

  // Обновляем currentUser если данные изменились в массиве users (например, админ обновил)
  useEffect(() => {
    const userFromList = users.find(u => u.email.toLowerCase() === userEmail.toLowerCase());
    if (userFromList && JSON.stringify(userFromList) !== JSON.stringify(currentUser)) {
      // Проверяем, что изменения пришли извне (не от самого пользователя)
      const hasExternalChanges = userFromList.lastActivity !== currentUser.lastActivity ||
                                  userFromList.department !== currentUser.department;
      if (hasExternalChanges) {
        setCurrentUser(userFromList);
      }
    }
  }, [users, userEmail]);

  // Сохраняем состояние чата в localStorage
  useEffect(() => {
    localStorage.setItem(`showAIChat_${userName}`, showAIChat.toString());
  }, [showAIChat, userName]);

  // Сохраняем данные AI агента в localStorage
  useEffect(() => {
    if (aiAgentData) {
      localStorage.setItem(`aiAgentData_${userName}`, JSON.stringify(aiAgentData));
    }
  }, [aiAgentData, userName]);

  // Проверяем, завершены ли все модули
  useEffect(() => {
    const allModulesCompleted = Object.values(currentUser.progress).every(
      (moduleProgress) => moduleProgress.completed === moduleProgress.total
    );

    // Показываем чат только если все модули завершены (независимо от того, создан ли агент)
    if (allModulesCompleted && !showAIChat) {
      setShowAIChat(true);
    }
  }, [currentUser.progress]);

  const handleStartModule = (moduleId, restart = false) => {
    const moduleProgress = currentUser.progress[moduleId];

    // Если restart или не начат - начинаем с первого урока
    // Если продолжаем - начинаем с урока, равного completed (следующий урок после пройденных тестов)
    const startLesson = restart || !moduleProgress.started ? 0 : moduleProgress.completed;

    setSelectedModule(moduleId);
    setSelectedLesson(startLesson);
    setCurrentView('lesson');

    // Обновим прогресс - начали модуль
    setCurrentUser(prev => ({
      ...prev,
      progress: {
        ...prev.progress,
        [moduleId]: {
          ...prev.progress[moduleId],
          started: true,
          // Если restart - сбрасываем прогресс
          viewed: restart ? 0 : prev.progress[moduleId].viewed,
          completed: restart ? 0 : prev.progress[moduleId].completed
        }
      }
    }));
  };

  const handleCompleteLesson = () => {
    // Увеличим viewed для текущего модуля
    setCurrentUser(prev => {
      const moduleProgress = prev.progress[selectedModule];
      return {
        ...prev,
        progress: {
          ...prev.progress,
          [selectedModule]: {
            ...moduleProgress,
            viewed: Math.min(moduleProgress.viewed + 1, moduleProgress.total)
          }
        }
      };
    });
  };

  const handleNextLesson = () => {
    // Переходим к следующему уроку
    setSelectedLesson(prev => prev + 1);
  };

  const handleStartTest = (lessonIndex = null) => {
    if (lessonIndex !== null) {
      setSelectedTestLesson(lessonIndex);
    }
    setCurrentView('test');
  };

  const handleCompleteTest = (score) => {
    const module = modulesData.find(m => m.id === selectedModule);

    // Создаем результат теста для модуля
    const newTestResult = {
      moduleId: selectedModule,
      lessonIndex: 0, // Тест на весь модуль
      lessonTitle: module.title,
      score: score,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].substring(0, 5)
    };

    // Отмечаем весь модуль как пройденный
    setCurrentUser(prev => {
      const moduleProgress = prev.progress[selectedModule];

      // Фильтруем старые результаты для этого модуля и добавляем только новый
      const filteredResults = prev.testResults.filter(t => t.moduleId !== selectedModule);

      return {
        ...prev,
        testResults: [...filteredResults, newTestResult],
        progress: {
          ...prev.progress,
          [selectedModule]: {
            ...moduleProgress,
            completed: moduleProgress.total // Все уроки пройдены
          }
        }
      };
    });

    // Возвращаемся в каталог
    setCurrentView('catalog');
    setSelectedModule(null);
    setSelectedLesson(null);
    setSelectedTestLesson(null);
  };

  const handleBackToCatalog = () => {
    setCurrentView('catalog');
    setSelectedModule(null);
    setSelectedLesson(null);
  };

  const handleAgentCreated = (answers) => {
    setAiAgentData({
      answers,
      createdAt: new Date().toISOString(),
    });
    // НЕ закрываем чат автоматически - пользователь сам решит когда его закрыть
  };

  const handleCloseAIChat = () => {
    setShowAIChat(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-xl font-bold text-gray-900 truncate">iStudy</h1>
                <p className="text-xs text-gray-500 truncate">{currentUser.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              <button
                onClick={() => setCurrentView('progress')}
                className={`text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                  currentView === 'progress'
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="hidden sm:inline">Мой прогресс</span>
                <span className="sm:hidden">Прогресс</span>
              </button>
              <button
                onClick={() => setCurrentView('catalog')}
                className={`text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                  currentView === 'catalog'
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Курсы
              </button>
              <button
                onClick={onLogout}
                className="p-1.5 sm:p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Выйти"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
        {currentView === 'catalog' && (
          <ModuleCatalog
            modulesData={modulesData}
            userProgress={currentUser.progress}
            onStartModule={handleStartModule}
          />
        )}

        {currentView === 'lesson' && selectedModule && (
          <LessonViewer
            modulesData={modulesData}
            moduleId={selectedModule}
            lessonIndex={selectedLesson}
            onCompleteLesson={handleCompleteLesson}
            onStartTest={handleStartTest}
            onBack={handleBackToCatalog}
            onNextLesson={handleNextLesson}
            userProgress={currentUser.progress[selectedModule]}
            moduleTests={moduleTests}
          />
        )}

        {currentView === 'test' && selectedModule && (
          <TestViewer
            modulesData={modulesData}
            moduleId={selectedModule}
            lessonIndex={selectedTestLesson !== null ? selectedTestLesson : selectedLesson}
            lessonTitle={modulesData.find(m => m.id === selectedModule).title}
            onCompleteTest={handleCompleteTest}
            onBack={handleBackToCatalog}
            moduleTests={moduleTests}
          />
        )}

        {currentView === 'progress' && (
          <UserProgress
            modulesData={modulesData}
            user={currentUser}
            onBackToCatalog={() => setCurrentView('catalog')}
            onStartModule={handleStartModule}
          />
        )}
      </main>

      {/* AI ChatBot - показывается только когда все модули завершены */}
      {showAIChat && (
        <AIChatBot
          onAgentCreated={handleAgentCreated}
          onClose={handleCloseAIChat}
        />
      )}
    </div>
  );
}

export default UserDashboard;
