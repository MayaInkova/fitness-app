import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, LayoutDashboard, Dumbbell, History, Bot, LogIn, UserPlus } from "lucide-react";

import logo from "../images/logo.png";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // динамичен клас за активен линк
  const navClass = ({ isActive }) =>
    isActive
      ? "text-blue-600 font-semibold flex items-center gap-1"
      : "flex items-center gap-1 text-gray-700 hover:text-blue-600 transition";

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white shadow">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* ▸ Лого + име */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="FitnessApp logo" className="h-9 w-auto" />
          <span className="text-2xl font-bold tracking-tight text-gray-900">
            FitnessApp
          </span>
        </Link>

        {/* ▸ Нав-линкове (desktop) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <NavLink to="/dashboard" className={navClass}>
            <LayoutDashboard size={16} /> Табло
          </NavLink>
          <NavLink to="/plan" className={navClass}>
            <Dumbbell size={16} /> Режим
          </NavLink>
          <NavLink to="/history" className={navClass}>
            <History size={16} /> История
          </NavLink>
          <NavLink to="/chatbot" className={navClass}>
            <Bot size={16} /> Чатбот
          </NavLink>
        </nav>

        {/* ▸ Бутони (desktop) */}
        <div className="hidden md:flex gap-4">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-md border border-blue-600 px-4 py-2 text-blue-600 hover:bg-blue-50 transition"
          >
            <LogIn size={16} /> Вход
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
          >
            <UserPlus size={16} /> Регистрация
          </Link>
        </div>

        {/* ▸ Burger (mobile) */}
        <button
          aria-label="Отвори меню"
          onClick={() => setOpen(!open)}
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* ▸ Mobile меню */}
      <nav
        className={`md:hidden origin-top ${
          open ? "scale-y-100" : "scale-y-0"
        } transform-gpu transition-transform duration-200 bg-white border-t border-gray-100 shadow-lg`}
      >
        <ul className="flex flex-col gap-2 p-4 text-sm font-medium">
          <NavLink to="/dashboard" onClick={() => setOpen(false)} className={navClass}>
            <LayoutDashboard size={16} /> Табло
          </NavLink>
          <NavLink to="/plan" onClick={() => setOpen(false)} className={navClass}>
            <Dumbbell size={16} /> Режим
          </NavLink>
          <NavLink to="/history" onClick={() => setOpen(false)} className={navClass}>
            <History size={16} /> История
          </NavLink>
          <NavLink to="/chatbot" onClick={() => setOpen(false)} className={navClass}>
            <Bot size={16} /> Чатбот
          </NavLink>

          <hr className="my-2 border-gray-100" />

          <Link
            to="/login"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 py-2 text-gray-700 hover:text-blue-600 transition"
          >
            <LogIn size={16} /> Вход
          </Link>
          <Link
            to="/register"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 py-2 text-gray-700 hover:text-blue-600 transition"
          >
            <UserPlus size={16} /> Регистрация
          </Link>
        </ul>
      </nav>
    </header>
  );
}