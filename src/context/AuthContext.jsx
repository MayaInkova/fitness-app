// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect, useMemo } from 'react'; // Added useMemo
import api from '../services/api'; // axios инстанция с baseURL = http://localhost:8080/api
import { saveToken, clearToken, getToken } from '../utils/token';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  // If context is null (e.g., component rendered outside provider),
  // provide a default structure to prevent destructuring errors.
  if (!context) {
    console.error("useAuth must be used within an AuthProvider");
    return {
      user: null,
      login: async () => {},
      register: async () => {},
      logout: () => {},
      forgotPassword: async () => {},
      hasRole: () => false, // Default hasRole always returns false
      guestLogin: async () => false,
    };
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  /* ───── Зареждаме токена и потребителските данни при refresh ───── */
  useEffect(() => {
    const token = getToken(); // getToken() чете от localStorage
    const storedUserId = localStorage.getItem('userId');
    const storedUserEmail = localStorage.getItem('userEmail');
    let storedUserRoles = localStorage.getItem('userRoles'); 
    const storedNutritionPlanId = localStorage.getItem('nutritionPlanId');
    const storedTrainingPlanId = localStorage.getItem('trainingPlanId');

    if (storedUserRoles === "undefined") {
      storedUserRoles = null;
    }

    if (token) {
      setUser({
        accessToken: token,
        id: storedUserId ? Number(storedUserId) : null,
        email: storedUserEmail,
        roles: storedUserRoles ? JSON.parse(storedUserRoles) : [],
        nutritionPlanId: storedNutritionPlanId ? Number(storedNutritionPlanId) : null,
        trainingPlanId: storedTrainingPlanId ? Number(storedTrainingPlanId) : null,
      });
    }
  }, []);

  // Хелпер функция за запазване на данни в localStorage и setUser
  const saveUserData = (data) => {
    saveToken(data.accessToken);
    localStorage.setItem('userId', data.id);
    localStorage.setItem('userEmail', data.email);
    localStorage.setItem('userRoles', JSON.stringify(data.roles));

    if (data.nutritionPlanId !== undefined && data.nutritionPlanId !== null) {
      localStorage.setItem('nutritionPlanId', data.nutritionPlanId);
    } else {
      localStorage.removeItem('nutritionPlanId');
    }
    if (data.trainingPlanId !== undefined && data.trainingPlanId !== null) {
      localStorage.setItem('trainingPlanId', data.trainingPlanId);
    } else {
      localStorage.removeItem('trainingPlanId');
    }

    setUser({
      accessToken: data.accessToken,
      id: data.id,
      email: data.email,
      roles: data.roles,
      nutritionPlanId: data.nutritionPlanId,
      trainingPlanId: data.trainingPlanId
    });
  };

  // Хелпер функция за изчистване на всички потребителски данни
  const clearAllUserData = () => {
    clearToken();
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRoles');
    localStorage.removeItem('nutritionPlanId');
    localStorage.removeItem('trainingPlanId');
    localStorage.removeItem('role'); 
    localStorage.removeItem('token'); 
    setUser(null);
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    saveUserData(data);
  };

  const guestLogin = async () => {
    try {
      clearAllUserData(); 
      const { data } = await api.post('/auth/guest'); 
      
      const transformedData = {
        accessToken: data.token,
        id: Number(data.userId),
        email: `guest_${data.userId}@fitnessapp.com`,
        roles: [data.role],
        nutritionPlanId: null,
        trainingPlanId: null,
      };

      saveUserData(transformedData);
      return true;
    } catch (error) {
      console.error("AuthContext: Грешка при гост вход:", error.response ? error.response.data : error.message);
      clearAllUserData();
      return false;
    }
  };

  const register = async (fullName, email, password) => {
    await api.post('/auth/register', { fullName, email, password });
  };

  const logout = () => {
    clearAllUserData();
  };

  const forgotPassword = async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  };

  // Use useMemo to memoize the context value, ensuring hasRole is stable
  const contextValue = useMemo(() => {
    const hasRole = (roleName) => {
      return user && user.roles && user.roles.includes(roleName);
    };
    return { user, login, register, logout, forgotPassword, hasRole, guestLogin };
  }, [user, login, register, logout, forgotPassword, guestLogin]); // Dependencies for useMemo

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
