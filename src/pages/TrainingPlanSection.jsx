import React from 'react';

// trainingPlan вече е обект TrainingPlanDTO, а не просто масив от стрингове
export default function TrainingPlanSection({ trainingPlan }) {
  if (!trainingPlan || !trainingPlan.trainingSessions || trainingPlan.trainingSessions.length === 0) {
    return null; // Връщаме null, ако няма тренировъчен план или сесии
  }

  return (
    <section className="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">🏋️ Тренировъчен план</h2>

      {/* Обща информация за плана */}
      <div className="mb-6 border-b pb-4">
        <p className="text-lg text-gray-700">
          <strong>Дни в седмицата:</strong> {trainingPlan.daysPerWeek || 'Неуточнени'}
        </p>
        <p className="text-lg text-gray-700">
          <strong>Средна продължителност:</strong> {trainingPlan.durationMinutes || 'Неуточнени'} минути на сесия
        </p>
        <p className="text-sm text-gray-500 mt-2">
          План, генериран на: {trainingPlan.dateGenerated ? new Date(trainingPlan.dateGenerated).toLocaleDateString('bg-BG') : 'Неизвестна дата'}
        </p>
      </div>

      {/* Итерираме през TrainingSessionDTOs */}
      {trainingPlan.trainingSessions
        .sort((a, b) => a.dayOfWeek.localeCompare(b.dayOfWeek)) // Сортираме по ден от седмицата, ако е необходимо
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
                  {exercise.difficultyLevel && <span className="ml-2 text-sm text-gray-500">[{exercise.difficultyLevel}]</span>}
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