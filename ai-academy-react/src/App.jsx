import { useState, useEffect } from 'react';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import UserDashboard from './components/UserDashboard';
import { demoUsers } from './data/mockData';

function App() {
  // Проверяем localStorage при загрузке
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [role, setRole] = useState(() => {
    return localStorage.getItem('role') || null;
  });
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('userName') || '';
  });
  const [userEmail, setUserEmail] = useState(() => {
    return localStorage.getItem('userEmail') || '';
  });
  // Загружаем пользователей из localStorage или используем demoUsers
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('adminUsers');
    return savedUsers ? JSON.parse(savedUsers) : [...demoUsers];
  });

  // Сохраняем пользователей при изменении
  useEffect(() => {
    localStorage.setItem('adminUsers', JSON.stringify(users));
  }, [users]);

  const handleLogin = (email, password) => {
    // Проверка учетной записи администратора
    if (email.toLowerCase() === 'admin@sqb.uz' && password === 'admin123') {
      const name = 'Admin';
      setUserName(name);
      setUserEmail(email.toLowerCase());
      setRole('admin');
      setIsLoggedIn(true);

      localStorage.setItem('userName', name);
      localStorage.setItem('userEmail', email.toLowerCase());
      localStorage.setItem('role', 'admin');
      localStorage.setItem('isLoggedIn', 'true');

      return { success: true };
    }

    // Поиск пользователя в списке users
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return {
        success: false,
        message: 'Пользователь с таким email не найден. Обратитесь к администратору.'
      };
    }

    // Проверка пароля
    if (user.password !== password) {
      return {
        success: false,
        message: 'Неверный пароль'
      };
    }

    // Успешная авторизация пользователя
    const name = user.name || email.split('@')[0];
    setUserName(name);
    setUserEmail(user.email);
    setRole('user');
    setIsLoggedIn(true);

    localStorage.setItem('userName', name);
    localStorage.setItem('userEmail', user.email);
    localStorage.setItem('role', 'user');
    localStorage.setItem('isLoggedIn', 'true');

    return { success: true };
  };

  const handleLogout = () => {
    const currentUserName = userName;

    // Очищаем state
    setIsLoggedIn(false);
    setRole(null);
    setUserName('');
    setUserEmail('');

    // Очищаем localStorage авторизации
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('role');
    localStorage.removeItem('isLoggedIn');

    // Очищаем данные пользователя (опционально - можно оставить для следующего входа)
    // localStorage.removeItem(`user_${currentUserName}`);
    // localStorage.removeItem(`showAIChat_${currentUserName}`);
    // localStorage.removeItem(`aiAgentData_${currentUserName}`);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  if (role === 'admin') {
    return (
      <AdminPanel
        userName={userName}
        onLogout={handleLogout}
        users={users}
        setUsers={setUsers}
      />
    );
  }

  return (
    <UserDashboard
      userName={userName}
      userEmail={userEmail}
      onLogout={handleLogout}
      users={users}
      setUsers={setUsers}
    />
  );
}

export default App;
