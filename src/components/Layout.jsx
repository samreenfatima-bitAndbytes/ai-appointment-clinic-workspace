import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useStore } from "../hooks/useStore";

function NavLinks() {
  const { user } = useAuth();
  if (user?.isAdmin) {
    return (
      <>
        <NavLink to="/app/admin" end>
          Overview
        </NavLink>
        <NavLink to="/app/admin/clinics">Clinics</NavLink>
        <NavLink to="/app/admin/accounts">Accounts</NavLink>
      </>
    );
  }
  return (
    <>
      <NavLink to="/app" end>
        Dashboard
      </NavLink>
      <NavLink to="/app/calendar">Calendar</NavLink>
      <NavLink to="/app/clients">Clients</NavLink>
      <NavLink to="/app/assistant">Assistant</NavLink>
    </>
  );
}

export default function Layout() {
  const { user, logout } = useAuth();
  const { resetDemo } = useStore();
  const nav = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMenuOpen(false), [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const doLogout = () => {
    setMenuOpen(false);
    logout();
    nav("/login");
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink
          to={user?.isAdmin ? "/app/admin" : "/app"}
          className="brand"
          aria-label="AI Appointment"
        >
          <img className="brand-logo" src="/logo-transparent.png" alt="AI Appointment" />
        </NavLink>
        <nav className="nav-links nav-links-desktop">
          <NavLinks />
        </nav>
        <div className="topbar-actions topbar-actions-desktop">
          <span className="user-chip">
            {user?.fullName}
            <small style={{ display: "block", fontWeight: 600, opacity: 0.7 }}>
              {user?.isAdmin ? "Platform admin" : "Business"}
            </small>
          </span>
          <button type="button" className="btn btn-ghost" onClick={resetDemo}>
            Reset demo
          </button>
          <button type="button" className="btn btn-ghost" onClick={doLogout}>
            Log out
          </button>
        </div>
        <button
          type="button"
          className={`menu-toggle${menuOpen ? " is-open" : ""}`}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </header>
      <div
        className={`menu-backdrop${menuOpen ? " is-open" : ""}`}
        onClick={() => setMenuOpen(false)}
      />
      <aside className={`mobile-drawer${menuOpen ? " is-open" : ""}`}>
        <div className="user-chip" style={{ marginBottom: "0.75rem" }}>
          {user?.fullName}
          <small style={{ display: "block", fontWeight: 600, opacity: 0.7 }}>
            {user?.isAdmin ? "Platform admin" : "Business"}
          </small>
        </div>
        <nav className="mobile-nav-links">
          <NavLinks />
        </nav>
        <div className="mobile-drawer-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              resetDemo();
              setMenuOpen(false);
            }}
          >
            Reset demo
          </button>
          <button type="button" className="btn btn-primary" onClick={doLogout}>
            Log out
          </button>
        </div>
      </aside>
      <main className="page">
        <Outlet />
      </main>
    </div>
  );
}
