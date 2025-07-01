import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import routes from "./routes";

export default function App() {
  return (
    <Layout>
      <Routes>
        {routes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}