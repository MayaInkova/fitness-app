import React from "react";
import { Dumbbell } from "lucide-react";
import { motion } from "framer-motion";

/* ──────────────────────────────────────────────────────────── */
/* Константи                                                   */
/* ──────────────────────────────────────────────────────────── */

const DAYS_ORDER = ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"];
const DAYS_BG = {
  MONDAY:"Понеделник",TUESDAY:"Вторник",WEDNESDAY:"Сряда",
  THURSDAY:"Четвъртък",FRIDAY:"Петък",SATURDAY:"Събота",SUNDAY:"Неделя",
};
const DAY_COL = {
  MONDAY:"bg-pink-500",TUESDAY:"bg-amber-400",WEDNESDAY:"bg-emerald-500",
  THURSDAY:"bg-sky-500",FRIDAY:"bg-violet-500",SATURDAY:"bg-lime-500",SUNDAY:"bg-rose-500",
};
const DIFF_COL = { BEGINNER:"text-emerald-600",INTERMEDIATE:"text-yellow-600",ADVANCED:"text-rose-600" };
const EMOJI = { Планк:"🧍‍♀️","Глутеус мост":"🍑",Клякания:"🦵","Лицеви опори":"🙌",Коремни:"🤸" };

/* ──────────────────────────────────────────────────────────── */
/* Компонент                                                   */
/* ──────────────────────────────────────────────────────────── */
export default function TrainingPlanSection({ trainingPlan }) {
  /* guard */
  if (!trainingPlan?.trainingSessions?.length)
    return (
      <section className="mt-8 bg-white p-6 rounded-xl shadow-md text-center">
        <h2 className="text-2xl font-bold text-gray-800">💪 Тренировъчен план</h2>
        <p className="text-gray-500 italic mt-2">Няма генериран план.</p>
      </section>
    );

  return (
    <section className="mt-8 bg-white rounded-2xl shadow-lg p-6">
      {/* Заглавие + резюме */}
      <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
        <Dumbbell className="text-green-600" /> Тренировъчен план
      </h2>
      <p className="text-gray-600 mb-6">
        Потребителят е избрал да тренира <strong>{trainingPlan.trainingDaysPerWeek || 5}</strong> дни седмично,
        отделяйки по <strong>{trainingPlan.trainingDurationMinutes || 30} минути</strong> на ден.
      </p>

      {/* Сесии по дни */}
      <div className="grid gap-6">
        {trainingPlan.trainingSessions
          .slice()
          .sort((a,b)=>DAYS_ORDER.indexOf(a.dayOfWeek)-DAYS_ORDER.indexOf(b.dayOfWeek))
          .map((s)=>(
            <motion.article
              key={s.id}
              whileHover={{ y:-4 }}
              className="relative p-5 rounded-xl bg-gray-50 hover:bg-white shadow transition"
            >
              <span className={`absolute inset-y-0 left-0 w-1.5 rounded-l-xl ${DAY_COL[s.dayOfWeek]||"bg-gray-400"}`} />
              <h3 className="text-lg sm:text-xl font-semibold text-blue-700 mb-3 flex items-center gap-2">
                🗓️ {DAYS_BG[s.dayOfWeek]}{" "}
                <span className="text-gray-500 text-base ml-1">({s.durationMinutes} мин.)</span>
              </h3>

              {s.exercises?.length ? (
                <ul className="space-y-2">
                  {s.exercises.map((ex)=>(
                    <li key={ex.id} className="flex gap-3 items-start leading-relaxed">
                      <span className="w-6 text-center select-none text-xl">{EMOJI[ex.name]||"🏋️"}</span>
                      <span>
                        <span className="font-medium">{ex.name}</span>{" "}
                        – {ex.sets}×{ex.reps}
                        {ex.durationMinutes ? ` • ${ex.durationMinutes} мин.` : ""}
                        {ex.difficultyLevel && (
                          <span className={`ml-2 text-sm font-medium ${DIFF_COL[ex.difficultyLevel]||"text-gray-500"}`}>
                            [{typeof ex.difficultyLevel==="string"
                                ? ex.difficultyLevel
                                : ex.difficultyLevel.displayName}]
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="italic text-gray-500">Няма упражнения за този ден.</p>
              )}
            </motion.article>
          ))}
      </div>

      {/* Финална информативна секция */}
      <div className="mt-10 p-6 bg-gray-50 rounded-xl border text-gray-700">
        <h3 className="text-lg font-semibold mb-2">💡 Защо тренировките са важни?</h3>
        <p className="text-sm leading-relaxed">
          Редовната физическа активност подобрява издръжливостта, силата и гъвкавостта,
          повишава настроението и качеството на съня, а също така намалява риска от хронични
          заболявания като диабет, хипертония и депресия. Само 30&nbsp;минути движение на ден
          са достатъчни, за да поддържате здраво тяло и бистър ум.
        </p>
      </div>
    </section>
  );
}