import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useStore } from "../hooks/useStore";

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

  const links = (
    <>
      <NavLink to="/app" end>
        Dashboard
      </NavLink>
      <NavLink to="/app/calendar">Calendar</NavLink>
      <NavLink to="/app/clients">Clients</NavLink>
      <NavLink to="/app/assistant">Assistant</NavLink>
      {user?.isAdmin ? <NavLink to="/app/admin">Admin</NavLink> : null}
    </>
  );

  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink to="/app" className="brand" aria-label="AI Appointment">
          <img className="brand-logo" src="/logo-transparent.png" alt="AI Appointment" />
        </NavLink>
        <nav className="nav-links nav-links-desktop">{links}</nav>
        <div className="topbar-actions topbar-actions-desktop">
          <span className="user-chip">{user?.fullName}</span>
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
          aria-label="Menu"
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
        </div>
        <nav className="mobile-nav-links">{links}</nav>
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
