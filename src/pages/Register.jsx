import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import registerIcon from '../images/register.png';

function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error('Паролата трябва да е поне 6 символа.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Паролите не съвпадат.');
      return;
    }

    setIsLoading(true);
    try {
      await register(fullName, email, password);
      toast.success('Регистрацията беше успешна!');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      console.error(error);
      const msg =
        error.response?.data ||
        'Регистрацията не бе успешна. Моля, опитайте отново.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-white via-sky-50 to-blue-100">
      <ToastContainer position="top-right" />
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-2xl border border-gray-200 animate-fade-in">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-100 p-2 rounded-full shadow mb-2">
            <img
              src={registerIcon}
              alt="Регистрация"
              className="w-10 h-10 object-contain"
            />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-800">
            📝 Регистрация
          </h2>
          <p className="text-gray-500 text-sm mt-2 text-center">
            Създай своя профил, за да започнеш.
          </p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleRegister}>
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Пълно име
            </label>
            <input
              id="fullName"
              type="text"
              placeholder="Иван Петров"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Имейл
            </label>
            <input
              id="email"
              type="email"
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Парола
            </label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="mt-1 text-sm text-blue-600 hover:underline"
            >
              {showPassword ? 'Скрий паролата' : 'Покажи паролата'}
            </button>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Потвърди паролата
            </label>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="mt-1 text-sm text-blue-600 hover:underline"
            >
              {showConfirmPassword ? 'Скрий потвърждението' : 'Покажи потвърждението'}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? 'Моля, изчакай...' : 'Регистрирай се'}
          </button>

          <p className="text-xs text-center text-gray-400 mt-2">
            С регистрацията си приемаш нашите{' '}
            <span className="underline cursor-pointer text-blue-500">условия</span>.
          </p>

          <div className="text-sm text-center text-gray-500">
            Вече имаш акаунт?{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Вход
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;