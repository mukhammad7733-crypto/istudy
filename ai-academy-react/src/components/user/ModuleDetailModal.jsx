import { useEffect } from 'react';
import { X, CheckCircle, Circle, Play, BookOpen } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

function ModuleDetailModal({ module, progress, onClose, onStartModule }) {
  if (!module) return null;

  const progressPercent = progress.total
    ? Math.round((progress.completed / progress.total) * 100)
    : 0;
  const isCompleted = progress.completed === progress.total;
  const isStarted = progress.started;

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

  // Get icon component
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

  const IconComponent = getIconComponent(module.icon);

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
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 sm:p-6 flex-shrink-0 rounded-t-2xl">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 rounded-xl bg-white/20">
                <IconComponent className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">{module.title}</h2>
                <p className="text-sm sm:text-base opacity-90">{module.lessons.length} уроков</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="bg-white/10 rounded-xl p-3 sm:p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm sm:text-base">Прогресс</span>
              <span className="text-2xl sm:text-3xl font-bold">{progressPercent}%</span>
            </div>
            <div className="bg-white/20 rounded-full h-2 sm:h-3">
              <div
                className="bg-white h-2 sm:h-3 rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <div className="mt-2 text-xs sm:text-sm opacity-90">
              {progress.completed} из {progress.total} уроков завершено
            </div>
          </div>
        </div>

        {/* Content - Lessons List */}
        <div className="p-4 sm:p-6 pb-6 sm:pb-8 space-y-3 overflow-y-auto flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Уроки модуля</h3>
          {module.lessons.map((lesson, index) => {
            const isLessonCompleted = index < progress.completed;
            const isCurrentLesson = index === progress.completed && !isCompleted;

            return (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 sm:p-4 rounded-lg border transition-colors ${
                  isLessonCompleted
                    ? 'bg-green-50 border-green-200'
                    : isCurrentLesson
                    ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex-shrink-0">
                  {isLessonCompleted ? (
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  ) : isCurrentLesson ? (
                    <Play className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  ) : (
                    <Circle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-medium text-gray-500">
                      Урок {index + 1}
                    </span>
                    {isCurrentLesson && (
                      <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                        Текущий
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-sm sm:text-base font-medium truncate ${
                      isLessonCompleted ? 'text-green-900' : isCurrentLesson ? 'text-blue-900' : 'text-gray-900'
                    }`}
                  >
                    {lesson}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0 rounded-b-2xl">
          <button
            onClick={() => {
              onStartModule(module.id, isCompleted);
              onClose();
            }}
            className={`w-full py-2.5 sm:py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
              isCompleted
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : isStarted
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-900 hover:bg-gray-800 text-white'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            {isCompleted ? 'Начать заново' : isStarted ? 'Продолжить обучение' : 'Начать модуль'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModuleDetailModal;
