import React, { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import logo from "../images/logome.png"; // Assuming this path is correct

/**
 * ProfilePage Component
 *
 * This component provides a professional user profile interface, featuring:
 * - A dynamic user avatar (initials or image).
 * - A form for updating core profile information (weight, height, age, gender, etc.).
 * - An interactive progress tracking section with an SVG mini-chart.
 * - Metric selection (weight, calories, body fat) for the progress chart.
 * - A lightweight form to add new progress entries.
 * - Password change functionality link.
 * - Clear navigation for saving changes and logging out.
 *
 * It utilizes Tailwind CSS for styling and react-toastify for notifications.
 * This version introduces a pleasant background color to enhance visual appeal.
 */
export default function ProfilePage() {
    /* ───────── State Management ───────── */
    const [profile, setProfile] = useState({
        email: "", // Добавено: Имейл от DTO
        fullName: "", // Добавено: Пълно име от DTO
        weight: "",
        height: "",
        age: "",
        gender: "", // Все още string
        activityLevel: "", // Добавено: String name
        dietType: "", // Добавено: String name
        meatPreference: "", // Добавено: String name
        consumesDairy: false, // Добавено: Boolean
        allergies: [], // Добавено: Array of strings
        otherDietaryPreferences: [], // Добавено: Array of strings
        mealFrequencyPreference: "", // Добавено: String name
        trainingType: "", // Добавено: String name
        trainingDaysPerWeek: "", // Добавено
        trainingDurationMinutes: "", // Добавено
        level: "", // Добавено: String name
        goalName: "", // Добавено: String name
    });
    // userEmail вече е излишно, ако ползваме profile.email
    // const [userEmail, setEmail] = useState("");
    const [loading, setLoading] = useState(true);

    /* Progress tracking state (unchanged) */
    const [progress, setProgress] = useState([
        { date: "01.06", weight: 68, calories: 2500, bodyFat: 22 },
        { date: "05.06", weight: 67, calories: 2400, bodyFat: 21.5 },
        { date: "10.06", weight: 66.4, calories: 2350, bodyFat: 21 },
        { date: "15.06", weight: 66, calories: 2300, bodyFat: 20.8 },
    ]);
    const [metric, setMetric] = useState("calories"); // Default to calories as per new image
    const metricLabel = {
        weight: "Тегло (kg)",
        calories: "Калории",
        bodyFat: "% Мазнини",
    };

    // Опции за Select елементите
    const genderOptions = [
        { value: "", label: "— изберете —" },
        { value: "MALE", label: "Мъж" },
        { value: "FEMALE", label: "Жена" },
    ];

    const activityLevelOptions = [
        { value: "", label: "— изберете —" },
        { value: "SEDENTARY", label: "Заседнал (Малко или никакво упражнение)" },
        { value: "LIGHTLY_ACTIVE", label: "Леко активен (Леки упражнения 1-3 дни/седмица)" },
        { value: "MODERATELY_ACTIVE", label: "Умерено активен (Умерени упражнения 3-5 дни/седмица)" },
        { value: "VERY_ACTIVE", label: "Много активен (Интензивни упражнения 6-7 дни/седмица)" },
        { value: "SUPER_ACTIVE", label: "Супер активен (Много интензивни упражнения/физическа работа)" },
    ];

    const dietTypeOptions = [
        { value: "", label: "— изберете —" },
        { value: "Балансирана", label: "Балансирана" },
        { value: "Вегетарианска", label: "Вегетарианска" },
        { value: "Веган", label: "Веган" },
        { value: "Кето", label: "Кетогенна" },
        { value: "Палео", label: "Палео" },
        { value: "Средиземноморска", label: "Средиземноморска" },
        { value: "Без глутен", label: "Без глутен" },
        { value: "Без лактоза", label: "Без лактоза" },
        // Добавете останалите типове диети, които имате в базата данни
    ];

    const meatPreferenceOptions = [
        { value: "", label: "— изберете —" },
        { value: "CHICKEN", label: "Пиле" },
        { value: "BEEF", label: "Говеждо" },
        { value: "PORK", label: "Свинско" },
        { value: "FISH", label: "Риба" },
        { value: "ALL", label: "Всички видове месо" },
        { value: "NONE", label: "Без месо (Вегетарианец/Веган)" },
    ];

    const mealFrequencyPreferenceOptions = [
        { value: "", label: "— изберете —" },
        { value: "TWO_TIMES_DAILY", label: "2 пъти дневно" },
        { value: "THREE_TIMES_DAILY", label: "3 пъти дневно" },
        { value: "FOUR_TIMES_DAILY", label: "4 пъти дневно" },
        { value: "FIVE_TIMES_DAILY", label: "5 пъти дневно" },
        { value: "SIX_TIMES_DAILY", label: "6 пъти дневно" },
    ];

    const trainingTypeOptions = [
        { value: "", label: "— изберете —" },
        { value: "CARDIO", label: "Кардио" },
        { value: "STRENGTH", label: "Силова тренировка" },
        { value: "HYBRID", label: "Хибридна (Кардио и Силова)" },
        { value: "NONE", label: "Не тренирам" },
    ];

    const levelOptions = [
        { value: "", label: "— изберете —" },
        { value: "BEGINNER", label: "Начинаещ" },
        { value: "INTERMEDIATE", label: "Средно напреднал" },
        { value: "ADVANCED", label: "Напреднал" },
    ];

    const goalNameOptions = [
        { value: "", label: "— изберете —" },
        { value: "Отслабване", label: "Отслабване" },
        { value: "Натрупване на мускулна маса", label: "Натрупване на мускулна маса" },
        { value: "Поддържане на теглото", label: "Поддържане на теглото" },
        { value: "Подобряване на издръжливостта", label: "Подобряване на издръжливостта" },
        { value: "Подобряване на силата", label: "Подобряване на силата" },
        // Добавете останалите цели, които имате в базата данни
    ];

    /* ───────── Effect Hook: Data Loading ───────── */
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                // Извличаме само профилните данни от новия ендпойнт
                const { data: me } = await api.get("/users/me/profile");

                // Важно: DTO-то връща Set<String> за алергии и предпочитания.
                // За да ги покажем в textarea, ги конвертираме в String, разделен със запетаи.
                // При запазване ще ги върнем обратно в Set<String>.
                setProfile((prev) => ({
                    ...prev,
                    ...me,
                    allergies: Array.isArray(me.allergies) ? me.allergies.join(", ") : "",
                    otherDietaryPreferences: Array.isArray(me.otherDietaryPreferences) ? me.otherDietaryPreferences.join(", ") : "",
                    consumesDairy: me.consumesDairy || false, // Гарантираме boolean стойност
                }));
                // setEmail(auth.email); // Вече имаме имейл в profile.email
            } catch (error) {
                toast.error("Проблем при зареждане на профила.");
                console.error("Failed to fetch profile data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfileData();
    }, []);

    /* ───────── Event Handlers ───────── */
    const handleProfileChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProfile((p) => ({
            ...p,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Специална обработка за алергии и други диетични предпочитания (Textarea)
    const handleListChange = (e) => {
        const { name, value } = e.target;
        // Разделяме стринга по запетаи, премахваме излишни интервали и филтрираме празни стрингове
        const listValue = value.split(',').map(item => item.trim()).filter(item => item.length > 0);
        setProfile((p) => ({ ...p, [name]: listValue }));
    };


    const saveProfile = async () => {
        try {
            // Подготвяме данните за изпращане
            const profileToSave = {
                ...profile,
                // Алергии и предпочитания ги изпращаме като масив от стрингове
                allergies: profile.allergies === "" ? [] : Array.isArray(profile.allergies) ? profile.allergies : profile.allergies.split(',').map(item => item.trim()).filter(item => item.length > 0),
                otherDietaryPreferences: profile.otherDietaryPreferences === "" ? [] : Array.isArray(profile.otherDietaryPreferences) ? profile.otherDietaryPreferences : profile.otherDietaryPreferences.split(',').map(item => item.trim()).filter(item => item.length > 0),
                // Преобразуваме числовите стойности в Number, ако не са празни
                weight: profile.weight === "" ? null : Number(profile.weight),
                height: profile.height === "" ? null : Number(profile.height),
                age: profile.age === "" ? null : Number(profile.age),
                trainingDaysPerWeek: profile.trainingDaysPerWeek === "" ? null : Number(profile.trainingDaysPerWeek),
                trainingDurationMinutes: profile.trainingDurationMinutes === "" ? null : Number(profile.trainingDurationMinutes),
            };

            await api.put("/users/me/profile", profileToSave);
            toast.success("Профилът е успешно запазен!");
        } catch (error) {
            toast.error("Неуспешен запис на профила.");
            console.error("Failed to save profile:", error);
        }
    };

    /* ───────── Progress Form Logic (unchanged) ───────── */
    const [newValue, setNewValue] = useState("");

    const addEntry = () => {
        const parsedValue = parseFloat(newValue);
        if (isNaN(parsedValue) || newValue.trim() === "") {
            return toast.warn("Моля, въведете валидна числова стойност!");
        }

        const today = new Date();
        const dd = String(today.getDate()).padStart(2, "0");
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const date = `${dd}.${mm}`;

        setProgress((p) => [...p, { date, [metric]: parsedValue }]);
        setNewValue("");
        toast.success("Нов запис добавен успешно!");
    };

    /* ───────── Mini-Chart Generator (unchanged) ───────── */
    const chart = React.useMemo(() => {
        const pts = progress.filter((p) => p[metric] !== undefined);
        if (!pts.length) return null;

        const w = 320,
            h = 120,
            pad = 24;

        const min = Math.min(...pts.map((p) => p[metric]));
        const max = Math.max(...pts.map((p) => p[metric]));

        const xs = pts.map(
            (_, i) => pad + (i * (w - 2 * pad)) / (pts.length > 1 ? pts.length - 1 : 1)
        );

        const ys = pts.map(
            (p) => pad + ((max - p[metric]) * (h - 2 * pad)) / (max - min || 1)
        );

        const path = xs.map((x, i) => `${i ? "L" : "M"}${x},${ys[i]}`).join(" ");

        return { w, h, path, xs, ys, min, max, pts, pad };
    }, [progress, metric]);

    // Display loading state
    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center text-gray-600 text-xl font-medium">
                <svg
                    className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                </svg>
                Зареждане на профила...
            </div>
        );
    }

    return (
        // Main wrapper with a subtle background gradient
        <div className="min-h-screen py-10 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <div className="max-w-6xl mx-auto px-4 md:px-8">
                {/* ───────── Headline Bar ───────── */}
                <header className="flex items-center gap-5 mb-10 px-4">
                    {/* Using a background for the logo and title for better separation */}
                    <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
                        <img src={logo} alt="FitnessApp Logo" className="h-14 w-auto" />
                        <div>
                            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
                                Моят профил
                            </h1>
                            <p className="text-md text-gray-600 mt-1">
                                Вие сте влезли като{" "}
                                <strong className="text-blue-700 font-semibold">{profile.email}</strong>
                            </p>
                        </div>
                    </div>
                </header>

                {/* ───────── Main Profile & Progress Cards ───────── */}
                <div className="grid gap-8 md:grid-cols-3">
                    {/* Left Section – Avatar & Profile Form */}
                    <section className="md:col-span-2 bg-white border border-gray-200 rounded-xl shadow-lg p-6 md:p-8 flex flex-col gap-8">
                        {/* Avatar Section */}
                        <div className="flex items-center gap-6">
                            <Avatar email={profile.email} avatarUrl={profile.avatarUrl} /> {/* Използваме profile.email */}
                            <button
                                onClick={() =>
                                    toast.info("Функционалността за смяна на аватара предстои.")
                                }
                                className="text-blue-600 hover:text-blue-800 text-sm font-semibold underline-offset-2 hover:underline transition-all duration-200 ease-in-out"
                            >
                                Смени аватар
                            </button>
                        </div>

                        {/* Profile Details Form */}
                        <div className="grid gap-5 sm:grid-cols-2">
                            <Input
                                label="Имейл"
                                name="email"
                                type="email"
                                value={profile.email || ""}
                                readOnly // Имейлът е само за четене
                                className="bg-gray-100 cursor-not-allowed" // Стилизация за readOnly
                            />
                            <Input
                                label="Пълно име"
                                name="fullName"
                                type="text"
                                value={profile.fullName || ""}
                                onChange={handleProfileChange}
                                placeholder="Въведете пълно име"
                            />
                            <Input
                                label="Тегло (kg)"
                                name="weight"
                                type="number"
                                value={profile.weight || ""}
                                onChange={handleProfileChange}
                                placeholder="Въведете тегло"
                            />
                            <Input
                                label="Ръст (cm)"
                                name="height"
                                type="number"
                                value={profile.height || ""}
                                onChange={handleProfileChange}
                                placeholder="Въведете ръст"
                            />
                            <Input
                                label="Възраст"
                                name="age"
                                type="number"
                                value={profile.age || ""}
                                onChange={handleProfileChange}
                                placeholder="Въведете възраст"
                            />
                            <Select
                                label="Пол"
                                name="gender"
                                value={profile.gender || ""}
                                onChange={handleProfileChange}
                                options={genderOptions}
                            />
                            <Select
                                label="Ниво на активност"
                                name="activityLevel"
                                value={profile.activityLevel || ""}
                                onChange={handleProfileChange}
                                options={activityLevelOptions}
                            />
                            <Select
                                label="Тип диета"
                                name="dietType"
                                value={profile.dietType || ""}
                                onChange={handleProfileChange}
                                options={dietTypeOptions}
                            />
                            <Select
                                label="Предпочитания за месо"
                                name="meatPreference"
                                value={profile.meatPreference || ""}
                                onChange={handleProfileChange}
                                options={meatPreferenceOptions}
                            />
                            {/* Checkbox за ConsumesDairy */}
                            <div className="flex items-center mt-6">
                                <input
                                    type="checkbox"
                                    id="consumesDairy"
                                    name="consumesDairy"
                                    checked={profile.consumesDairy || false}
                                    onChange={handleProfileChange}
                                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="consumesDairy" className="ml-2 block text-sm font-medium text-gray-700">
                                    Консумира млечни продукти
                                </label>
                            </div>

                            {/* Textarea за алергии */}
                            <Textarea
                                label="Алергии (разделени със запетая)"
                                name="allergies"
                                value={profile.allergies || ""}
                                onChange={handleListChange}
                                placeholder="Напр. ядки, глутен, лактоза"
                            />
                            {/* Textarea за други диетични предпочитания */}
                            <Textarea
                                label="Други диетични предпочитания (разделени със запетая)"
                                name="otherDietaryPreferences"
                                value={profile.otherDietaryPreferences || ""}
                                onChange={handleListChange}
                                placeholder="Напр. без захар, веган опции"
                            />

                            <Select
                                label="Честота на хранене"
                                name="mealFrequencyPreference"
                                value={profile.mealFrequencyPreference || ""}
                                onChange={handleProfileChange}
                                options={mealFrequencyPreferenceOptions}
                            />
                            <Select
                                label="Тип тренировка"
                                name="trainingType"
                                value={profile.trainingType || ""}
                                onChange={handleProfileChange}
                                options={trainingTypeOptions}
                            />
                            <Input
                                label="Тренировъчни дни на седмица"
                                name="trainingDaysPerWeek"
                                type="number"
                                value={profile.trainingDaysPerWeek || ""}
                                onChange={handleProfileChange}
                                placeholder="Напр. 3 или 5"
                            />
                            <Input
                                label="Продължителност на тренировка (мин)"
                                name="trainingDurationMinutes"
                                type="number"
                                value={profile.trainingDurationMinutes || ""}
                                onChange={handleProfileChange}
                                placeholder="Напр. 60 или 90"
                            />
                            <Select
                                label="Ниво"
                                name="level"
                                value={profile.level || ""}
                                onChange={handleProfileChange}
                                options={levelOptions}
                            />
                             <Select
                                label="Цел"
                                name="goalName"
                                value={profile.goalName || ""}
                                onChange={handleProfileChange}
                                options={goalNameOptions}
                            />
                        </div>
                    </section>

                    {/* Right Section – Progress Chart (unchanged) */}
                    <section className="md:col-span-1 bg-white border border-gray-200 rounded-xl shadow-lg p-6 md:p-8 flex flex-col">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                            📈 <span>Напредък</span>
                        </h2>

                        {/* Metric Selection Dropdown */}
                        <Select
                            label="Избери метрика"
                            value={metric}
                            onChange={(e) => setMetric(e.target.value)}
                            options={[
                                { value: "weight", label: "Тегло (kg)" },
                                { value: "calories", label: "Калории" },
                                { value: "bodyFat", label: "% Мазнини" },
                            ]}
                        />

                        {/* Progress Chart Display */}
                        {chart ? (
                            <div className="relative mt-6 p-2 bg-gray-50 rounded-lg border border-gray-100">
                                <svg
                                    viewBox={`0 0 ${chart.w} ${chart.h}`}
                                    className="w-full h-auto text-blue-600"
                                    aria-label={`Графика на ${metricLabel[metric]}`}
                                >
                                    {/* Y-axis Labels (Min/Max values) */}
                                    <text
                                        x={chart.pad - 8}
                                        y={chart.ys[chart.pts.findIndex((p) => p[metric] === chart.max)] + 3}
                                        textAnchor="end"
                                        alignmentBaseline="middle"
                                        fontSize="10"
                                        fill="#6B7280"
                                    >
                                        {chart.max}
                                    </text>
                                    <text
                                        x={chart.pad - 8}
                                        y={chart.ys[chart.pts.findIndex((p) => p[metric] === chart.min)] + 3}
                                        textAnchor="end"
                                        alignmentBaseline="middle"
                                        fontSize="10"
                                        fill="#6B7280"
                                    >
                                        {chart.min}
                                    </text>

                                    {/* X-axis Labels (Dates) */}
                                    {chart.xs.map((x, i) => (
                                        <text
                                            key={`x-label-${i}`}
                                            x={x}
                                            y={chart.h - chart.pad + 15}
                                            textAnchor="middle"
                                            fontSize="10"
                                            fill="#6B7280"
                                        >
                                            {chart.pts[i].date}
                                        </text>
                                    ))}

                                    {/* Chart Path */}
                                    <polyline
                                        points={chart.path.replace(/M|L/g, "")}
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        className="transition-all duration-300 ease-in-out"
                                    />

                                    {/* Data Points with Tooltips */}
                                    {chart.xs.map((x, i) => (
                                        <g key={`circle-${i}`}>
                                            <circle
                                                cx={x}
                                                cy={chart.ys[i]}
                                                r="4.5"
                                                fill="currentColor"
                                                stroke="white"
                                                strokeWidth="2"
                                                className="transition-all duration-300 ease-in-out hover:scale-125 cursor-pointer"
                                            >
                                                <title>{`${chart.pts[i].date}: ${
                                                    chart.pts[i][metric]
                                                } ${metricLabel[metric].split(" ")[1] || ""}`}</title>
                                            </circle>
                                        </g>
                                    ))}
                                </svg>
                            </div>
                        ) : (
                            <p className="text-gray-500 italic mt-6 text-center py-4 px-2 bg-gray-50 rounded-lg border border-gray-100">
                                Няма достатъчно данни за избраната метрика.
                            </p>
                        )}

                        {/* Add New Progress Entry Form */}
                        <div className="mt-6 flex gap-3 items-end">
                            <div className="flex-1">
                                <Input
                                    label={`Нова стойност (${metricLabel[metric]})`}
                                    value={newValue}
                                    onChange={(e) => setNewValue(e.target.value)}
                                    type="number"
                                    placeholder={`Въведете ${metricLabel[metric].toLowerCase()}`}
                                />
                            </div>
                            <button
                                onClick={addEntry}
                                className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 ease-in-out flex-shrink-0 text-lg font-medium shadow-md hover:shadow-lg"
                            >
                                ➕ Добави
                            </button>
                        </div>
                    </section>
                </div>

                {/* ───────── Password Section (unchanged) ───────── */}
                <section className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 md:p-8 mt-8 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-xl font-bold mb-2 text-gray-800">
                            🔐 Смяна на парола
                        </h2>
                        <p className="text-sm text-gray-600">
                            За по-добра сигурност сменяйте паролата си на всеки 90 дни.
                        </p>
                    </div>
                    <button
                        onClick={() =>
                            toast.info("Изпратихме ви имейл за смяна на паролата (имейл).")
                        }
                        className="mt-6 md:mt-0 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 ease-in-out font-medium shadow-md hover:shadow-lg"
                    >
                        Изпрати линк за смяна
                    </button>
                </section>

                {/* ───────── Footer Actions (unchanged) ───────── */}
                <div className="flex justify-end gap-5 mt-8 pb-10">
                    <button
                        onClick={() => {
                            localStorage.removeItem("token");
                            window.location.href = "/login"; // Redirect to login page
                        }}
                        className="text-red-600 hover:text-red-800 text-md font-semibold underline-offset-4 hover:underline transition-all duration-200 ease-in-out flex items-center gap-2"
                    >
                        <span className="text-xl">🚪</span> Изход
                    </button>
                    <button
                        onClick={saveProfile}
                        className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 ease-in-out text-lg font-medium shadow-md hover:shadow-lg"
                    >
                        💾 Запази промените
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ───────── Helper Components (unchanged, but added Textarea) ───────── */

/**
 * Avatar Component
 * Displays a user avatar, either from a URL or as an initial.
 */
const Avatar = ({ email, avatarUrl }) => {
    const initial = email ? email.charAt(0).toUpperCase() : "?";

    return (
        <div className="relative h-24 w-24 rounded-full flex items-center justify-center overflow-hidden bg-blue-50 border-4 border-blue-200 text-blue-600 font-bold text-4xl shadow-md group">
            {avatarUrl ? (
                <img
                    src={avatarUrl}
                    alt="User Avatar"
                    className="absolute inset-0 w-full h-full object-cover"
                />
            ) : (
                <span>{initial}</span>
            )}
            {/* Overlay for hover effect */}
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-xs font-semibold">Смени</span>
            </div>
        </div>
    );
};

/**
 * Input Component
 * A reusable input field with a label and enhanced styling.
 */
const Input = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        <input
            {...props}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent px-4 py-2.5 transition-all duration-200 ease-in-out placeholder-gray-400 text-gray-800 outline-none"
        />
    </div>
);

/**
 * Select Component
 * A reusable select dropdown with a label, options, and enhanced styling.
 */
const Select = ({ label, options, ...props }) => (
    <div>
        {label && (
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
        )}
        <select
            {...props}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent px-4 py-2.5 bg-white text-gray-800 appearance-none transition-all duration-200 ease-in-out outline-none cursor-pointer"
            // Custom arrow for select dropdown using SVG in background-image
            style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none'%3e%3cpath d='M7 7l3-3 3 3m0 6l-3 3-3-3' stroke='%234B5563' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3e%3c/svg%3e")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.75rem center",
                backgroundSize: "1.5em 1.5em",
            }}
        >
            {options.map((o) => (
                <option key={o.value} value={o.value}>
                    {o.label}
                </option>
            ))}
        </select>
    </div>
);

/**
 * Textarea Component
 * A reusable textarea field with a label and enhanced styling.
 * Useful for multi-line text input like allergies or preferences.
 */
const Textarea = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        <textarea
            {...props}
            rows="3" // Default rows for textarea
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent px-4 py-2.5 transition-all duration-200 ease-in-out placeholder-gray-400 text-gray-800 outline-none"
        ></textarea>
    </div>
);