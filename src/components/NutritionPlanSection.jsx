import React from "react";

export default function NutritionPlanSection({ nutritionPlan }) {
  if (!nutritionPlan || !nutritionPlan.meals?.length)
    return <Empty title="🍽️ Хранителен план" />;

  const {
    goalName, targetCalories, protein, fat, carbohydrates,
    dateGenerated, meals
  } = nutritionPlan;

  return (
    <section className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">🍽️ Хранителен план</h2>

      {/* обобщение */}
      <div className="mb-4 border-b pb-4 space-y-1 text-lg text-gray-700">
        <p><strong>Цел:</strong> {goalName}</p>
        <p><strong>Калории:</strong> {targetCalories.toFixed(0)} kcal</p>
        <p><strong>Протеин:</strong> {protein.toFixed(1)} g</p>
        <p><strong>Мазнини:</strong> {fat.toFixed(1)} g</p>
        <p><strong>Въглехидрати:</strong> {carbohydrates.toFixed(1)} g</p>
        <p className="text-sm text-gray-500">
          Генериран на: {new Date(dateGenerated).toLocaleDateString("bg-BG")}
        </p>
      </div>

      {/* хранения */}
      <h3 className="text-xl font-bold mb-3 text-gray-800">Подробности за храненията:</h3>
      <ul className="space-y-4">
        {meals.map((m)=>(
          <li key={m.id} className="p-4 border rounded-lg bg-gray-50 shadow-sm">
            <p className="text-lg font-semibold text-blue-700 mb-1">{m.mealType}</p>
            <p className="text-gray-700"><strong>Рецепта:</strong> {m.recipe?.name}</p>
            <p className="text-sm text-gray-500">Порция: {m.portionSize.toFixed(2)}</p>
            <p className="text-sm text-gray-500">Калории: {m.calculatedCalories.toFixed(0)} kcal</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

const Empty = ({title}) => (
  <section className="bg-white p-6 rounded-lg shadow-md mb-8 text-gray-500 italic">
    <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>
    Няма генериран план.
  </section>
);