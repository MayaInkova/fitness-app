import React from "react";
import TrainingPlanSection from "../components/TrainingPlanSection";

const NutritionPlanPage = ({ nutritionPlan }) => {
  if (!nutritionPlan) return <p>Няма наличен план.</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">🍽️ Хранителен план</h1>
      <p>Калории: {nutritionPlan.calories}</p>
      <p>Протеин: {nutritionPlan.protein}g</p>
      <p>Мазнини: {nutritionPlan.fat}g</p>
      <p>Въглехидрати: {nutritionPlan.carbs}g</p>
      <p>Цел: {nutritionPlan.goal}</p>
      <TrainingPlanSection trainingPlan={nutritionPlan.trainingPlan} />
    </div>
  );
};

export default NutritionPlanPage;
