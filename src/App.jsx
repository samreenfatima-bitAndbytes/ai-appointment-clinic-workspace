import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { useStore } from "./hooks/useStore";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CalendarPage from "./pages/CalendarPage";
import Clients from "./pages/Clients";
import Assistant from "./pages/Assistant";
import Admin from "./pages/Admin";

function RequireAuth({ children }) {
  const { user } = useAuth();
  const loc = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: loc }} />;
  return children;
}

function RequireAdmin({ children }) {
  const { user } = useAuth();
  if (!user?.isAdmin) return <Navigate to="/app" replace />;
  return children;
}

export default function App() {
  const { toast } = useStore();
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/app"
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="clients" element={<Clients />} />
          <Route path="assistant" element={<Assistant />} />
          <Route
            path="admin"
            element={
              <RequireAdmin>
                <Admin />
              </RequireAdmin>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {toast ? <div className="toast">{toast}</div> : null}
    </>
  );
}
