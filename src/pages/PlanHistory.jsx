import React, { useEffect, useState } from "react";
import { CalendarDays, Dumbbell, ScrollText } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

/*
  PlanHistoryPage — напълно обновена страница „История на плановете“
  -----------------------------------------------------------------
  • Взима history от /plans/history
  • Показва Nutrition + Training карти с модерна визия
  • Graceful states: loading, error, empty
*/

export default function PlanHistoryPage() {
  const { user } = useAuth();
  const [history, setHistory]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      if (!user?.id) {
        setError("Моля, влезте в профила си, за да видите историята на плановете.");
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get("/plans/history");
        setHistory(data);
      } catch (e) {
        setError("Неуспешно зареждане. Опитайте пак по‑късно.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  /* ─── states ─────────────────────────────────────────────────── */
  if (loading) return <FullscreenMessage text="Зареждане на историята…" />;
  if (error)   return <FullscreenMessage text={error} error />;
  if (!history || (!history.nutritionPlans?.length && !history.trainingPlans?.length)) {
    return <FullscreenMessage text="Все още няма запазени планове." />;
  }

  /* ─── render ─────────────────────────────────────────────────── */
  return (
    <section className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h1 className="text-3xl font-extrabold flex items-center gap-2 text-orange-600 mb-10">
        <ScrollText size={28}/> История на плановете
      </h1>

      {history.nutritionPlans?.length > 0 && (
        <HistoryBlock
          title="🍽️ Хранителни режими"
          iconColor="text-pink-600"
          plans={history.nutritionPlans}
          type="nutrition"
        />
      )}

      {history.trainingPlans?.length > 0 && (
        <HistoryBlock
          title="🏋️ Тренировъчни режими"
          iconColor="text-green-600"
          plans={history.trainingPlans}
          type="training"
        />
      )}
    </section>
  );
}

/* ───────────────── helpers ────────────────────────────────────── */
const FullscreenMessage = ({ text, error=false }) => (
  <div className={`min-h-screen flex items-center justify-center ${error?"bg-red-50":"bg-gray-50"}`}>
    <div className={`p-8 rounded-lg shadow-md ${error?"text-red-700 bg-white":"text-gray-700 bg-white"}`}>{text}</div>
  </div>
);

const HistoryBlock = ({ title, plans, type }) => (
  <section className="mb-12">
    <h2 className="text-2xl font-bold mb-6 text-gray-800">{title}</h2>
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {plans.map(p => (
        <HistoryCard key={p.id} plan={p} type={type}/>
      ))}
    </div>
  </section>
);

const HistoryCard = ({ plan, type }) => {
  const dateStr = new Date(plan.dateGenerated).toLocaleDateString("bg-BG");
  return (
    <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-5 shadow-sm">
      <p className="flex items-center gap-2 font-semibold text-blue-700 mb-3">
        <CalendarDays size={18}/> План от: {dateStr}
      </p>

      {type === "nutrition" ? <NutritionDetails p={plan}/> : <TrainingDetails p={plan}/>}
    </div>
  );
};

const NutritionDetails = ({ p }) => (
  <>
    <MacroRow label="Цел"                value={p.goalName}/>
    <MacroRow label="Калории"            value={`${p.targetCalories?.toFixed(0)} kcal`}/>
    <MacroRow label="Протеини"           value={`${p.protein?.toFixed(1)} g`}/>
    <MacroRow label="Мазнини"            value={`${p.fat?.toFixed(1)} g`}/>
    <MacroRow label="Въглехидрати"       value={`${p.carbohydrates?.toFixed(1)} g`}/>

    <SectionTitle>Данни при генериране</SectionTitle>
    {p.userGenderSnapshot &&    <MacroRow label="Пол"            value={p.userGenderSnapshot}/>}
    {p.userAgeSnapshot &&       <MacroRow label="Възраст"        value={`${p.userAgeSnapshot} г.`}/>} 
    {p.userWeightSnapshot &&    <MacroRow label="Тегло"          value={`${p.userWeightSnapshot.toFixed(1)} кг`}/>} 
    {p.userHeightSnapshot &&    <MacroRow label="Височина"       value={`${p.userHeightSnapshot.toFixed(0)} см`}/>} 
    {p.userActivityLevelSnapshotName && <MacroRow label="Активност" value={p.userActivityLevelSnapshotName}/>}
    {p.userDietTypeSnapshotName && <MacroRow label="Тип диета" value={p.userDietTypeSnapshotName}/>}
    {p.userMeatPreferenceSnapshot && <MacroRow label="Месо" value={p.userMeatPreferenceSnapshot}/>}
    {p.userConsumesDairySnapshot!==null && <MacroRow label="Млечни" value={p.userConsumesDairySnapshot?"Да":"Не"}/>}
    {p.userMealFrequencyPreferenceSnapshot && <MacroRow label="Хранения" value={p.userMealFrequencyPreferenceSnapshot}/>}
  </>
);

const TrainingDetails = ({ p }) => (
  <>
    <MacroRow label="Дни/седмица" value={p.trainingDaysPerWeek}/>
    <MacroRow label="Продължителност" value={`${p.trainingDurationMinutes} мин.`}/>

    <SectionTitle>Данни при генериране</SectionTitle>
    {p.userGenderSnapshot && <MacroRow label="Пол" value={p.userGenderSnapshot}/>}
    {p.userAgeSnapshot &&    <MacroRow label="Възраст" value={`${p.userAgeSnapshot} г.`}/>}
    {p.userWeightSnapshot && <MacroRow label="Тегло" value={`${p.userWeightSnapshot.toFixed(1)} кг`}/>}
    {p.userHeightSnapshot && <MacroRow label="Височина" value={`${p.userHeightSnapshot.toFixed(0)} см`}/>}
    {p.userActivityLevelSnapshotName && <MacroRow label="Активност" value={p.userActivityLevelSnapshotName}/>}
  </>
);

const SectionTitle = ({ children }) => (
  <p className="font-semibold text-gray-600 mt-4 mb-2">{children}:</p>
);

const MacroRow = ({ label, value }) => (
  <p className="text-gray-700 text-sm">
    <span className="font-medium">{label}:</span> {value || "N/A"}
  </p>
);
