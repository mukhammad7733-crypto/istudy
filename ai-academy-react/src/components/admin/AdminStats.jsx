import { Users, TrendingUp, Award, Clock, BookOpen, Target } from 'lucide-react';
import { getOverallProgress, minutesToHM } from '../../utils/helpers';
import { modulesData } from '../../data/mockData';

function AdminStats({ users }) {
  const totalUsers = users.length;
  const avgProgress = Math.round(
    users.reduce((s, u) => s + getOverallProgress(u.progress), 0) / totalUsers
  );
  const totalTests = users.reduce((s, u) => s + u.testResults.length, 0);
  const totalTimeSpent = users.reduce((s, u) => s + u.timeSpent, 0);

  // Активные пользователи (начали хотя бы один модуль)
  const activeUsers = users.filter(u =>
    Object.values(u.progress).some(p => p.started)
  ).length;

  // Завершенные модули
  const completedModules = users.reduce((sum, user) =>
    sum + Object.values(user.progress).filter(p => p.completed === p.total).length
  , 0);

  // Средний балл тестов
  const allTestScores = users.flatMap(u => u.testResults.map(t => t.score));
  const avgTestScore = allTestScores.length > 0
    ? Math.round(allTestScores.reduce((a, b) => a + b, 0) / allTestScores.length)
    : 0;

  // Статистика по модулям
  const moduleStats = modulesData.map(module => {
    const usersStarted = users.filter(u => u.progress[module.id]?.started).length;
    const usersCompleted = users.filter(u =>
      u.progress[module.id]?.completed === u.progress[module.id]?.total
    ).length;
    const completionRate = usersStarted > 0
      ? Math.round((usersCompleted / usersStarted) * 100)
      : 0;

    return {
      ...module,
      usersStarted,
      usersCompleted,
      completionRate
    };
  });

  // Распределение по отделам
  const departmentStats = users.reduce((acc, user) => {
    const dept = user.department || 'Без отдела';
    if (!acc[dept]) {
      acc[dept] = { count: 0, avgProgress: 0, totalProgress: 0 };
    }
    acc[dept].count++;
    acc[dept].totalProgress += getOverallProgress(user.progress);
    return acc;
  }, {});

  Object.keys(departmentStats).forEach(dept => {
    departmentStats[dept].avgProgress = Math.round(
      departmentStats[dept].totalProgress / departmentStats[dept].count
    );
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Статистика платформы</h2>
        <p className="text-sm sm:text-base text-gray-600">Общие показатели и аналитика</p>
      </div>

      {/* Основные метрики */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <Users className="w-6 h-6 sm:w-8 sm:h-8 opacity-80" />
            <div className="text-right">
              <div className="text-2xl sm:text-3xl font-bold">{totalUsers}</div>
              <div className="text-xs sm:text-sm opacity-80 hidden sm:block">Всего пользователей</div>
              <div className="text-xs opacity-80 sm:hidden">Юзеров</div>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="truncate">{activeUsers} актив.</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <Target className="w-6 h-6 sm:w-8 sm:h-8 opacity-80" />
            <div className="text-right">
              <div className="text-2xl sm:text-3xl font-bold">{avgProgress}%</div>
              <div className="text-xs sm:text-sm opacity-80 hidden sm:block">Средний прогресс</div>
              <div className="text-xs opacity-80 sm:hidden">Прогресс</div>
            </div>
          </div>
          <div className="text-xs sm:text-sm opacity-90">
            {completedModules} завершенных
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <Award className="w-6 h-6 sm:w-8 sm:h-8 opacity-80" />
            <div className="text-right">
              <div className="text-2xl sm:text-3xl font-bold">{totalTests}</div>
              <div className="text-xs sm:text-sm opacity-80 hidden sm:block">Пройдено тестов</div>
              <div className="text-xs opacity-80 sm:hidden">Тестов</div>
            </div>
          </div>
          <div className="text-xs sm:text-sm opacity-90">
            <span className="hidden sm:inline">Средний балл: </span>
            <span className="sm:hidden">Балл: </span>
            {avgTestScore}%
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <Clock className="w-6 h-6 sm:w-8 sm:h-8 opacity-80" />
            <div className="text-right">
              <div className="text-2xl sm:text-3xl font-bold">{Math.floor(totalTimeSpent / 60)}ч</div>
              <div className="text-xs sm:text-sm opacity-80 hidden sm:block">Времени потрачено</div>
              <div className="text-xs opacity-80 sm:hidden">Времени</div>
            </div>
          </div>
          <div className="text-xs sm:text-sm opacity-90 truncate">
            <span className="hidden sm:inline">В среднем: </span>
            <span className="sm:hidden">Срд: </span>
            {minutesToHM(Math.floor(totalTimeSpent / totalUsers))}
          </div>
        </div>
      </div>

      {/* Статистика по модулям */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          <span className="hidden sm:inline">Популярность модулей</span>
          <span className="sm:hidden">Модули</span>
        </h3>
        <div className="space-y-3 sm:space-y-4">
          {moduleStats.map((module) => (
            <div key={module.id} className="border-b border-gray-100 last:border-0 pb-3 sm:pb-4 last:pb-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-1 sm:gap-0">
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{module.title}</h4>
                <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                  <span className="text-gray-600">
                    Начали: <span className="font-semibold text-gray-900">{module.usersStarted}</span>
                  </span>
                  <span className="text-gray-600">
                    Завершили: <span className="font-semibold text-green-600">{module.usersCompleted}</span>
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${(module.usersStarted / totalUsers) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-gray-900 w-16 text-right">
                  {module.completionRate}% завершили
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Статистика по отделам */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Статистика по отделам</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {Object.entries(departmentStats).map(([dept, stats]) => (
            <div key={dept} className="border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">{dept}</div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.count}</div>
                  <div className="text-xs text-gray-500">пользователей</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-blue-600">{stats.avgProgress}%</div>
                  <div className="text-xs text-gray-500">прогресс</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminStats;
