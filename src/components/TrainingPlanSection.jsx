import React from 'react';

// trainingPlan пропът вече приема целия DailyTrainingPlanDTO обект
export default function TrainingPlanSection({ trainingPlan }) {
  // Коригирано: Достъпваме директно пропса, тъй като той вече е DailyTrainingPlanDTO
  const dailyTrainingPlan = trainingPlan;

  // Проверяваме дали има данни за тренировъчен план или сесии
  if (!dailyTrainingPlan || !dailyTrainingPlan.trainingSessions || dailyTrainingPlan.trainingSessions.length === 0) {
    return (
      <section className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">💪 Тренировъчен план</h2>
        <p className="text-gray-500 italic">Няма генериран тренировъчен план или тренировъчни сесии.</p>
      </section>
    );
  }

  return (
    <section className="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">🏋️ Тренировъчен план</h2>

      {/* Обща информация за плана - сега достъпваме от dailyTrainingPlan */}
      <div className="mb-6 border-b pb-4">
        <p className="text-lg text-gray-700">
          {/* Достъпваме от dailyTrainingPlan */}
          <strong>Дни в седмицата:</strong> {dailyTrainingPlan.trainingDaysPerWeek || 'Неуточнени'}
        </p>
        <p className="text-lg text-gray-700">
          {/* Достъпваме от dailyTrainingPlan */}
          <strong>Средна продължителност:</strong> {dailyTrainingPlan.trainingDurationMinutes || 'Неуточнени'} минути на сесия
        </p>
        <p className="text-sm text-gray-500 mt-2">
          План, генериран на: {dailyTrainingPlan.dateGenerated // Достъпваме от dailyTrainingPlan
            ? new Date(dailyTrainingPlan.dateGenerated).toLocaleDateString('bg-BG')
            : 'Неизвестна дата'}
        </p>
      </div>

      {/* Итерираме през TrainingSessionDTOs от dailyTrainingPlan */}
      {dailyTrainingPlan.trainingSessions
        .sort((a, b) => {
          // Дефинираме ред за дните от седмицата
          const daysOrder = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
          const dayA = a.dayOfWeek ? a.dayOfWeek.toUpperCase() : "";
          const dayB = b.dayOfWeek ? b.dayOfWeek.toUpperCase() : "";
          return daysOrder.indexOf(dayA) - daysOrder.indexOf(dayB);
        })
        .map((session, sessionIndex) => (
          <div key={session.id || sessionIndex} className="mb-6 p-4 border rounded-md bg-gray-50 last:mb-0">
            <h3 className="text-xl font-semibold text-blue-700 mb-3">
              🗓️ {session.dayOfWeek ? session.dayOfWeek.charAt(0).toUpperCase() + session.dayOfWeek.slice(1).toLowerCase() : 'Неуточнен ден'}
              <span className="text-gray-600 text-base ml-2">({session.durationMinutes} мин.)</span>
            </h3>
            {session.exercises && session.exercises.length > 0 ? (
              <ul className="list-disc ml-6 space-y-2 text-gray-700">
                {/* Итерираме през ExerciseDTOs */}
                {session.exercises.map((exercise, exerciseIndex) => (
                  <li key={exercise.id || exerciseIndex} className="text-base leading-relaxed">
                    <strong>{exercise.name}</strong> - {exercise.description} ({exercise.sets} серии по {exercise.reps} повторения)
                    {exercise.durationMinutes > 0 && ` (${exercise.durationMinutes} мин.)`}
                    {/* Приемаме, че difficultyLevel може да е директно стойност или обект с displayName */}
                    {exercise.difficultyLevel && <span className="ml-2 text-sm text-gray-500">[{exercise.difficultyLevel.displayName || exercise.difficultyLevel}]</span>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">Няма упражнения за тази сесия.</p>
            )}
          </div>
        ))}
    </section>
  );
}
