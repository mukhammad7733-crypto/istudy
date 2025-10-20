import { useState } from 'react';
import { ChevronLeft, CheckCircle, XCircle, Award } from 'lucide-react';
import { modulesData } from '../../data/mockData';
import { getQuestionsForLesson } from '../../data/testQuestions';

function TestViewer({ modulesData: customModulesData, moduleId, lessonIndex, lessonTitle, onCompleteTest, onBack, moduleTests }) {
  const module = (customModulesData || modulesData).find((m) => m.id === moduleId);

  // Получаем вопросы для модуля из moduleTests или fallback на старую систему
  const questions = moduleTests && moduleTests[moduleId] && moduleTests[moduleId].length > 0
    ? moduleTests[moduleId]
    : getQuestionsForLesson(moduleId, lessonIndex);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleSelectAnswer = (answerIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: answerIndex,
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, index) => {
      const correctAnswer = q.correctAnswer !== undefined ? q.correctAnswer : q.correct;
      if (selectedAnswers[index] === correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  const handleFinish = () => {
    const score = calculateScore();
    onCompleteTest(score);
  };

  if (showResults) {
    const score = calculateScore();
    const passed = score >= 70;

    return (
      <div className="space-y-4 sm:space-y-6">
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 transition-colors text-sm sm:text-base"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Назад к курсам</span>
          <span className="sm:hidden">Назад</span>
        </button>

        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 lg:p-8 text-center">
          <div
            className={`inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full mb-4 sm:mb-6 ${
              passed ? 'bg-green-100' : 'bg-yellow-100'
            }`}
          >
            {passed ? (
              <Award className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
            ) : (
              <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-600" />
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 px-4">
            {passed ? 'Поздравляем!' : 'Тест завершен'}
          </h2>

          <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-blue-600 my-4 sm:my-6">{score}%</div>

          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto px-4">
            {passed
              ? `Вы успешно прошли итоговый тест модуля "${lessonTitle}"! Поздравляем с завершением модуля!`
              : `Рекомендуем повторить материалы модуля "${lessonTitle}" для лучшего усвоения.`}
          </p>

          <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 max-h-[400px] overflow-y-auto px-2">
            {questions.map((q, index) => {
              const correctAnswer = q.correctAnswer !== undefined ? q.correctAnswer : q.correct;
              const isCorrect = selectedAnswers[index] === correctAnswer;
              return (
                <div
                  key={index}
                  className={`p-3 sm:p-4 rounded-lg border ${
                    isCorrect
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    {isCorrect ? (
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mt-0.5 sm:mt-1 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mt-0.5 sm:mt-1 flex-shrink-0" />
                    )}
                    <div className="text-left flex-1 min-w-0">
                      <p className="text-sm sm:text-base font-medium text-gray-900 mb-1">{q.question}</p>
                      {!isCorrect && (
                        <p className="text-xs sm:text-sm text-gray-600">
                          Правильный ответ: {q.options[correctAnswer]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleFinish}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold transition-colors"
          >
            Вернуться к курсам
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const isAnswered = selectedAnswers[currentQuestion] !== undefined;

  return (
    <div className="space-y-4 sm:space-y-6">
      <button
        onClick={onBack}
        className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 transition-colors text-sm sm:text-base"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="hidden sm:inline">Назад к курсам</span>
        <span className="sm:hidden">Назад</span>
      </button>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 sm:p-6">
          <div className="text-xs sm:text-sm opacity-90 mb-1 sm:mb-2">
            Итоговый тест модуля • {lessonTitle}
          </div>
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">
            Вопрос {currentQuestion + 1} из {questions.length}
          </h1>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Прогресс-бар */}
          <div className="flex gap-1 sm:gap-2 mb-4 sm:mb-6 lg:mb-8">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-1.5 sm:h-2 rounded-full transition-all ${
                  selectedAnswers[index] !== undefined
                    ? 'bg-purple-600'
                    : index === currentQuestion
                    ? 'bg-purple-300'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
            {question.question}
          </h2>

          <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                className={`w-full text-left p-3 sm:p-4 rounded-lg border-2 transition-all ${
                  selectedAnswers[currentQuestion] === index
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div
                    className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      selectedAnswers[currentQuestion] === index
                        ? 'border-purple-600 bg-purple-600'
                        : 'border-gray-300'
                    }`}
                  >
                    {selectedAnswers[currentQuestion] === index && (
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="text-sm sm:text-base text-gray-900">{option}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center pt-4 sm:pt-6 border-t gap-3">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base py-2 sm:py-0"
            >
              Назад
            </button>

            <button
              onClick={handleNext}
              disabled={!isAnswered}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {currentQuestion === questions.length - 1
                ? 'Завершить тест'
                : 'Следующий вопрос'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestViewer;
