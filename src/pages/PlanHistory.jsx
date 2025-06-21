import React, { useState, useEffect } from 'react';
import api from '../services/api'; // Уверете се, че api.js е правилно конфигуриран
import { useAuth } from '../context/AuthContext'; // За да вземем user.id

function PlanHistory() {
  const [history, setHistory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // Взимаме текущия логнат потребител

  useEffect(() => {
    const fetchPlanHistory = async () => {
      setIsLoading(true);
      setError(null);

      if (!user || !user.id) {
        setError("Моля, влезте в профила си, за да видите историята на плановете.");
        setIsLoading(false);
        return;
      }

      try {
        // Заявка към новия API ендпойнт
        const response = await api.get('/plans/history'); // Не е нужно да подавате userId, бекендът го взима от JWT
        setHistory(response.data);
        console.log("История на плановете заредена:", response.data);
      } catch (err) {
        console.error("Грешка при зареждане на историята на плановете:", err);
        setError("Неуспешно зареждане на историята. Моля, опитайте отново по-късно.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlanHistory();
  }, [user]); // Зависи от user, за да се зареди, когато потребителят е наличен

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-lg text-gray-700 p-8 bg-white rounded-lg shadow-md flex items-center gap-4">
          <svg className="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Зареждане на историята...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center text-lg text-red-700 p-8 bg-white rounded-lg shadow-md">
          {error}
        </div>
      </div>
    );
  }

  // Проверка дали има данни за история
  if (!history || (history.nutritionPlans?.length === 0 && history.trainingPlans?.length === 0)) {
    return (
      <div className="text-center text-2xl mt-8 p-4 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
        <h1>История на Плановете</h1>
        <p className="text-gray-500 mt-4">Все още няма запазени предишни планове за вас.</p>
        <p className="text-gray-500">Започнете да използвате чатбота, за да генерирате планове!</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">📜 История на Плановете</h1>

      {history.nutritionPlans && history.nutritionPlans.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">🍽️ Хранителни режими</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {history.nutritionPlans.map((plan) => (
              <div key={plan.id} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                <p className="font-semibold text-lg text-blue-700 mb-1">
                  План от: {new Date(plan.dateGenerated).toLocaleDateString('bg-BG')}
                </p>
                <p className="text-gray-700">Цел: {plan.goalName || 'Неуточнена'}</p>
                <p className="text-gray-700">Калории: {plan.targetCalories ? plan.targetCalories.toFixed(0) : 'N/A'} kcal</p>
                <p className="text-gray-700">Протеини: {plan.protein ? plan.protein.toFixed(1) : 'N/A'}g</p>
                <p className="text-gray-700">Мазнини: {plan.fat ? plan.fat.toFixed(1) : 'N/A'}g</p>
                <p className="text-gray-700">Въглехидрати: {plan.carbohydrates ? plan.carbohydrates.toFixed(1) : 'N/A'}g</p>

                {/* --- НОВИ ДАННИ ЗА ПОТРЕБИТЕЛЯ (Nutrition Plan Snapshot) --- */}
                <p className="font-semibold mt-2 text-gray-700">Данни при генериране:</p>
                {plan.userGenderSnapshot && <p className="text-gray-700">Пол: {plan.userGenderSnapshot}</p>}
                {plan.userAgeSnapshot && <p className="text-gray-700">Възраст: {plan.userAgeSnapshot}</p>}
                {plan.userWeightSnapshot && <p className="text-gray-700">Тегло: {plan.userWeightSnapshot.toFixed(1)} кг</p>}
                {plan.userHeightSnapshot && <p className="text-gray-700">Височина: {plan.userHeightSnapshot.toFixed(0)} см</p>}
                {plan.userActivityLevelSnapshotName && <p className="text-gray-700">Активност: {plan.userActivityLevelSnapshotName}</p>}
                {plan.userDietTypeSnapshotName && <p className="text-gray-700">Тип диета: {plan.userDietTypeSnapshotName}</p>}
                {plan.userAllergiesSnapshot && plan.userAllergiesSnapshot.trim() !== '' && <p className="text-gray-700">Алергии: {plan.userAllergiesSnapshot}</p>}
                {plan.userOtherDietaryPreferencesSnapshot && plan.userOtherDietaryPreferencesSnapshot.trim() !== '' && <p className="text-gray-700">Други предпочитания: {plan.userOtherDietaryPreferencesSnapshot}</p>}
                {plan.userMeatPreferenceSnapshot && <p className="text-gray-700">Предпочитание за месо: {plan.userMeatPreferenceSnapshot}</p>}
                {plan.userConsumesDairySnapshot !== null && <p className="text-gray-700">Консумира млечни: {plan.userConsumesDairySnapshot ? 'Да' : 'Не'}</p>}
                {plan.userMealFrequencyPreferenceSnapshot && <p className="text-gray-700">Честота на хранения: {plan.userMealFrequencyPreferenceSnapshot}</p>}
                {/* --- КРАЙ НА НОВИ ДАННИ --- */}

                {/* Можете да добавите бутон за "Виж детайли", който да навигира към FullPlanPage за тази дата/ID */}
              </div>
            ))}
          </div>
        </section>
      )}

      {history.trainingPlans && history.trainingPlans.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">🏋️ Тренировъчни режими</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {history.trainingPlans.map((plan) => (
              <div key={plan.id} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                <p className="font-semibold text-lg text-green-700 mb-1">
                  План от: {new Date(plan.dateGenerated).toLocaleDateString('bg-BG')}
                </p>
                <p className="text-gray-700">Дни в седмицата: {plan.trainingDaysPerWeek}</p>
                <p className="text-gray-700">Продължителност: {plan.trainingDurationMinutes} мин.</p>

                {/* --- НОВИ ДАННИ ЗА ПОТРЕБИТЕЛЯ (Training Plan Snapshot) --- */}
                <p className="font-semibold mt-2 text-gray-700">Данни при генериране:</p>
                {plan.userGenderSnapshot && <p className="text-gray-700">Пол: {plan.userGenderSnapshot}</p>}
                {plan.userAgeSnapshot && <p className="text-gray-700">Възраст: {plan.userAgeSnapshot}</p>}
                {plan.userWeightSnapshot && <p className="text-gray-700">Тегло: {plan.userWeightSnapshot.toFixed(1)} кг</p>}
                {plan.userHeightSnapshot && <p className="text-gray-700">Височина: {plan.userHeightSnapshot.toFixed(0)} см</p>}
                {plan.userActivityLevelSnapshotName && <p className="text-gray-700">Активност: {plan.userActivityLevelSnapshotName}</p>}
                {/* Добавете и други специфични за тренировъчния план snapshot полета, ако сте ги добавили в DTO-то */}
                {/* plan.userTrainingTypeSnapshot && <p className="text-gray-700">Тип тренировка: {plan.userTrainingTypeSnapshot}</p> */}
                {/* plan.userLevelSnapshot && <p className="text-gray-700">Ниво: {plan.userLevelSnapshot}</p> */}
                {/* --- КРАЙ НА НОВИ ДАННИ --- */}

                {/* Можете да добавите бутон за "Виж детайли" */}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default PlanHistory;