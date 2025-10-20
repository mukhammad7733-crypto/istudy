import { ChevronLeft, CheckCircle, Clock, Award } from 'lucide-react';
import { modulesData } from '../../data/mockData';

function TestsSelectionScreen({ moduleId, moduleProgress, testResults, onStartTest, onBack }) {
  const module = modulesData.find((m) => m.id === moduleId);

  // Получаем результаты тестов для каждого урока
  const getLessonTestResult = (lessonIndex) => {
    return testResults.find((r) => r.lessonIndex === lessonIndex);
  };

  const completedTests = moduleProgress.completed;
  const totalTests = moduleProgress.total;

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
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">{module.title}</h1>
          <p className="text-sm sm:text-base opacity-90">
            Выберите урок для прохождения теста
          </p>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Прогресс тестов */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 sm:p-5 mb-4 sm:mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                <span className="text-sm sm:text-base font-semibold text-gray-900">
                  Прогресс по тестам
                </span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-purple-600">
                {completedTests} / {totalTests}
              </span>
            </div>
            <div className="w-full bg-white rounded-full h-2.5 sm:h-3">
              <div
                className="bg-gradient-to-r from-purple-600 to-pink-600 h-2.5 sm:h-3 rounded-full transition-all"
                style={{ width: `${(completedTests / totalTests) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Список уроков с тестами */}
          <div className="space-y-3 sm:space-y-4">
            {module.lessons.map((lesson, index) => {
              const testResult = getLessonTestResult(index);
              const isPassed = testResult && testResult.score >= 70;
              const isFailed = testResult && testResult.score < 70;

              return (
                <div
                  key={index}
                  className={`border-2 rounded-lg transition-all ${
                    isPassed
                      ? 'border-green-200 bg-green-50'
                      : isFailed
                      ? 'border-yellow-200 bg-yellow-50'
                      : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                  }`}
                >
                  <div className="p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs sm:text-sm font-medium text-gray-500">
                            Урок {index + 1}
                          </span>
                          {testResult && (
                            <span
                              className={`text-xs font-semibold px-2 py-0.5 rounded ${
                                isPassed
                                  ? 'bg-green-200 text-green-800'
                                  : 'bg-yellow-200 text-yellow-800'
                              }`}
                            >
                              {testResult.score}%
                            </span>
                          )}
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                          {lesson}
                        </h3>
                        {testResult && (
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>
                              {testResult.date} в {testResult.time}
                            </span>
                          </div>
                        )}
                      </div>

                      {isPassed && (
                        <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-green-600 flex-shrink-0" />
                      )}
                    </div>

                    <button
                      onClick={() => onStartTest(index)}
                      className={`w-full py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-colors ${
                        testResult
                          ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          : 'bg-purple-600 hover:bg-purple-700 text-white'
                      }`}
                    >
                      {testResult ? 'Пройти тест повторно' : 'Пройти тест'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Подсказка */}
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs sm:text-sm text-blue-800">
              <span className="font-semibold">Совет:</span> Для успешного прохождения теста необходимо
              набрать минимум 70%. Вы можете пройти тест повторно в любое время.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestsSelectionScreen;
