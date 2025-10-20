import { useEffect } from 'react';
import { X, Award, Calendar, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { modulesData } from '../../data/mockData';

function TestResultModal({ result, onClose }) {
  if (!result) return null;

  const module = modulesData.find(m => m.id === result.moduleId);
  const passed = result.score >= 70;

  // Close modal on ESC key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return 'Отлично';
    if (score >= 70) return 'Хорошо';
    return 'Требуется повторение';
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-4 sm:p-6 flex-shrink-0 ${passed ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-yellow-500 to-yellow-600'} text-white rounded-t-2xl`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 sm:p-3 rounded-xl ${passed ? 'bg-white/20' : 'bg-white/20'}`}>
                <Award className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">Результаты теста</h2>
                <p className="text-sm sm:text-base opacity-90">{module?.title} • {result.lessonTitle}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Score Display */}
          <div className="text-center bg-white/10 rounded-xl p-4 sm:p-6 backdrop-blur-sm">
            <div className="text-5xl sm:text-6xl font-bold mb-2">{result.score}%</div>
            <div className="text-sm sm:text-base opacity-90">{getScoreLabel(result.score)}</div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 pb-6 sm:pb-8 space-y-4 sm:space-y-6 overflow-y-auto flex-1">
          {/* Details Grid */}
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-sm text-gray-600">Дата прохождения</div>
              </div>
              <div className="text-lg font-semibold text-gray-900 ml-11">{result.date}</div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-sm text-gray-600">Время</div>
              </div>
              <div className="text-lg font-semibold text-gray-900 ml-11">{result.time}</div>
            </div>
          </div>

          {/* Module Info */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-5 border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-2">Информация о тесте</h3>
                <div className="space-y-1 text-sm text-gray-700">
                  <p><span className="font-medium">Модуль:</span> {module?.title}</p>
                  <p><span className="font-medium">Урок:</span> {result.lessonTitle}</p>
                  <p><span className="font-medium">Номер урока:</span> {result.lessonIndex + 1} из {module?.lessons.length}</p>
                  <p><span className="font-medium">Статус:</span> {passed ? 'Сдан' : 'Не сдан'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Оценка результата</h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Правильных ответов</span>
                <span className="text-sm font-semibold text-gray-900">{Math.round(result.score / 10)} из 10</span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    result.score >= 90 ? 'bg-green-500' : result.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${result.score}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-start gap-2">
                {passed ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-700">Тест успешно сдан!</p>
                      <p className="text-xs text-gray-600 mt-1">
                        Вы набрали {result.score}% и можете переходить к следующему модулю.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-700">Тест не сдан</p>
                      <p className="text-xs text-gray-600 mt-1">
                        Для успешного прохождения требуется минимум 70%. Рекомендуем повторить материал.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Performance Rating */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 sm:p-5 border border-purple-200">
            <h3 className="font-semibold text-gray-900 mb-3">Уровень знаний</h3>
            <div className="flex items-center gap-3">
              <div className={`flex-1 px-4 py-3 rounded-lg font-medium text-center ${getScoreColor(result.score)}`}>
                {getScoreLabel(result.score)}
              </div>
              <div className="text-3xl font-bold text-gray-900">{result.score}%</div>
            </div>
          </div>

          {/* Recommendations */}
          {!passed && (
            <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
              <h3 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                <span>💡</span> Рекомендации
              </h3>
              <ul className="space-y-1 text-sm text-yellow-800">
                <li>• Повторите материалы урока "{result.lessonTitle}"</li>
                <li>• Обратите внимание на видео-уроки</li>
                <li>• Попробуйте пройти тест еще раз</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TestResultModal;
