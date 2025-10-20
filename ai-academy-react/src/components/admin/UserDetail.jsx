import { useState } from 'react';
import { ChevronLeft, Clock, CheckCircle, Calendar } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { modulesData } from '../../data/mockData';
import { getOverallProgress, minutesToHM } from '../../utils/helpers';
import TestResultModal from '../user/TestResultModal';

function UserDetail({ user, onBack }) {
  const overall = getOverallProgress(user.progress);
  const [selectedTestResult, setSelectedTestResult] = useState(null);

  const renderIcon = (iconName) => {
    // Map icon names to Lucide components
    const iconMap = {
      brain: LucideIcons.Brain,
      cpu: LucideIcons.Cpu,
      'file-spreadsheet': LucideIcons.FileSpreadsheet,
      image: LucideIcons.Image,
      'file-text': LucideIcons.FileText,
    };

    const IconComponent = iconMap[iconName] || LucideIcons.FileText;
    return <IconComponent className="w-5 h-5 text-blue-600" />;
  };

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
        Назад к списку
      </button>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-500 mt-1">{user.department}</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-blue-600">{overall}%</div>
            <div className="text-sm text-gray-600">Общий прогресс</div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <Clock className="w-8 h-8 text-blue-600 mb-2" />
            <div className="text-sm text-blue-700">Времени потрачено</div>
            <div className="text-2xl font-bold text-blue-900">
              {minutesToHM(user.timeSpent)}
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <CheckCircle className="w-8 h-8 text-green-600 mb-2" />
            <div className="text-sm text-green-700">Завершено модулей</div>
            <div className="text-2xl font-bold text-green-900">
              {Object.values(user.progress).filter((m) => m.completed === m.total).length}/5
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <Calendar className="w-8 h-8 text-purple-600 mb-2" />
            <div className="text-sm text-purple-700">Последняя активность</div>
            <div className="text-2xl font-bold text-purple-900">{user.lastActivity}</div>
          </div>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-4">Прогресс по модулям</h3>
        <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
          {modulesData.map((m) => {
            const pr = user.progress[m.id] || { completed: 0, total: 0 };
            const pct = pr.total ? Math.round((pr.completed / pr.total) * 100) : 0;

            return (
              <div key={m.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-4 mb-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    {renderIcon(m.icon)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{m.title}</h4>
                    <p className="text-sm text-gray-600">
                      {pr.completed} из {pr.total} уроков
                    </p>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{pct}%</span>
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-4">Результаты тестов</h3>
        {user.testResults.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            Пользователь еще не проходил тесты
          </div>
        ) : (
          <div className="border border-gray-200 rounded-lg overflow-hidden max-h-[400px] overflow-y-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Модуль
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                    Балл
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                    Дата
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                    Время
                  </th>
                </tr>
              </thead>
              <tbody>
                {user.testResults.map((r, idx) => {
                  const scoreClass =
                    r.score >= 90
                      ? 'bg-green-100 text-green-700'
                      : r.score >= 70
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700';

                  return (
                    <tr
                      key={idx}
                      onClick={() => setSelectedTestResult(r)}
                      className="border-b border-gray-100 last:border-b-0 hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {modulesData[r.moduleId - 1].title}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${scoreClass}`}
                        >
                          {r.score}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-sm text-gray-600">
                        {r.date}
                      </td>
                      <td className="py-3 px-4 text-center text-sm text-gray-600">
                        {r.time}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Test Result Modal */}
      {selectedTestResult && (
        <TestResultModal
          result={selectedTestResult}
          onClose={() => setSelectedTestResult(null)}
        />
      )}
    </div>
  );
}

export default UserDetail;
