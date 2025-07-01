import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import loginIcon from '../images/login.png';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password); 
      toast.success('✅ Входът беше успешен!');

      const userRolesFromLocalStorage = JSON.parse(localStorage.getItem('userRoles') || '[]');
      const storedNutritionPlanId = localStorage.getItem('nutritionPlanId'); 
      const storedTrainingPlanId = localStorage.getItem('trainingPlanId');   

      setTimeout(() => {
        // 💥 КОРИГИРАНА ЛОГИКА ЗА ПРЕНАСОЧВАНЕ
        if (userRolesFromLocalStorage.includes('ROLE_ADMIN')) {
          navigate('/admin'); // <-- АДМИН ОТИВА КЪМ АДМИН ПАНЕЛ
        } else if (userRolesFromLocalStorage.includes('ROLE_MODERATOR')) {
          navigate('/moderator');
        } else if (userRolesFromLocalStorage.includes('ROLE_GUEST')) {
          // Ако по някаква причина гост влезе през логин (което не би трябвало да е основен поток)
          navigate('/chatbot'); 
        } else if (userRolesFromLocalStorage.includes('ROLE_USER')) {
            if (storedNutritionPlanId && storedTrainingPlanId) {
                navigate('/dashboard');
            } else {
                navigate('/chatbot'); // Потребител без планове отива към чатбота
            }
        } else {
            console.warn("LoginPage: Неизвестна роля или липсваща логика за пренасочване. Пренасочване към начална страница.");
            navigate('/'); 
        }
      }, 1200); 
      
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        '❌ Входът не бе успешен. Моля, опитайте отново.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-white via-sky-50 to-blue-100">
      <ToastContainer position="top-right" />
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-2xl border border-gray-200 animate-fade-in">
        {/* ── Header ── */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-100 p-2 rounded-full shadow mb-2">
            <img src={loginIcon} alt="Вход" className="w-10 h-10 object-contain" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-800">🔐 Вход</h2>
          <p className="text-gray-500 text-sm mt-2 text-center">
            Добре дошъл обратно! Въведи имейл и парола, за да влезеш.
          </p>
        </div>

        {/* ── Form ── */}
        <form className="flex flex-col gap-5" onSubmit={handleLogin}>
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
            {/* Добавяме линка за забравена парола тук */}
            <div className="text-right mt-2">
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline font-medium">
                Забравена парола?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? 'Моля, изчакай...' : 'Вход'}
          </button>

          {/* ── Redirect ── */}
          <div className="text-sm text-center text-gray-500">
            Нямаш акаунт?{' '}
            <Link to="/register" className="text-blue-600 hover:underline font-medium">
              Регистрирай се
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
