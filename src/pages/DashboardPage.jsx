import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function DashboardPage() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-8 flex flex-col items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl p-10 max-w-4xl w-full text-center transform hover:scale-105 transition-transform duration-300 ease-in-out">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6 drop-shadow-lg">
          Добре дошли, {currentUser ? currentUser.fullName || currentUser.email.split('@')[0] : 'Атлет'}!
        </h1>
        <p className="text-xl text-gray-700 mb-10 leading-relaxed">
          Вашият път към по-здравословен и силен живот започва тук. Нека изградим идеалния режим за вас!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-6 rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300 cursor-pointer">
            <h3 className="text-2xl font-bold mb-3">Генерирай Нов План</h3>
            <p className="text-gray-100 text-md mb-6">
              Получете персонализирани хранителни и тренировъчни режими според вашите цели.
            </p>
            <Link to="/generate-plan">
              <button className="bg-white text-green-700 hover:bg-gray-100 font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                Започни
              </button>
            </Link>
          </div>

          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300 cursor-pointer">
            <h3 className="text-2xl font-bold mb-3">История на Режимите</h3>
            <p className="text-gray-100 text-md mb-6">
              Проследете напредъка си и прегледайте всички предишни генерирани планове.
            </p>
            <Link to="/history">
              <button className="bg-white text-orange-700 hover:bg-gray-100 font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                Прегледай
              </button>
            </Link>
          </div>

          <div className="bg-gradient-to-r from-red-400 to-pink-500 text-white p-6 rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300 cursor-pointer">
            <h3 className="text-2xl font-bold mb-3">Моят Профил</h3>
            <p className="text-gray-100 text-md mb-6">
              Актуализирайте личните си данни, предпочитания и фитнес цели.
            </p>
            <Link to="/profile">
              <button className="bg-white text-pink-700 hover:bg-gray-100 font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                Редактирай
              </button>
            </Link>
          </div>
        </div>

        <div className="mt-12 text-lg text-gray-600">
          <p>
            Нуждаете се от помощ или съвет? Използвайте нашия{' '}
            <Link to="/chatbot" className="text-blue-600 hover:underline font-semibold">
              интелигентен чатбот
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
