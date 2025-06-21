import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function GuestIntro() {
  const navigate = useNavigate();

  const startAsGuest = async () => {
    try {
      const res = await axios.post("http://localhost:8080/api/auth/guest");
      const { token, userId, role } = res.data;

      // Записване в localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("role", role);

      // Пренасочване към чатбот
      navigate("/chatbot");
    } catch (err) {
      alert("⚠️ Възникна грешка при стартиране като гост.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-orange-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <h1 className="text-4xl font-extrabold text-orange-600 mb-6">
          Добре дошъл, Гост <span role="img" aria-label="sparkles">✨</span>
        </h1>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Влез и опитай функционалностите на приложението без регистрация!
          Генерирай хранителен режим и виж как работи системата. Регистрацията не е задължителна... засега.
        </p>

        <ul className="text-lg text-gray-800 text-left mb-8 space-y-2">
          <li className="flex items-center"><span role="img" aria-label="check" className="mr-3 text-green-500">✔️</span> Персонализиран хранителен режим (демо)</li>
          <li className="flex items-center"><span role="img" aria-label="chat" className="mr-3 text-blue-500">💬</span> Интерактивен чатбот (демо)</li>
          <li className="flex items-center"><span role="img" aria-label="chart" className="mr-3 text-purple-500">📊</span> Демо резултати без акаунт</li>
        </ul>

        <button
          onClick={startAsGuest}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        >
          🚀 Стартирай без регистрация
        </button>

        <div className="text-sm text-gray-600 text-center mt-6">
          За пълна функционалност{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            регистрирай се
          </Link>{" "}
          или{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            влез
          </Link>
        </div>
      </div>
    </div>
  );
}

export default GuestIntro;