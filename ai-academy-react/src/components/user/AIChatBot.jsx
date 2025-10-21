import { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Sparkles, CheckCircle } from 'lucide-react';
import { aiAgentQuestions as defaultQuestions } from '../../data/aiAgentQuestions';
import openAIService from '../../services/openai';

function AIChatBot({ onAgentCreated, onClose, autoOpen = true }) {
  const [isOpen, setIsOpen] = useState(autoOpen); // Можно автоматически открыть
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isChatMode, setIsChatMode] = useState(false); // Режим обычного чата после создания агента
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [aiAgentQuestions, setAiAgentQuestions] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Загружаем вопросы из localStorage (синхронизация с админкой)
  useEffect(() => {
    const loadQuestions = () => {
      try {
        const saved = localStorage.getItem('aiAgentQuestions');
        if (saved) {
          const savedQuestions = JSON.parse(saved);
          // Преобразуем формат из админки в формат для чатбота
          const formatted = savedQuestions.map(q => ({
            id: q.id,
            question: q.question,
            options: q.options.map(opt => opt.option_text)
          }));
          setAiAgentQuestions(formatted);
        } else {
          // Используем дефолтные вопросы
          setAiAgentQuestions(defaultQuestions);
        }
      } catch (error) {
        console.error('Error loading AI questions:', error);
        setAiAgentQuestions(defaultQuestions);
      }
    };

    loadQuestions();

    // Обновляем при изменениях в localStorage (когда админ редактирует)
    const handleStorageChange = (e) => {
      if (e.key === 'aiAgentQuestions') {
        loadQuestions();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0 && aiAgentQuestions.length > 0) {
      // Приветственное сообщение
      setTimeout(() => {
        setMessages([
          {
            type: 'bot',
            text: 'Привет! Я AI ассистент. Давайте создадим персонального AI агента для вас!',
          },
          {
            type: 'bot',
            text: `Я задам вам ${aiAgentQuestions.length} ${
              aiAgentQuestions.length === 1
                ? 'вопрос'
                : aiAgentQuestions.length < 5
                ? 'вопроса'
                : 'вопросов'
            }, чтобы понять ваши потребности. Готовы начать?`,
          },
        ]);
      }, 500);
    }
  }, [isOpen]);

  const handleStartQuestions = () => {
    setMessages((prev) => [
      ...prev,
      {
        type: 'user',
        text: 'Да, давайте начнем!',
      },
    ]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          text: aiAgentQuestions[0].question,
          options: aiAgentQuestions[0].options,
          questionId: aiAgentQuestions[0].id,
        },
      ]);
    }, 800);
  };

  const handleAnswer = (answer, questionId) => {
    // Добавляем ответ пользователя
    setMessages((prev) => [
      ...prev,
      {
        type: 'user',
        text: answer,
      },
    ]);

    // Сохраняем ответ
    const newAnswers = [...answers, { questionId, answer }];
    setAnswers(newAnswers);

    // Проверяем, есть ли еще вопросы
    if (currentQuestion < aiAgentQuestions.length - 1) {
      const nextQuestion = currentQuestion + 1;
      setCurrentQuestion(nextQuestion);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            type: 'bot',
            text: aiAgentQuestions[nextQuestion].question,
            options: aiAgentQuestions[nextQuestion].options,
            questionId: aiAgentQuestions[nextQuestion].id,
          },
        ]);
      }, 1000);
    } else {
      // Все вопросы завершены
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            type: 'bot',
            text: 'Отлично! Я получил все ответы. Сейчас создам для вас персонального AI агента...',
          },
        ]);
      }, 800);

      // Анимация создания
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            type: 'bot',
            text: '🤖 Анализирую ваши ответы...',
          },
        ]);
      }, 2000);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            type: 'bot',
            text: '⚙️ Настраиваю параметры агента...',
          },
        ]);
      }, 3500);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            type: 'bot',
            text: '✨ Инициализирую нейронную сеть...',
          },
        ]);
      }, 5000);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            type: 'success',
            text: '🎉 AI Агент успешно создан!',
            agentData: {
              area: newAnswers[0]?.answer,
              model: newAnswers[3]?.answer,
              personalization: newAnswers[6]?.answer,
            },
          },
        ]);
        setIsCompleted(true);

        // Инициализируем OpenAI сервис с ответами пользователя
        openAIService.initializeAgent(newAnswers);

        // Вызываем callback для создания агента
        if (onAgentCreated) {
          onAgentCreated(newAnswers);
        }

        // Через 2 секунды после успеха переходим в режим чата
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              type: 'bot',
              text: 'Привет! Теперь я ваш персональный AI ассистент на базе GPT-4 Mini. Чем могу помочь?',
            },
          ]);
          setIsChatMode(true);
        }, 2000);
      }, 6500);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = inputText;

    // Добавляем сообщение пользователя
    setMessages((prev) => [
      ...prev,
      {
        type: 'user',
        text: userMessage,
      },
    ]);

    setInputText('');
    setIsTyping(true);

    try {
      // Получаем реальный ответ от OpenAI
      const response = await openAIService.sendMessage(userMessage);

      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          text: response,
        },
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          text: 'Извините, произошла ошибка при обработке вашего сообщения. Пожалуйста, попробуйте снова.',
        },
      ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClose = () => {
    setIsOpen(false); // Просто закрываем окно, кнопка остается
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all z-50 ai-chat-button"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-75 blur-xl animate-pulse-glow"></div>
          <div className="relative z-10">
            <div className="relative">
              <Bot className="w-10 h-10 text-white animate-float" />
              <span className="absolute -top-2 -right-2 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white"></span>
              </span>
            </div>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[95vw] sm:w-[85vw] md:w-[70vw] lg:w-[55vw] xl:w-[45vw] max-w-5xl h-[90vh] sm:h-[85vh] bg-white rounded-xl sm:rounded-2xl shadow-2xl flex flex-col z-50 animate-slideUp border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 sm:p-5 rounded-t-xl sm:rounded-t-2xl flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative">
                <div className="w-11 h-11 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                  <Bot className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white shadow-sm animate-pulse"></span>
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg">AI Ассистент</h3>
                <p className="text-xs sm:text-sm opacity-90 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Онлайн
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-all hover:scale-110"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4 bg-gradient-to-b from-gray-50 to-gray-100">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-messageSlide`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {message.type === 'success' ? (
                  // Success message with agent data
                  <div className="w-full bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 border-2 border-green-300 rounded-2xl p-5 sm:p-6 animate-successPop shadow-lg">
                    <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-green-400 via-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-spin-slow shadow-lg">
                        <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-white animate-sparkle" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900">{message.text}</h3>
                        <p className="text-sm sm:text-base text-gray-600">Ваш персональный AI агент готов</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 sm:p-5 border border-green-200 shadow-sm animate-slideInUp" style={{ animationDelay: '0.3s' }}>
                      <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 animate-checkPulse" />
                        Параметры вашего агента:
                      </h4>
                      <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
                        <li className="flex items-start gap-2 animate-slideInRight" style={{ animationDelay: '0.5s' }}>
                          <span className="text-green-600 font-bold text-lg">•</span>
                          <span><strong>Область применения:</strong> {message.agentData?.area}</span>
                        </li>
                        <li className="flex items-start gap-2 animate-slideInRight" style={{ animationDelay: '0.6s' }}>
                          <span className="text-green-600 font-bold text-lg">•</span>
                          <span><strong>Языковая модель:</strong> {message.agentData?.model}</span>
                        </li>
                        <li className="flex items-start gap-2 animate-slideInRight" style={{ animationDelay: '0.7s' }}>
                          <span className="text-green-600 font-bold text-lg">•</span>
                          <span><strong>Персонализация:</strong> {message.agentData?.personalization}</span>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 sm:p-4 border border-blue-200 animate-slideInUp shadow-sm" style={{ animationDelay: '0.9s' }}>
                      <p className="text-xs sm:text-sm text-blue-900 flex items-center gap-2 font-medium">
                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 animate-twinkle" />
                        Агент готов помогать вам на основе ваших предпочтений
                      </p>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 shadow-sm ${
                      message.type === 'user'
                        ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white animate-messagePop'
                        : 'bg-white text-gray-900 border border-gray-200 animate-messageSlideIn'
                    }`}
                  >
                    <p className="text-sm sm:text-base leading-relaxed">{message.text}</p>

                    {/* Options */}
                    {message.options && (
                      <div className="mt-3 sm:mt-4 space-y-2">
                        {message.options.map((option, optIndex) => (
                          <button
                            key={optIndex}
                            onClick={() => handleAnswer(option, message.questionId)}
                            className="w-full text-left px-3 py-2.5 sm:px-4 sm:py-3 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 rounded-xl text-sm sm:text-base text-blue-900 font-medium transition-all hover:scale-[1.02] hover:shadow-lg animate-optionFade"
                            style={{ animationDelay: `${optIndex * 0.1}s` }}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Start Button */}
            {messages.length === 2 && (
              <div className="flex justify-center my-2">
                <button
                  onClick={handleStartQuestions}
                  className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-semibold transition-all flex items-center gap-2 sm:gap-3 shadow-lg hover:shadow-xl hover:scale-105 text-sm sm:text-base"
                >
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 animate-sparkle" />
                  Начать создание агента
                </button>
              </div>
            )}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start animate-messageSlideIn">
                <div className="bg-white text-gray-900 border border-gray-200 rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 max-w-[85%] sm:max-w-[80%] shadow-sm">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-blue-500 rounded-full animate-typing-dot" style={{ animationDelay: '0s' }}></div>
                      <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-blue-500 rounded-full animate-typing-dot" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-blue-500 rounded-full animate-typing-dot" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <span className="text-xs sm:text-sm text-gray-600 font-medium">AI печатает...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer */}
          <div className="p-4 sm:p-5 border-t border-gray-200 bg-white rounded-b-xl sm:rounded-b-2xl flex-shrink-0">
            {isChatMode ? (
              <div className="flex items-center gap-2 sm:gap-3 animate-slideInUp">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Напишите сообщение..."
                  className="flex-1 px-4 py-3 sm:px-5 sm:py-3.5 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base placeholder-gray-400 bg-gray-50 focus:bg-white"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim()}
                  className={`p-3 sm:p-3.5 rounded-xl transition-all flex-shrink-0 ${
                    inputText.trim()
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                <span className="font-medium">Создание персонального AI агента</span>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulseGlow {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        @keyframes messageSlide {
          from {
            transform: translateX(-20px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes messagePop {
          0% {
            transform: scale(0.8) translateX(20px);
            opacity: 0;
          }
          60% {
            transform: scale(1.05) translateX(0);
          }
          100% {
            transform: scale(1) translateX(0);
            opacity: 1;
          }
        }

        @keyframes messageSlideIn {
          from {
            transform: translateX(-30px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes successPop {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes slideInUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideInRight {
          from {
            transform: translateX(-20px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes checkPulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
        }

        @keyframes sparkle {
          0%, 100% {
            transform: rotate(0deg) scale(1);
            opacity: 1;
          }
          25% {
            transform: rotate(90deg) scale(1.2);
            opacity: 0.8;
          }
          50% {
            transform: rotate(180deg) scale(1);
            opacity: 1;
          }
          75% {
            transform: rotate(270deg) scale(1.2);
            opacity: 0.8;
          }
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(0.8);
          }
        }

        @keyframes optionFade {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spinSlow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes typingDot {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          30% {
            transform: translateY(-8px);
            opacity: 1;
          }
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-pulse-glow {
          animation: pulseGlow 2s ease-in-out infinite;
        }

        .animate-messageSlide {
          animation: messageSlide 0.4s ease-out forwards;
          opacity: 0;
        }

        .animate-messagePop {
          animation: messagePop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        .animate-messageSlideIn {
          animation: messageSlideIn 0.5s ease-out forwards;
        }

        .animate-successPop {
          animation: successPop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        .animate-slideInUp {
          animation: slideInUp 0.5s ease-out forwards;
          opacity: 0;
        }

        .animate-slideInRight {
          animation: slideInRight 0.5s ease-out forwards;
          opacity: 0;
        }

        .animate-checkPulse {
          animation: checkPulse 1.5s ease-in-out infinite;
        }

        .animate-sparkle {
          animation: sparkle 3s ease-in-out infinite;
        }

        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }

        .animate-optionFade {
          animation: optionFade 0.4s ease-out forwards;
          opacity: 0;
        }

        .animate-spin-slow {
          animation: spinSlow 8s linear infinite;
        }

        .animate-typing-dot {
          animation: typingDot 1.4s ease-in-out infinite;
        }

        .ai-chat-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          background-size: 200% 200%;
          animation: shimmer 3s ease-in-out infinite;
        }

        .ai-chat-button:hover {
          box-shadow: 0 0 30px rgba(102, 126, 234, 0.6), 0 0 60px rgba(118, 75, 162, 0.4);
        }
      `}</style>
    </>
  );
}

export default AIChatBot;
