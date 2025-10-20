function AdminTabs({ activeView, setActiveView }) {
  const tabs = [
    { key: 'adminUsers', label: 'Пользователи', shortLabel: 'Юзеры' },
    { key: 'adminContent', label: 'Контент', shortLabel: 'Контент' },
    { key: 'adminStats', label: 'Статистика', shortLabel: 'Стат' }
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-[56px] sm:top-[64px] z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveView(tab.key)}
              className={`px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeView === tab.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.shortLabel}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default AdminTabs;
