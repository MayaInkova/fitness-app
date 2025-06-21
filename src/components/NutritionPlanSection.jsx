import React from "react";
import {
  Flame,
  Salad,
  Soup,
  Sandwich,
  Egg,
  Droplet,
  Wheat
} from "lucide-react"; // икони
import { motion } from "framer-motion";

/* ────────────────────────────────────────────────
   NutritionPlanSection — polish v3 (диети + по‑яки карти)
──────────────────────────────────────────────── */

// 🥗 Мапове за бърз рендер на храненията ------------------------------------
const MEAL_LABELS = {
  BREAKFAST: { bg: "bg-amber-400", label: "Закуска", icon: <Salad size={16} /> },
  LUNCH:     { bg: "bg-sky-400",   label: "Обяд",    icon: <Sandwich size={16} /> },
  DINNER:    { bg: "bg-violet-500", label: "Вечеря",  icon: <Soup size={16} /> },
  SNACK:     { bg: "bg-lime-500",   label: "Снак",    icon: <Salad size={16} /> },
};

// 🎨 Цвят според калориите ----------------------------------------------------
const kcalColor = (k)=> k<400?"text-emerald-600":k<=700?"text-yellow-600":"text-rose-600";

// 🧭 Икона за различните диети (по избор може да разшириш)
const DIET_ICONS = {
  "Кето": "🥓",
  "Веган": "🌱",
  "Палео": "🦴",
  "Вегетарианска": "🥦",
  "Протеинова": "💪",
  "Балансирана": "⚖️",
};

export default function NutritionPlanSection({ nutritionPlan }){
  if(!nutritionPlan?.meals?.length) return <Empty title="🍽️ Хранителен план"/>;

  const {
    goalName,
    targetCalories,
    protein,
    fat,
    carbohydrates,
    dateGenerated,
    meals,
    dietTypeName,
    dietTypeDescription
  } = nutritionPlan;

  return (
    <section className="mt-8 bg-white rounded-2xl shadow-lg p-6">

      {/* Заглавие + резюме */}
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-1">
        🍽️ Хранителен план
      </h2>
      <p className="text-gray-600 mb-6 leading-relaxed">
        Планът е съобразен с целта <strong>{goalName}</strong> и балансира <strong>{targetCalories.toFixed(0)} kcal</strong> на ден.
        Добрата хранителна стратегия поддържа енергията през деня, подпомага възстановяването след тренировка и е ключова
        за постигане на дългосрочни резултати.
      </p>

      {/* Диета */}
      {dietTypeName && (
        <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-green-50 to-white border border-green-200 shadow-sm">
          <h4 className="text-lg font-semibold text-green-700 mb-1 flex items-center gap-2">
            <span className="text-xl select-none">{DIET_ICONS[dietTypeName] || "🥗"}</span>
            Избрана диета: {dietTypeName}
          </h4>
          <p className="text-sm text-gray-700 leading-relaxed">{dietTypeDescription || "Описание не е налично."}</p>
        </div>
      )}

      {/* Макро обобщение */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mb-10">
        <Stat label="Калории" value={`${targetCalories.toFixed(0)} kcal`} icon={<Flame size={18}/>}/>
        <Stat label="Протеин" value={`${protein.toFixed(1)} g`} icon={<Egg size={18}/>}/>
        <Stat label="Мазнини" value={`${fat.toFixed(1)} g`} icon={<Droplet size={18}/>}/>
        <Stat label="Въглехидрати" value={`${carbohydrates.toFixed(1)} g`} icon={<Wheat size={18}/>}/>
      </div>

      {/* Хранения */}
      <h3 className="text-xl font-semibold mb-4">Подробности за храненията</h3>
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {meals.map(m=>{
          const meta = MEAL_LABELS[m.mealType] || { bg:"bg-gray-400", label:m.mealType };
          return (
            <motion.li key={m.id} whileHover={{y:-4}} className="relative p-5 rounded-xl bg-gray-50 hover:bg-white shadow transition">
              <span className={`absolute inset-y-0 left-0 w-1.5 rounded-l-xl ${meta.bg}`} />

              <div className="mb-1 flex items-center gap-2 font-semibold text-blue-700">
                {meta.icon} {meta.label}
              </div>

              <p className="text-gray-800 leading-snug">
                <strong>Рецепта:</strong> {m.recipe?.name || "-"}
                <span className={`inline-flex items-center gap-1 ml-1 ${kcalColor(m.calculatedCalories)}`}>
                  <Flame size={14}/> {m.calculatedCalories.toFixed(0)}
                </span>
              </p>

              <p className="text-xs text-gray-500 mt-0.5">Порция: {m.portionSize.toFixed(2)}</p>

              {m.recipe?.description && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-3 whitespace-pre-line">{m.recipe.description}</p>
              )}
            </motion.li>
          );
        })}
      </ul>

      {/* Информационен блок */}
      <div className="mt-12 p-6 bg-gray-50 border rounded-xl text-gray-700 shadow-sm">
        <h4 className="font-semibold mb-2">💡 Защо балансираната диета е важна?</h4>
        <p className="text-sm leading-relaxed">
          Качествените макро- и микро‑нутриенти осигуряват стабилна енергия, подкрепят имунитета и подпомагат
          възстановяването на мускулите. Комбинирайки протеин, бавни въглехидрати и полезни мазнини, поддържате
          чувство за ситост и стабилна кръвна захар през целия ден. Планирайте храненията около тренировка, за да
          максимизирате ефекта – лека закуска с протеин 60‑90 мин. преди и пълноценно ястие до 2 ч. след сесията.
        </p>
      </div>

      <p className="mt-4 text-xs text-gray-400 text-right">Генериран на: {new Date(dateGenerated).toLocaleDateString("bg-BG")}</p>
    </section>
  );
}

/* ─────────── helpers ─────────── */
// 🎨 цветове на картите
const COLOR_MAP = {
  "Калории": "from-rose-50 to-rose-100 border-rose-200 text-rose-600",
  "Протеин": "from-emerald-50 to-emerald-100 border-emerald-200 text-emerald-600",
  "Мазнини": "from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-600",
  "Въглехидрати": "from-sky-50 to-sky-100 border-sky-200 text-sky-600",
};

const Stat = ({ label, value, icon }) => (
  <div className={`p-4 rounded-xl border bg-gradient-to-br ${COLOR_MAP[label] || "from-gray-50 to-white border-gray-200"} flex flex-col items-center shadow-sm`}>
    <span className="mb-1">{icon}</span>
    <p className="text-xs uppercase tracking-wide font-medium mb-0.5 text-gray-500">{label}</p>
    <p className="font-semibold text-gray-800">{value}</p>
  </div>
);

const Empty = ({title})=> (
  <section className="bg-white p-6 rounded-xl shadow-md text-center text-gray-500 italic">
    <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
    Няма генериран план.
  </section>
);
