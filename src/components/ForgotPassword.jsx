import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import forgotPasswordIcon from "../images/lock.png"; // Може да си изберете икона или да използвате друга

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { forgotPassword } = useAuth(); // 🔑 Извикваме forgotPassword от контекста

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await forgotPassword(email); // 🤝 Извикваме функцията за възстановяване на парола
      toast.success('✅ Ако има акаунт с този имейл, линк за възстановяване е изпратен.');
      setTimeout(() => navigate('/login'), 3000); // Пренасочваме обратно към логин след успешно изпращане
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        '❌ Възникна грешка при изпращане на заявката. Моля, опитайте отново.';
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
            <img src={forgotPasswordIcon} alt="Забравена парола" className="w-10 h-10 object-contain" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-800">❓ Забравена парола</h2>
          <p className="text-gray-500 text-sm mt-2 text-center">
            Въведете вашия имейл адрес, за да получите линк за възстановяване на паролата.
          </p>
        </div>

        {/* ── Form ── */}
        <form className="flex flex-col gap-5" onSubmit={handleForgotPassword}>
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? 'Изпращане...' : 'Изпрати линк за възстановяване'}
          </button>

          {/* ── Redirect back to Login ── */}
          <div className="text-sm text-center text-gray-500">
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Върни се към вход
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;