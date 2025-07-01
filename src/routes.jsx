import WelcomePage from "./pages/WelcomePage";
import UnlockAccess from "./pages/UnlockAccess";
import Register from "./pages/Register";
import Login from "./pages/Login";
import DashboardPage from "./pages/DashboardPage";
import GuestIntro from "./pages/GuestIntro"; // Този импорт вече не е нужен
import GuestSummary from "./pages/GuestSummary";
import ProfilePage from "./pages/ProfilePage";
import PlanTabs from "./pages/PlanTabs";
import PlanHistory from "./pages/PlanHistory";
import NutritionPlanPage from "./pages/NutritionPlanPage";
import ChatbotPage from "./pages/ChatbotPage";
import AdminDashboard from './pages/AdminDashboard'; // Връщаме импорта за AdminDashboard
import ModeratorDashboard from './pages/ModeratorDashboard'; // Връщаме импорта за ModeratorDashboard
import ForgotPassword from "./components/ForgotPassword.jsx";
import UnauthorizedPage from "./pages/UnauthorizedPage";

const routes = [
    // Публични рутове (достъпни за всички)
    { path: "/", Component: WelcomePage, isPrivate: false },
    { path: "/unlock", Component: UnlockAccess, isPrivate: false },
    { path: "/register", Component: Register, isPrivate: false },
    { path: "/login", Component: Login, isPrivate: false },
    { path: "/guest", Component: GuestIntro, isPrivate: false }, // Този рут вече не е нужен
    { path: "/guest-summary", Component: GuestSummary, isPrivate: false },
    { path: "/forgot-password", Component: ForgotPassword, isPrivate: false },
    { path: "/unauthorized", Component: UnauthorizedPage, isPrivate: false },

    // Защитени рутове (изискват автентикация)
    { path: "/dashboard", Component: DashboardPage, isPrivate: true, allowedRoles: ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_MODERATOR'] },
    { path: "/profile", Component: ProfilePage, isPrivate: true, allowedRoles: ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_MODERATOR'] },
    { path: "/plan", Component: PlanTabs, isPrivate: true, allowedRoles: ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_MODERATOR'] },
    { path: "/history", Component: PlanHistory, isPrivate: true, allowedRoles: ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_MODERATOR'] },
    { path: "/nutrition", Component: NutritionPlanPage, isPrivate: true, allowedRoles: ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_MODERATOR'] },
    
    // КОРЕКЦИЯ: ДОБАВЯМЕ 'ROLE_GUEST' КЪМ allowedRoles ЗА ЧАТБОТА
    { path: "/chatbot", Component: ChatbotPage, isPrivate: true, allowedRoles: ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_MODERATOR', 'ROLE_GUEST'] },

    // Защитени рутове за специфични роли
    { path: "/admin", Component: AdminDashboard, isPrivate: true, allowedRoles: ['ROLE_ADMIN'] },
    { path: "/moderator", Component: ModeratorDashboard, isPrivate: true, allowedRoles: ['ROLE_MODERATOR', 'ROLE_ADMIN'] },
];

export default routes;
