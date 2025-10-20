import { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, Play, Award } from 'lucide-react';
import { lessonContent } from '../../data/lessonContent';
import { lessonVideos, getVideoEmbedUrl } from '../../data/lessonVideos';

function LessonViewer({
  modulesData,
  moduleId,
  lessonIndex,
  onCompleteLesson,
  onStartTest,
  onBack,
  onNextLesson,
  userProgress,
}) {
  const module = modulesData.find((m) => m.id === moduleId);
  const currentLesson = module.lessons[lessonIndex];
  const isLastLesson = lessonIndex === module.lessons.length - 1;

  // Загружаем контент из localStorage или используем дефолтный
  const localContent = (() => {
    const saved = localStorage.getItem('adminLessonContent');
    return saved ? JSON.parse(saved) : lessonContent;
  })();

  const content =
    localContent[currentLesson] || {
      title: currentLesson,
      content: `Это урок "${currentLesson}" модуля "${module.title}".

В реальном приложении здесь будет:
• Видео-материалы
• Интерактивные демонстрации
• Практические задания
• Дополнительные ресурсы

Нажмите кнопку ниже, чтобы завершить урок.`,
    };

  const handleNextClick = () => {
    // Отмечаем урок как просмотренный
    onCompleteLesson();
    // Переходим к следующему уроку
    onNextLesson();
  };

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
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 sm:p-6">
          <div className="text-xs sm:text-sm opacity-90 mb-1 sm:mb-2">
            {module.title} • Урок {lessonIndex + 1} из {module.lessons.length}
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">{content.title}</h1>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Прогресс-бар уроков */}
          <div className="flex gap-1 sm:gap-2 mb-4 sm:mb-6 lg:mb-8">
            {module.lessons.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-1.5 sm:h-2 rounded-full transition-all ${
                  index < lessonIndex
                    ? 'bg-green-500'
                    : index === lessonIndex
                    ? 'bg-blue-600'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          <>
              <div className="prose max-w-none mb-4 sm:mb-6 lg:mb-8">
                <div className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                  {content.content}
                </div>
              </div>

              {/* Видео-плеер */}
              {getVideoEmbedUrl(currentLesson) ? (
                <div className="mb-4 sm:mb-6 lg:mb-8">
                  <div className="relative rounded-lg overflow-hidden shadow-lg" style={{ paddingBottom: '56.25%', height: 0 }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={getVideoEmbedUrl(currentLesson)}
                      title={lessonVideos[currentLesson]?.title || currentLesson}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  {lessonVideos[currentLesson] && (
                    <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-600">
                      <p className="font-medium">{lessonVideos[currentLesson].title}</p>
                      <p className="text-gray-500">
                        {lessonVideos[currentLesson].channel} • {lessonVideos[currentLesson].duration}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center mb-4 sm:mb-6 lg:mb-8">
                  <div className="text-center text-white">
                    <Play className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-4 opacity-50" />
                    <p className="text-xs sm:text-sm opacity-75">Видео-контент</p>
                  </div>
                </div>
              )}

              {/* Кнопка зависит от того, последний урок или нет */}
              {isLastLesson ? (
                <button
                  onClick={() => {
                    onCompleteLesson();
                    onStartTest();
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-all shadow-md hover:shadow-lg"
                >
                  <Award className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span>Пройти итоговый тест модуля</span>
                </button>
              ) : (
                <button
                  onClick={handleNextClick}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-all shadow-md hover:shadow-lg"
                >
                  <span>Следующий урок</span>
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              )}
            </>
        </div>
      </div>
    </div>
  );
}

export default LessonViewer;
