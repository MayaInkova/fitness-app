import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

/**
 * GuestSummary – показва примерния еднодневен режим + полезни ресурси.
 *
 * - взима `demoPlan` от sessionStorage (сета от бекенда)
 * - ако липсва → зарежда хардкоднат „примерен“ план
 * - красиви Tailwind компоненти, responsive
 */
export default function GuestSummary() {
  const [demoPlan, setDemoPlan] = useState(null);

  /* --- fallback данни, когато няма нищо в sessionStorage --- */
  const samplePlan = {
    day: "Понеделник",
    meals: [
      {
        meal: "Закуска",
        description: "Овесени ядки с банан и мед",
      },
      {
        meal: "Обяд",
        description: "Пилешко филе с кафяв ориз и броколи",
      },
      {
        meal: "Вечеря",
        description: "Сьомга на фурна с аспержи",
      },
    ],
  };

useEffect(() => {
  setDemoPlan(samplePlan); // временно игнорира sessionStorage
}, []);

  /* ---------- статични ресурси ---------- */
  const motivationalQuotes = [
    "❝Вашето тяло може почти всичко – умът трябва да му го позволи.❞",
    "❝Не става по-лесно, ти ставаш по-силен!❞",
    "❝Мотивацията ти помага да започнеш, навикът – да продължиш.❞",
  ];

  const workoutVideos = [
    {
      src: "https://www.youtube.com/embed/50kH47ZztHs",
      title: "Кардио тренировка за начинаещи",
    },
    {
      src: "https://www.youtube.com/embed/VHyGqsPOUHs",
      title: "Загрявка за всяка тренировка",
    },
    {
      src: "https://www.youtube.com/embed/fOdrW7nf9gw",
      title: "Цяло тяло без подскоци",
    },
    {
      src: "https://www.youtube.com/embed/UItWltVZZmE",
      title: "30 минути тренировка у дома",
    },
  ];

  const motivationalVideos = [
    {
      src: "https://www.youtube.com/embed/26U_seo0a1g",
      title: "История: Как отслабнах с 40 кг и промених живота си",
    },
    {
      src: "https://www.youtube.com/embed/lC0HR1ryMHs",
      title: "Най-добрият съвет за отслабване",
    },
  ];

  const nutritionMistakes = [
    "Прекалено нисък прием на протеин",
    "Недооценяване на скритите калории (сосове, напитки)",
    "Прекалено строги диети ➔ йо-йо ефект",
  ];

  const trainingMistakes = [
    "Игнориране на загрявката и стречинга",
    "Лоша техника при базовите движения (клек, тяга, лежанка)",
    "Прекалено бързо увеличаване на тежестите без адаптация",
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8 lg:px-20">
      {/* Заглавие */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-center text-orange-600 mb-10 flex items-center justify-center gap-3">
        🎯 <span>Персонализираният режим е готов!</span>
      </h1>

      {/* Примерно меню */}
      {demoPlan && (
        <section className="max-w-4xl mx-auto mb-10 bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-purple-700 mb-6 flex items-center gap-2">
            🍽️ Примерно меню – {demoPlan.day}
            {!sessionStorage.getItem("demoPlan") && (
              <span className="text-sm text-gray-400">(пример)</span>
            )}
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {demoPlan.meals.map((m, i) => (
              <article
                key={i}
                className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex flex-col shadow hover:shadow-md transition"
              >
                <h3 className="font-semibold text-lg mb-1 flex items-center gap-2">
                  {i === 0 && "🥣"}
                  {i === 1 && "🍱"}
                  {i === 2 && "🍲"}
                  {m.meal}
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {m.description}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Мотивация */}
      <section className="max-w-3xl mx-auto mb-10">
        <h2 className="text-2xl font-bold text-teal-600 mb-4">
          🌟 Мотивация за деня
        </h2>
        <ul className="space-y-3">
          {motivationalQuotes.map((q, idx) => (
            <li
              key={idx}
              className="bg-teal-50 border-l-4 border-teal-400 p-4 rounded-md text-gray-800 italic"
            >
              {q}
            </li>
          ))}
        </ul>
      </section>

      {/* Видео упражнения */}
      <section className="max-w-5xl mx-auto mb-10 bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-green-600 mb-6">
          💪 Видео упражнения
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {workoutVideos.map((v, i) => (
            <iframe
              key={i}
              className="w-full aspect-video rounded-xl shadow"
              src={v.src}
              title={v.title}
              allowFullScreen
            />
          ))}
        </div>
      </section>

      {/* Мотивационни видеа */}
      <section className="max-w-5xl mx-auto mb-10 bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-blue-600 mb-6">
          🎥 Мотивационни видеа
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {motivationalVideos.map((v, i) => (
            <iframe
              key={i}
              className="w-full aspect-video rounded-xl shadow"
              src={v.src}
              title={v.title}
              allowFullScreen
            />
          ))}
        </div>
      </section>

      {/* Чести грешки */}
      <section className="max-w-5xl mx-auto mb-10 bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-rose-600 mb-6">
          ⚠️ Чести грешки
        </h2>
        <div className="grid sm:grid-cols-2 gap-6 text-gray-700">
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2 text-lg">
              🥗 Хранене
            </h3>
            <ul className="list-disc list-inside space-y-1">
              {nutritionMistakes.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2 text-lg">
              🏋️‍♂️ С тежести
            </h3>
            <ul className="list-disc list-inside space-y-1">
              {trainingMistakes.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto bg-orange-100 text-center rounded-2xl shadow p-10">
        <h2 className="text-2xl font-bold text-orange-700 mb-4">
          📌 Готов ли си за още?
        </h2>
        <p className="text-gray-700 mb-6 leading-relaxed">
          Регистрирай се, за да отключиш целия 7-дневен режим, детайлни макро-
          стойности и персонализирано проследяване на прогреса.
        </p>
        <Link
          to="/register"
          className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300"
        >
          🚀 Регистрирай се безплатно
        </Link>
      </section>
    </div>
  );
}