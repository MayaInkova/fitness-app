import WelcomePage       from "./pages/WelcomePage";
import UnlockAccess      from "./pages/UnlockAccess";
import Register          from "./pages/Register";
import Login             from "./pages/Login";
import DashboardPage     from "./pages/DashboardPage";
import GuestIntro        from "./pages/GuestIntro";
import GuestSummary      from "./pages/GuestSummary";
import ProfilePage       from "./pages/ProfilePage";
import PlanTabs          from "./pages/PlanTabs";
import PlanHistory       from "./pages/PlanHistory";
import NutritionPlanPage from "./pages/NutritionPlanPage";
import ModeratorPanel    from "./pages/ModeratorPanel";
import ContentManagement from "./pages/ContentManagement";
import ChatbotPage       from "./pages/ChatbotPage";
import AdminPanel        from "./pages/AdminPanel";
import ForgotPassword from "./components/ForgotPassword.jsx";

const routes = [
  { path: "/",              Component: WelcomePage },
  { path: "/unlock",        Component: UnlockAccess },
  { path: "/register",      Component: Register },
  { path: "/login",         Component: Login },
  { path: "/dashboard",     Component: DashboardPage },
  { path: "/guest",         Component: GuestIntro },
  { path: "/guest-summary", Component: GuestSummary },   
  { path: "/profile",       Component: ProfilePage },
  { path: "/plan",          Component: PlanTabs },
  { path: "/history",       Component: PlanHistory },
  { path: "/nutrition",     Component: NutritionPlanPage },
  { path: "/moderator",     Component: ModeratorPanel },
  { path: "/content",       Component: ContentManagement },
  { path: "/chatbot",       Component: ChatbotPage },
  { path: "/admin",         Component: AdminPanel },
  { path:"/forgot-password", Component: ForgotPassword },
];

export default routes;