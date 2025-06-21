import api from './api';   // axios инстанцията с baseURL = …/api

// 📝 Регистрация
export const register = (fullName, email, password) =>
  api.post('/auth/register', { fullName, email, password });

// 🔑 Вход
export const login = (email, password) =>
  api.post('/auth/login', { email, password });