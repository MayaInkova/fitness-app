import { useEffect, useState } from "react";
import api from "../services/api"; // <-- инстансът за заявки

export default function WeeklyNutritionPlan({ userId }) {
  const [weeklyPlan, setWeeklyPlan] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [error, setError] = useState(null);

  /* 1️⃣ – зареждаме / генерираме седмичния план */
  useEffect(() => {
    if (!userId) return;

    (async () => {
      try {
        const { data } = await api.post(
          `/nutrition-plans/generate-weekly/${userId}`
        );
        setWeeklyPlan(data);
        // по подразбиране отваряме първия ден
        const first = Object.keys(data.dailyPlans)[0];
        setSelectedDay(first);
      } catch (e) {
        console.error(e);
        setError("Не успях да заредя седмичния план.");
      }
    })();
  }, [userId]);

  /* UI състояния */
  if (error)
    return <p className="text-red-600 text-center mt-8">{error}</p>;

  if (!weeklyPlan)
    return <p className="text-center mt-8">Зареждане на седмичен план…</p>;

  /* помощна функция за превод */
  const prettyDay = (d) =>
    ({
      MONDAY: "Понеделник",
      TUESDAY: "Вторник",
      WEDNESDAY: "Сряда",
      THURSDAY: "Четвъртък",
      FRIDAY: "Петък",
      SATURDAY: "Събота",
      SUNDAY: "Неделя",
    }[d] || d);

  const days = Object.keys(weeklyPlan.dailyPlans);

  return (
    <div className="p-4 bg-white rounded shadow">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-4 border-b pb-2">
        {days.map((d) => (
          <button
            key={d}
            onClick={() => setSelectedDay(d)}
            className={`px-4 py-2 rounded ${
              selectedDay === d
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {prettyDay(d)}
          </button>
        ))}
      </div>

      {/* Daily plan */}
      {selectedDay && (
        <DayPanel
          plan={weeklyPlan.dailyPlans[selectedDay]}
          day={prettyDay(selectedDay)}
        />
      )}
    </div>
  );
}

/* изнесено за четимост */
function DayPanel({ plan, day }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-green-700">
        {day} – {plan.targetCalories.toFixed(0)} kcal
      </h2>

      <ul className="space-y-2">
        {plan.meals.map((m) => (
          <li key={m.id} className="p-3 bg-gray-50 border rounded">
            <div>
              <strong>{m.mealType}</strong>: {m.recipe.name} —{" "}
              {m.calculatedCalories.toFixed(0)} kcal
            </div>

            {/* ↓↓↓ нов ред – описание на рецептата */}
            {m?.recipe?.description && (
              <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">
                {m.recipe.description}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}