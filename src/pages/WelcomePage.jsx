import React from "react";
import { Link, useNavigate } from "react-router-dom"; // useNavigate вече е нужен
import { useAuth } from '../context/AuthContext'; // useAuth вече е нужен
import { toast } from 'react-toastify'; // toast вече е нужен
import bgImage from "../images/hero-bg.jpg";

export default function WelcomePage() {
  const navigate = useNavigate(); // Възстановено
  const { guestLogin } = useAuth(); // Възстановено

  // handleGuestStart функцията е възстановена
  const handleGuestStart = async () => {
    try {
      const success = await guestLogin(); // Извършваме guestLogin тук
      if (success) {
        toast.success('Добре дошли като гост!');
        setTimeout(() => {
          navigate("/guest"); // <-- Пренасочваме към GuestIntro страницата
        }, 500); 
      } else {
        toast.error("Възникна проблем при стартиране като гост.");
      }
    } catch (err) {
      console.error("Грешка при стартиране като гост:", err);
      toast.error("Възникна неочаквана грешка при стартиране като гост.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col justify-between">
      {/* ✦ Hero Section ✦ */}
      <div
        className="relative flex flex-col items-center justify-center text-center text-white px-4 py-28 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60 z-0" />
        <div className="relative z-10 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 drop-shadow-lg">
            Добре дошъл във <span className="text-yellow-400">FitnessApp</span> 💪
          </h1>
          <p className="text-lg md:text-xl mb-4 text-gray-200 leading-relaxed">
            🔥 Твоето пътуване към по-здравословен живот започва днес!
          </p>
          <p className="text-md md:text-lg text-gray-300">
            Нашата интелигентна система ще създаде персонализиран хранителен и тренировъчен режим,
            съобразен с твоите цели, физика и ежедневие. Независимо дали искаш да отслабнеш,
            изградиш мускули или просто да поддържаш форма – <strong>ние сме до теб</strong>!
          </p>
        </div>
      </div>

      {/* ✦ Animated Motivation Bar ✦ */}
      <div className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white text-center py-2 font-semibold animate-pulse">
        💡 Малките стъпки водят до големи резултати. Започни днес!
      </div>

      {/* ✦ How it works ✦ */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-blue-800 mb-6 flex items-center">
          <span className="mr-3">📌</span> Как работи?
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-start gap-4">
              <div className="text-white bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-md">
                {step}
              </div>
              <p className="text-gray-700">
                {step === 1 && "Въведи параметри – възраст, тегло, цели и ниво на активност"}
                {step === 2 && "Отговори на въпросите на AI-чатбота за по-точна оценка"}
                {step === 3 && "Генерирай персонален хранителен и тренировъчен режим"}
                {step === 4 && "Следи напредъка си и променяй режима при нужда"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ✦ Benefits Section ✦ */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
          <span className="mr-3">🎁</span> Защо да се регистрираш?
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-start gap-4 p-5 bg-white border-l-4 border-blue-600 rounded-xl shadow hover:shadow-lg transition">
            <span className="text-3xl">⚙️</span>
            <div>
              <h4 className="text-lg font-bold text-blue-800">Интелигентен алгоритъм</h4>
              <p className="text-sm text-gray-600">
                Получаваш напълно персонализиран режим за хранене и тренировки.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-5 bg-white border-l-4 border-green-600 rounded-xl shadow hover:shadow-lg transition">
            <span className="text-3xl">📈</span>
            <div>
              <h4 className="text-lg font-bold text-green-800">Прогрес и история</h4>
              <p className="text-sm text-gray-600">
                Проследи напредъка си и върни се към предишни режими, когато пожелаеш.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-5 bg-white border-l-4 border-yellow-500 rounded-xl shadow hover:shadow-lg transition">
            <span className="text-3xl">🧪</span>
            <div>
              <h4 className="text-lg font-bold text-yellow-600">Сравнение и адаптивност</h4>
              <p className="text-sm text-gray-600">
                Експериментирай с различни планове и адаптирай стратегията си.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-5 bg-white border-l-4 border-purple-500 rounded-xl shadow hover:shadow-lg transition">
            <span className="text-3xl">🤖</span>
            <div>
              <h4 className="text-lg font-bold text-purple-700">AI препоръки</h4>
              <p className="text-sm text-gray-600">
                Получавай съвети, съобразени с твоите данни и поведение.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ✦ Testimonials ✦ */}
      <div className="bg-white py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-blue-700 mb-8">💬 Отзиви от потребители</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {["Радослав", "Ива", "Моника"].map((name, i) => (
              <div key={i} className="p-6 rounded-lg shadow bg-gray-50">
                <p className="italic text-gray-700 mb-4">
                  {name === "Радослав" && "\u201EСистемата ми помогна да вляза във форма за 2 месеца!\u201C"}
                  {name === "Ива" && "\u201EНай-сетне намерих приложение, което разбира нуждите ми.\u201C"}
                  {name === "Моника" && "\u201EХаресва ми, че мога да сравнявам режими и да експериментирам.\u201C"}
                </p>
                <div className="font-bold text-blue-800">– {name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ✦ FAQ ✦ */}
      <div className="bg-gray-100 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">❓ Често задавани въпроси</h2>
          <div className="grid gap-6">
            <div>
              <h4 className="font-semibold text-gray-700">Трябва ли да съм напълно регистриран, за да тествам?</h4>
              <p className="text-sm text-gray-600">Не. Можеш да опиташ като гост и да видиш как работи системата.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700">Мога ли да променям целите си?</h4>
              <p className="text-sm text-gray-600">Да, режимите са адаптивни и могат да се коригират по всяко време.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ✦ CTA Buttons ✦ */}
      <div className="text-center pb-16">
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
          <Link to="/login">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition transform hover:-translate-y-1">
              🔐 Вход
            </button>
          </Link>
          <Link to="/register">
            <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-8 rounded-full shadow-lg transition transform hover:-translate-y-1">
              📝 Регистрация
            </button>
          </Link>
          {/* КОРЕКЦИЯ: Бутонът "Пробвай като гост" вече извиква handleGuestStart директно */}
          <button 
            onClick={handleGuestStart} // <-- Извикваме handleGuestStart при клик
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-8 rounded-full shadow-lg transition transform hover:-translate-y-1"
          >
            🚀 Пробвай като гост
          </button>
        </div>
        <p className="mt-10 text-sm text-gray-600">
          Ние вярваме, че <strong>всеки заслужава да бъде във форма</strong>. Започни днес. Твоето по-добро "аз" те очаква! 🌟
        </p>
      </div>

      {/* ✦ Footer ✦ */}
      <footer className="bg-gray-900 text-white text-sm text-center py-4">
        © 2025 FitnessApp. Всички права запазени. <Link to="/privacy" className="underline">Политика за поверителност</Link>
      </footer>
    </div>
  );
}
