import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NutritionPlanSection from "../components/NutritionPlanSection";
import TrainingPlanSection  from "../components/TrainingPlanSection";
import WeeklyNutritionPlan  from "../components/WeeklyNutritionPlan"; // 🆕 импорт
import api   from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function PlanTabs() {
  /* ---------- state ---------- */
  const [tab, setTab]           = useState(() => localStorage.getItem("activeTab") || "nutrition");
  const [plan, setPlan]         = useState(null);   // цялото FullPlanDTO
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const navigate                = useNavigate();
  const { user }                = useAuth();

  /* ---------- помощна проверка – планът е „пълен“  ---------- */
  const isFullPlan = (p) =>
    p &&
    p.nutritionPlanId &&
    p.meals && p.meals.length > 0 &&
    p.trainingPlanId &&
    p.trainingSessions && p.trainingSessions.length > 0;

  /* ---------- fetch ---------- */
  useEffect(() => {
    const load = async () => {
      setLoading(true); setError(null);

      /* 1) sessionStorage cache */
      const cached = sessionStorage.getItem("fullPlan");
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (isFullPlan(parsed)) { setPlan(parsed); setLoading(false); return; }
          sessionStorage.removeItem("fullPlan");
        } catch { sessionStorage.removeItem("fullPlan"); }
      }

      /* 2) API */
      if (!user?.id) { setError("Нямате активен план."); setLoading(false); return; }
      try {
        const { data } = await api.get(`/nutrition-plans/full`, { params:{ userId:user.id } });
        if (isFullPlan(data)) {
          setPlan(data);
          sessionStorage.setItem("fullPlan", JSON.stringify(data));
        } else {
          setError("Планът още не е генериран – използвайте чатбота.");
        }
      } catch (e) {
        setError("Грешка при зареждане на плана."); console.error(e);
      }
      setLoading(false);
    };
    load();
  }, [user]);

  /* ---------- UI състояния ---------- */
  if (loading) return <Loader />;
  if (error)   return <ErrorBox msg={error} onChat={() => navigate("/chatbot")} />;
  if (!isFullPlan(plan)) return <ErrorBox msg="Няма пълен план." onChat={() => navigate("/chatbot")} />;

  /* ---------- рендер ---------- */
  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white shadow rounded p-6">
      {/* tabs */}
      <div className="flex gap-4 mb-6 border-b pb-2">
        <TabBtn active={tab==="nutrition"} onClick={()=>{setTab("nutrition"); localStorage.setItem("activeTab","nutrition")}}>📝 Хранителен режим</TabBtn>
        <TabBtn active={tab==="training"}  onClick={()=>{setTab("training");  localStorage.setItem("activeTab","training")}}>🏋️ Тренировки</TabBtn>
        {/* 🆕 седмичен таб */}
        <TabBtn active={tab==="weekly"}    onClick={()=>{setTab("weekly");    localStorage.setItem("activeTab","weekly")}}>📆 Седмичен режим</TabBtn>

        <button onClick={() => navigate("/history")}
                className="ml-auto text-blue-600 underline hover:text-blue-800 text-sm">
          📜 История
        </button>
      </div>

      {tab==="nutrition" && <NutritionPlanSection nutritionPlan={plan}     />}
      {tab==="training"   && <TrainingPlanSection  trainingPlan={plan}     />}
      {tab==="weekly"     && <WeeklyNutritionPlan  userId={user.id}        />}
    </div>
  );
}

/* ---------- помощни компоненти ---------- */
const TabBtn = ({active,children,onClick}) => (
  <button onClick={onClick}
          className={`px-4 py-2 font-semibold rounded-t ${active?
            "border-b-2 border-green-600 text-green-700":"text-gray-500"}`}> 
    {children}
  </button>
);

const Loader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex items-center gap-3 text-lg text-gray-700 bg-white px-6 py-4 rounded shadow">
      <svg className="animate-spin h-6 w-6 text-blue-500" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/></svg>
      Зареждане...
    </div>
  </div>
);

const ErrorBox = ({msg,onChat}) => (
  <div className="min-h-screen flex items-center justify-center bg-red-50">
    <div className="text-center bg-white p-8 rounded shadow text-red-700">
      {msg}
      <button onClick={onChat}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Към Чатбота
      </button>
    </div>
  </div>
);
