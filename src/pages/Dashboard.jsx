import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useStore } from "../hooks/useStore";

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function visitLabel(ev) {
  if (ev.visitType === "virtual") return "Virtual";
  return ev.room || "In person";
}

export default function Dashboard() {
  const { user } = useAuth();
  const { clients, events, slots, documents } = useStore();

  if (user?.isAdmin) return <Navigate to="/app/admin" replace />;

  const activeClients = clients.filter((c) => c.active);
  const now = new Date();
  const live = events.filter((e) => e.status !== "cancelled");
  const todayAppts = live.filter((e) => isSameDay(new Date(e.start), now));
  const upcoming = [...live]
    .filter((e) => new Date(e.start) >= now && e.status !== "completed")
    .sort((a, b) => new Date(a.start) - new Date(b.start))
    .slice(0, 4);
  const openSlots = slots.filter((s) => s.available).length;
  const cancelledSoon = events.filter(
    (e) => e.status === "cancelled" && new Date(e.start) >= now
  ).length;

  return (
    <div>
      <div className="section-head">
        <div>
          <h2>Clinic dashboard</h2>
          <p className="muted" style={{ margin: "0.35rem 0 0" }}>
            {user.businessName} · counts use active clients &amp; non-cancelled appointments
          </p>
        </div>
        <div className="row-actions">
          <Link className="btn btn-ghost" to="/app/calendar">
            View calendar
          </Link>
          <Link className="btn btn-primary" to="/app/calendar">
            New appointment
          </Link>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: "1.5rem" }}>
        <div className="stat">
          <strong>{todayAppts.length}</strong>
          <span>Today</span>
        </div>
        <div className="stat">
          <strong>{upcoming.length}</strong>
          <span>Upcoming</span>
        </div>
        <div className="stat">
          <strong>{activeClients.length}</strong>
          <span>Active clients</span>
        </div>
        <div className="stat">
          <strong>{openSlots}</strong>
          <span>Open weekly slots</span>
        </div>
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="panel-head-row">
            <h3 style={{ margin: 0 }}>Next up</h3>
            <Link to="/app/calendar">View calendar</Link>
          </div>
          {upcoming.length === 0 ? (
            <p className="muted">No upcoming confirmed visits. Book one from Calendar.</p>
          ) : (
            <ul className="stack-list">
              {upcoming.map((e) => (
                <li key={e.id} className="stack-item">
                  <div className="stack-item-body">
                    <strong>{e.title}</strong>
                    <p>
                      {new Date(e.start).toLocaleString([], {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      · {visitLabel(e)}
                    </p>
                    <span className={`chip chip-status-${e.status || "confirmed"}`}>
                      {(e.status || "confirmed").replace("_", " ")}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {cancelledSoon > 0 ? (
            <p className="muted" style={{ margin: "0.75rem 0 0", fontSize: "0.88rem" }}>
              {cancelledSoon} upcoming visit(s) marked cancelled (still on calendar).
            </p>
          ) : null}
        </div>
        <div className="panel">
          <h3 style={{ marginTop: 0 }}>Actions</h3>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            <Link className="btn btn-primary" to="/app/calendar">
              Book or cancel appointments
            </Link>
            <Link className="btn btn-ghost" to="/app/calendar">
              Open or close weekly slots
            </Link>
            <Link className="btn btn-ghost" to="/app/clients">
              Add or archive clients ({activeClients.length} active)
            </Link>
            <Link className="btn btn-ghost" to="/app/assistant">
              Chat + upload FAQ docs ({documents.length})
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
