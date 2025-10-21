import { useState } from 'react';
import { Users, TrendingUp, Award, Clock, BookOpen, Target, ChevronDown, X, CheckCircle, XCircle } from 'lucide-react';
import { getOverallProgress, minutesToHM } from '../../utils/helpers';
import { modulesData } from '../../data/mockData';

function AdminStats({ users }) {
  const [selectedUserId, setSelectedUserId] = useState('all');
  const [detailModal, setDetailModal] = useState(null);

  // Фильтруем пользователей
  const selectedUser = selectedUserId === 'all' ? null : users.find(u => u.id === selectedUserId);
  const displayUsers = selectedUser ? [selectedUser] : users;

  // Общая статистика
  const totalUsers = displayUsers.length;
  const avgProgress = totalUsers > 0 ? Math.round(
    displayUsers.reduce((s, u) => s + getOverallProgress(u.progress), 0) / totalUsers
  ) : 0;
  const totalTests = displayUsers.reduce((s, u) => s + u.testResults.length, 0);
  const totalTimeSpent = displayUsers.reduce((s, u) => s + u.timeSpent, 0);

  // Активные пользователи
  const activeUsers = displayUsers.filter(u =>
    Object.values(u.progress).some(p => p.started)
  ).length;

  // Завершенные модули
  const completedModules = displayUsers.reduce((sum, user) =>
    sum + Object.values(user.progress).filter(p => p.completed === p.total && p.total > 0).length
  , 0);

  // Средний балл тестов
  const allTestScores = displayUsers.flatMap(u => u.testResults.map(t => t.score));
  const avgTestScore = allTestScores.length > 0
    ? Math.round(allTestScores.reduce((a, b) => a + b, 0) / allTestScores.length)
    : 0;

  // Статистика по модулям
  const moduleStats = modulesData.map(module => {
    const usersStarted = displayUsers.filter(u => u.progress[module.id]?.started).length;
    const usersCompleted = displayUsers.filter(u => {
      const p = u.progress[module.id];
      return p && p.completed === p.total && p.total > 0;
    }).length;
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

  // Распределение по отделам (только для "Все пользователи")
  const departmentStats = selectedUserId === 'all' ? users.reduce((acc, user) => {
    const dept = user.department || 'Без отдела';
    if (!acc[dept]) {
      acc[dept] = { count: 0, avgProgress: 0, totalProgress: 0 };
    }
    acc[dept].count++;
    acc[dept].totalProgress += getOverallProgress(user.progress);
    return acc;
  }, {}) : {};

  Object.keys(departmentStats).forEach(dept => {
    departmentStats[dept].avgProgress = Math.round(
      departmentStats[dept].totalProgress / departmentStats[dept].count
    );
  });

  // Открыть детали для метрики
  const openDetails = (type) => {
    setDetailModal({ type, data: getDetailData(type) });
  };

  // Получить детальные данные
  const getDetailData = (type) => {
    switch (type) {
      case 'users':
        return displayUsers.map(u => ({
          name: u.name,
          email: u.email,
          department: u.department,
          active: Object.values(u.progress).some(p => p.started),
          progress: getOverallProgress(u.progress),
          lastActivity: u.lastActivity || 'Не указано',
          timeSpent: minutesToHM(u.timeSpent),
          completedModules: Object.values(u.progress).filter(p => p.completed === p.total && p.total > 0).length,
          totalModules: Object.keys(u.progress).length
        }));

      case 'progress':
        return displayUsers.map(u => ({
          name: u.name,
          progress: getOverallProgress(u.progress),
          modules: Object.keys(u.progress).length,
          completed: Object.values(u.progress).filter(p => p.completed === p.total && p.total > 0).length,
          lastActivity: u.lastActivity || 'Не указано',
          timeSpent: minutesToHM(u.timeSpent)
        }));

      case 'tests':
        return displayUsers.flatMap(u =>
          u.testResults.map(t => ({
            userName: u.name,
            moduleId: t.moduleId,
            moduleName: modulesData.find(m => m.id === t.moduleId)?.title || 'Неизвестный модуль',
            score: t.score,
            date: t.date
          }))
        );

      case 'time':
        return displayUsers.map(u => ({
          name: u.name,
          timeSpent: u.timeSpent,
          formatted: minutesToHM(u.timeSpent),
          avgPerModule: minutesToHM(Math.floor(u.timeSpent / Object.keys(u.progress).length))
        }));

      default:
        return [];
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Заголовок с селектором пользователя */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Статистика платформы</h2>
          <p className="text-sm sm:text-base text-gray-600">Общие показатели и аналитика</p>
        </div>

        {/* Селектор пользователя */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Показать статистику для:
          </label>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="w-full sm:w-64 px-4 py-2.5 pr-10 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900 font-medium appearance-none cursor-pointer hover:border-blue-400 transition-colors"
          >
            <option value="all">Все пользователи</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-11 w-5 h-5 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Основные метрики (кликабельные) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <button
          onClick={() => openDetails('users')}
          className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4 sm:p-6 hover:from-blue-600 hover:to-blue-700 transition-all hover:scale-105 cursor-pointer text-left"
        >
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <Users className="w-6 h-6 sm:w-8 sm:h-8 opacity-80" />
            <div className="text-right">
              <div className="text-2xl sm:text-3xl font-bold">{totalUsers}</div>
              <div className="text-xs sm:text-sm opacity-80 hidden sm:block">
                {selectedUser ? 'Пользователь' : 'Всего пользователей'}
              </div>
              <div className="text-xs opacity-80 sm:hidden">Юзеров</div>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="truncate">{activeUsers} активных</span>
          </div>
          <div className="text-xs opacity-70 mt-2">Нажмите для деталей →</div>
        </button>

        <button
          onClick={() => openDetails('progress')}
          className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-4 sm:p-6 hover:from-green-600 hover:to-green-700 transition-all hover:scale-105 cursor-pointer text-left"
        >
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
          <div className="text-xs opacity-70 mt-2">Нажмите для деталей →</div>
        </button>

        <button
          onClick={() => openDetails('tests')}
          className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-4 sm:p-6 hover:from-purple-600 hover:to-purple-700 transition-all hover:scale-105 cursor-pointer text-left"
        >
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
          <div className="text-xs opacity-70 mt-2">Нажмите для деталей →</div>
        </button>

        <button
          onClick={() => openDetails('time')}
          className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-4 sm:p-6 hover:from-orange-600 hover:to-orange-700 transition-all hover:scale-105 cursor-pointer text-left"
        >
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <Clock className="w-6 h-6 sm:w-8 sm:h-8 opacity-80" />
            <div className="text-right">
              <div className="text-2xl sm:text-3xl font-bold">{minutesToHM(totalTimeSpent)}</div>
              <div className="text-xs sm:text-sm opacity-80 hidden sm:block">Времени потрачено</div>
              <div className="text-xs opacity-80 sm:hidden">Времени</div>
            </div>
          </div>
          <div className="text-xs sm:text-sm opacity-90 truncate">
            <span className="hidden sm:inline">В среднем: </span>
            <span className="sm:hidden">Срд: </span>
            {totalUsers > 0 ? minutesToHM(Math.floor(totalTimeSpent / totalUsers)) : '0ч 0м'}
          </div>
          <div className="text-xs opacity-70 mt-2">Нажмите для деталей →</div>
        </button>
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
                  {module.completionRate}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Статистика по отделам (только для всех пользователей) */}
      {selectedUserId === 'all' && Object.keys(departmentStats).length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Статистика по отделам</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {Object.entries(departmentStats).map(([dept, stats]) => (
              <div key={dept} className="border border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:shadow-md transition-all">
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
      )}

      {/* Модальное окно с деталями */}
      {detailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {detailModal.type === 'users' && 'Детали по пользователям'}
                {detailModal.type === 'progress' && 'Детали по прогрессу'}
                {detailModal.type === 'tests' && 'Детали по тестам'}
                {detailModal.type === 'time' && 'Детали по времени'}
              </h3>
              <button
                onClick={() => setDetailModal(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-3">
              {detailModal.type === 'users' && detailModal.data.map((user, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:border-blue-400 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="font-semibold text-gray-900">{user.name}</div>
                        {user.active ? (
                          <CheckCircle className="w-5 h-5 text-green-500" title="Активен" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-400" title="Неактивен" />
                        )}
                      </div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                      <div className="text-sm text-gray-500 mt-1">{user.department}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{user.progress}%</div>
                      <div className="text-xs text-gray-500">прогресс</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
                    <div>
                      <div className="text-xs text-gray-500">Модули</div>
                      <div className="text-sm font-semibold text-gray-900">{user.completedModules}/{user.totalModules}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Время</div>
                      <div className="text-sm font-semibold text-gray-900">{user.timeSpent}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Активность</div>
                      <div className="text-sm font-semibold text-gray-900">{user.lastActivity}</div>
                    </div>
                  </div>
                </div>
              ))}

              {detailModal.type === 'progress' && detailModal.data.map((user, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:border-blue-400 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-gray-900">{user.name}</div>
                    <div className="text-2xl font-bold text-blue-600">{user.progress}%</div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-gray-600 mb-2">
                    <div>
                      <span className="text-gray-500">Модулей:</span> <span className="font-semibold text-gray-900">{user.modules}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Завершено:</span> <span className="font-semibold text-green-600">{user.completed}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Время:</span> <span className="font-semibold text-gray-900">{user.timeSpent}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Активность:</span> <span className="font-semibold text-gray-900">{user.lastActivity}</span>
                    </div>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${user.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}

              {detailModal.type === 'tests' && detailModal.data.map((test, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:border-blue-400 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">{test.userName}</div>
                      <div className="text-sm text-gray-600">{test.moduleName}</div>
                      <div className="text-xs text-gray-500 mt-1">{test.date}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-3xl font-bold ${test.score >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                        {test.score}%
                      </div>
                      <div className="text-xs text-gray-500">результат</div>
                    </div>
                  </div>
                </div>
              ))}

              {detailModal.type === 'time' && detailModal.data.map((user, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:border-blue-400 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        В среднем на модуль: {user.avgPerModule}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-orange-600">{user.formatted}</div>
                      <div className="text-xs text-gray-500">всего времени</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminStats;
