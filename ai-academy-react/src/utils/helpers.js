export function getOverallProgress(progressMap) {
  if (!progressMap) return 0;
  const values = Object.values(progressMap);
  const total = values.reduce((s, m) => s + (m.total || 0), 0);
  const done = values.reduce((s, m) => s + (m.completed || 0), 0);
  return total ? Math.round((done / total) * 100) : 0;
}

export function minutesToHM(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}ч ${m}м`;
}

export function exportUsersToCSV(users, getOverallProgress) {
  const rows = [
    ['id', 'name', 'email', 'department', 'overall_progress_%', 'tests', 'time_spent_min', 'last_activity']
  ];

  users.forEach(u => {
    rows.push([
      u.id,
      `"${u.name}"`,
      u.email,
      `"${u.department || ''}"`,
      getOverallProgress(u.progress),
      u.testResults.length,
      u.timeSpent,
      `"${u.lastActivity || ''}"`
    ]);
  });

  const csv = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'users_export.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
