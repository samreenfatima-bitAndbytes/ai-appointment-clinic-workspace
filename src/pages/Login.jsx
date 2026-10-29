import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import PasswordField from "../components/PasswordField";
import { DEMO_PASSWORD } from "../data/seed";
import { useAuth } from "../hooks/useAuth";

const ACCOUNTS = [
  {
    id: "business",
    label: "Business",
    email: "owner@clinic.example",
    password: DEMO_PASSWORD,
  },
  {
    id: "admin",
    label: "Admin",
    email: "admin@appointment.example",
    password: DEMO_PASSWORD,
  },
];

export default function Login() {
  const { user, login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [account, setAccount] = useState("business");
  const [email, setEmail] = useState(ACCOUNTS[0].email);
  const [password, setPassword] = useState(ACCOUNTS[0].password);
  const [error, setError] = useState("");

  if (user) {
    const home = user.isAdmin ? "/app/admin" : "/app";
    return <Navigate to={loc.state?.from?.pathname || home} replace />;
  }

  const pick = (id) => {
    const next = ACCOUNTS.find((a) => a.id === id);
    setAccount(id);
    setEmail(next.email);
    setPassword(next.password);
    setError("");
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const res = login(email, password);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    const home = res.user?.isAdmin ? "/app/admin" : "/app";
    nav(loc.state?.from?.pathname || home);
  };

  return (
    <div className="login-wrap">
      <aside className="login-visual" aria-hidden="true">
        <img src="/img/login-clinic.jpg" alt="" />
        <div className="login-visual-scrim" />
        <div className="login-visual-copy">
          <div className="login-visual-inner">
            <img src="/logo-transparent.png" alt="" className="brand-logo-lg" />
            <h2>Your clinic calendar, clients, and assistant — in one place</h2>
            <p>Schedule visits, keep notes, and answer FAQs from your clinic docs.</p>
            <ul className="login-visual-points">
              <li>Weekly availability &amp; appointments</li>
              <li>Client records in one workspace</li>
              <li>Document-trained FAQ chat</li>
            </ul>
          </div>
        </div>
      </aside>
      <div className="login-panel">
        <form className="login-form" onSubmit={onSubmit}>
          <Link to="/" className="login-logo" aria-label="AI Appointment">
            <img className="brand-logo-lg" src="/logo.png" alt="AI Appointment" />
          </Link>
          <p className="muted">
            {account === "admin"
              ? "Admin = platform overview & read-only clinic inspect."
              : "Business = run Harbor Wellness Clinic (calendar, clients, assistant)."}
          </p>
          <div className="login-tabs" role="tablist">
            {ACCOUNTS.map((a) => (
              <button
                key={a.id}
                type="button"
                role="tab"
                className={account === a.id ? "is-active" : undefined}
                onClick={() => pick(a.id)}
              >
                {a.label}
              </button>
            ))}
          </div>
          {error ? <p className="error">{error}</p> : null}
          <label>
            Email
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>
            Password
            <PasswordField
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button className="btn btn-primary" type="submit">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
