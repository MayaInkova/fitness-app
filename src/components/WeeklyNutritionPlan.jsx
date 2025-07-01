// WeeklyNutritionPlan.jsx – v4 (working paths + minor fixes)
import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Flame, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ───────────────────────── Helpers / constants ───────────────────────── */

const DAY_BG = {
  MONDAY:    "bg-emerald-50",
  TUESDAY:   "bg-orange-50",
  WEDNESDAY: "bg-yellow-50",
  THURSDAY:  "bg-sky-50",
  FRIDAY:    "bg-fuchsia-50",
  SATURDAY:  "bg-rose-50",
  SUNDAY:    "bg-indigo-50",
};

const MEAL_LABELS = {
  BREAKFAST: { label: "Закуска", emoji: "🥞", time: "06:00 - 09:00" }, // Добавено време
  LUNCH:     { label: "Обяд",     emoji: "🍲", time: "12:00 - 14:00" }, // Добавено време
  DINNER:    { label: "Вечеря",   emoji: "🍛", time: "18:00 - 20:00" }, // Добавено време
  SNACK:     { label: "Снак",     emoji: "🥜", time: "10:00 - 17:00" }, // Добавено примерно време за снакове
};

const BORDER_MAP = {
  BREAKFAST: "bg-yellow-300",
  LUNCH:     "bg-green-300",
  DINNER:    "bg-indigo-300",
  SNACK:     "bg-pink-300",
};

const getCalorieClass = (k) =>
  k < 500 ? "text-emerald-600" : k <= 700 ? "text-yellow-600" : "text-rose-600";

/* prettify BG label */
const DAY_LABEL_BG = {
  MONDAY:    "Понеделник",
  TUESDAY:   "Вторник",
  WEDNESDAY: "Сряда",
  THURSDAY:  "Четвъртък",
  FRIDAY:    "Петък",
  SATURDAY:  "Събота",
  SUNDAY:    "Неделя",
};

/* API prefix (axios instance in api.js има baseURL='/api') */
const API_PREFIX = "/nutrition-plans";

/* ───────────────────────── Main component ───────────────────────── */

export default function WeeklyNutritionPlan({ userId }) {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  /* fetch on mount / userId change */
  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    api
      .get(`${API_PREFIX}/weekly/${userId}`)
      .then((res) => setData(res.data))
      .catch((e) =>
        setError(e.response?.data?.message || "Грешка при зареждането"))
      .finally(() => setLoading(false));
  }, [userId]);

  /* basic states */
  if (loading) return <p className="p-6 text-gray-600">Зареждане…</p>;
  if (error)   return <p className="p-6 text-rose-600">{error}</p>;
  if (!data)   return null;

  /* preserve order (LinkedHashMap от бекенда) */
  return (
    <div className="space-y-14">
      {Object.entries(data.dailyPlans).map(([dayKey, plan]) => (
        <DayPanel
          key={dayKey}
          dayKey={dayKey}
          dayLabel={DAY_LABEL_BG[dayKey] || dayKey}
          plan={plan}
          onSwap={(meal) => handleSwap(meal)}
        />
      ))}
    </div>
  );

  /* ───── handlers ───── */
  function handleSwap(meal) {
    const substituteId = prompt("ID на рецепта за замяна?");
    if (!substituteId) return;

    api
      .put(`${API_PREFIX}/${data.id}/replace-meal`, {
        originalMealId: meal.id,
        substituteRecipeId: substituteId,
      })
      .then((res) => setData(res.data))
      .catch(() => alert("Грешка при замяната"));
  }
}

/* ───────────────────────── DayPanel ───────────────────────── */

function DayPanel({ plan, dayKey, dayLabel, onSwap }) {
  return (
    <section
      className={`p-6 rounded-xl ${DAY_BG[dayKey] || "bg-gray-50"} shadow-sm`}
    >
      <header className="flex items-center justify-between border-b pb-2">
        <h2 className="text-2xl font-semibold text-green-700 flex items-center gap-2">
          📅 {dayLabel}
        </h2>
        <span className={`font-semibold ${getCalorieClass(plan.targetCalories)}`}>
          {plan.targetCalories.toFixed(0)} kcal
        </span>
      </header>

      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {plan.meals.map((m) => (
          <MealCard key={m.id} meal={m} onSwap={onSwap} />
        ))}
      </ul>
    </section>
  );
}

/* ───────────────────────── MealCard ───────────────────────── */

function MealCard({ meal, onSwap }) {
  const [open, setOpen] = useState(false);

  const meta   = MEAL_LABELS[meal.mealType] || { label: meal.mealType, emoji: "🍽️", time: "" };
  const border = BORDER_MAP[meal.mealType]   || "bg-gray-300";

  return (
    <motion.li
      whileHover={{ y: -4 }}
      className="relative p-5 rounded-xl bg-gray-50 hover:bg-white shadow transition"
    >
      {/* цветна лента вляво */}
      <span className={`absolute inset-y-0 left-0 w-1.5 rounded-l-xl ${border}`} />

      {/* header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold flex items-center gap-2">
            <span className="text-xl">{meta.emoji}</span>
            {meta.label}
          </h3>
          <span className="text-xs text-gray-500">{meta.time}</span>
        </div>

        <div className="text-right">
          <span
            className={`inline-flex items-center gap-1 text-sm font-medium ${getCalorieClass(
              meal.calculatedCalories
            )}`}
          >
            <Flame size={14} /> {meal.calculatedCalories.toFixed(0)} kcal
          </span>
          <div className="text-xs text-gray-500 mt-1">
            🥩 {meal.calculatedProtein.toFixed(0)}g 🍞{" "}
            {meal.calculatedCarbs.toFixed(0)}g 🧈{" "}
            {meal.calculatedFat.toFixed(0)}g
          </div>
        </div>
      </div>

      {/* Recipe name + portion */}
      <p className="text-gray-800 mt-2 leading-snug">
        <strong>{meal.recipe.name}</strong>
        <span className="text-xs text-gray-500 ml-1">
          (порция × {meal.portionSize.toFixed(2)})
        </span>
      </p>

      {/* short description */}
      {meal.recipe.description && (
        <p className="text-sm text-gray-600 mt-2 line-clamp-3">
          {meal.recipe.description}
        </p>
      )}

      {/* actions */}
      <div className="flex justify-between items-center mt-4 text-sm">
        {meal.hasAlternatives && (
          <button
            onClick={() => onSwap(meal)}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            🔁 Замени
          </button>
        )}
        {meal.recipe.ingredients?.length > 0 && (
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-800"
          >
            {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}{" "}
            {open ? "Скрий" : "Детайли"}
          </button>
        )}
      </div>

      {/* collapsible details */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="details"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-4 text-sm text-gray-700 overflow-hidden"
          >
            {/* Ingredients */}
            {meal.recipe.ingredients?.length > 0 && (
              <div className="mb-3">
                <h4 className="font-semibold mb-1">Необходими продукти:</h4>
                <ul className="list-disc pl-5 space-y-0.5">
                  {meal.recipe.ingredients.map((ing) => (
                    <li key={ing.id}>
                      {ing.foodItem.name}
                      {ing.quantityGrams && <> – {ing.quantityGrams} g</>}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Instructions */}
            {meal.recipe.instructions && (
              <div>
                <h4 className="font-semibold mb-1">Начин на приготвяне:</h4>
                <p className="whitespace-pre-line leading-relaxed">
                  {meal.recipe.instructions}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}
