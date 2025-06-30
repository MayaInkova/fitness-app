import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api'; // axios инстанция с baseURL = http://localhost:8080/api
import { saveToken, clearToken, getToken } from '../utils/token';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  /* ───── Зареждаме токена и потребителските данни при refresh ───── */
  useEffect(() => {
    const token = getToken(); // getToken() чете от localStorage
    const storedUserId = localStorage.getItem('userId');
    const storedUserEmail = localStorage.getItem('userEmail');
    const storedUserRoles = localStorage.getItem('userRoles');

    if (token) {
      setUser({
        accessToken: token,
        id: storedUserId ? Number(storedUserId) : null,
        email: storedUserEmail,
        roles: storedUserRoles ? JSON.parse(storedUserRoles) : [],
      });
    }
  }, []); // Пуст масив за зависимости, за да се изпълни само веднъж при монтиране на компонента

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });

    saveToken(data.accessToken); // Запазва токена в localStorage (utils/token.js)

    // Запазваме допълнителни потребителски данни в localStorage
    localStorage.setItem('userId', data.id);
    localStorage.setItem('userEmail', data.email);
    localStorage.setItem('userRoles', JSON.stringify(data.roles)); // Уверете се, че data.roles е наличен тук!

    setUser(data); // Обновява състоянието на потребителя
  };

  const register = async (fullName, email, password) => {
    await api.post('/auth/register', { fullName, email, password });
  };

  const logout = () => {
    clearToken(); // Изчиства токена от localStorage (utils/token.js)

    // Изчистваме и другите потребителски данни от localStorage
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRoles');

    setUser(null); // Изчиства състоянието на потребителя
  };

  // 🚨 НОВА ФУНКЦИЯ ЗА ЗАБРАВЕНА ПАРОЛА
  const forgotPassword = async (email) => {
    // Изпращаме POST заявка към бекенда с имейла
    // Очакваме бекенд ендпойнт от типа /api/auth/forgot-password
    const response = await api.post('/auth/forgot-password', { email });
    return response.data; // Връщаме отговора от бекенда
  };

  // 🌟 НОВА ФУНКЦИЯ ЗА ПРОВЕРКА НА РОЛЯ - Дефинирана е правилно!
  const hasRole = (roleName) => {
    return user && user.roles && user.roles.includes(roleName);
  };

  return (
    // 💥 КОРЕКЦИЯ: Добавяме hasRole към value обекта, за да бъде достъпна през useAuth()
    <AuthContext.Provider value={{ user, login, register, logout, forgotPassword, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}