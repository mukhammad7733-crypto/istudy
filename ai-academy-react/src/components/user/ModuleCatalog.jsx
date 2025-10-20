import * as LucideIcons from 'lucide-react';

function ModuleCatalog({ modulesData, userProgress, onStartModule }) {
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

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Каталог курсов</h2>
        <p className="text-sm sm:text-base text-gray-600">
          Выберите курс для начала обучения
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
        {modulesData.map((module) => {
          const progress = userProgress[module.id] || { completed: 0, total: 7 };
          const progressPercent = progress.total
            ? Math.round((progress.completed / progress.total) * 100)
            : 0;
          const isCompleted = progress.completed === progress.total;
          const isStarted = progress.started;
          const IconComponent = getIconComponent(module.icon);

          return (
            <div
              key={module.id}
              className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="bg-blue-100 p-2 sm:p-3 rounded-xl flex-shrink-0">
                  <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">
                    {module.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                    <LucideIcons.BookOpen className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span>{module.lessons.length} уроков</span>
                  </div>
                </div>
                {isCompleted && (
                  <div className="bg-green-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                    <LucideIcons.CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                )}
              </div>

              <div className="space-y-2 mb-3 sm:mb-4">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Прогресс</span>
                  <span className="font-semibold text-gray-900">
                    {progress.completed}/{progress.total}
                  </span>
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>

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
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ModuleCatalog;
