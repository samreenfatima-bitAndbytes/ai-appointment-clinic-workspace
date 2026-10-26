import { useEffect, useState } from "react";
import { DEMO_USERS } from "../data/seed";

const KEY = "ai_appt_auth_v1";

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function useAuth() {
  const [user, setUser] = useState(() => read());

  useEffect(() => {
    const onStorage = () => setUser(read());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = (email, password) => {
    const match = DEMO_USERS.find(
      (u) =>
        u.email.toLowerCase() === String(email).trim().toLowerCase() &&
        u.password === password
    );
    if (!match) return { ok: false, error: "Invalid email or password" };
    const next = {
      id: match.id,
      email: match.email,
      fullName: match.fullName,
      isAdmin: match.isAdmin,
      businessName: match.businessName || "AI Appointment Platform",
    };
    localStorage.setItem(KEY, JSON.stringify(next));
    setUser(next);
    return { ok: true, user: next };
  };

  const logout = () => {
    localStorage.removeItem(KEY);
    setUser(null);
  };

  return { user, login, logout };
}
