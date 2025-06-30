import React from 'react'; // Добавете React импорт, ако не е наличен
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout"; // Вашият Layout компонент
import routes from "./routes"; // Вашият масив с рутове
import PrivateRoute from './components/PrivateRoute'; // <--- НОВ ИМПОРТ
import { AuthProvider } from './context/AuthContext'; // <--- НОВ ИМПОРТ

export default function App() {
  return (
    <AuthProvider> {/* <--- Обгръщаме всичко с AuthProvider */}
      <Layout>
        <Routes>
          {routes.map((route, index) => { // Използваме 'index' като key или добавете уникален 'id' към route обектите
            const { path, Component, isPrivate, allowedRoles } = route; // Деструктурираме новите свойства

            return (
              <Route
                key={path} // Използвайте path като key, ако е уникален. index също работи.
                path={path}
                element={
                  isPrivate ? ( // Проверяваме дали рутът е защитен
                    <PrivateRoute allowedRoles={allowedRoles}> {/* Подаваме allowedRoles на PrivateRoute */}
                      <Component /> {/* Рендираме компонента на рута вътре в PrivateRoute */}
                    </PrivateRoute>
                  ) : (
                    <Component /> // Ако не е защитен, рендираме компонента директно
                  )
                }
              />
            );
          })}
          {/* Рут за пренасочване, ако никой друг рут не съвпада */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </AuthProvider>
  );
}