import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useStore } from "../hooks/useStore";

export default function Dashboard() {
  const { user } = useAuth();
  const { clients, events, slots, documents } = useStore();

  if (user?.isAdmin) return <Navigate to="/app/admin" replace />;

  const activeClients = clients.filter((c) => c.active);
  const upcoming = [...events]
    .filter((e) => new Date(e.start) >= new Date())
    .sort((a, b) => new Date(a.start) - new Date(b.start))
    .slice(0, 4);
  const openSlots = slots.filter((s) => s.available).length;

  return (
    <div>
      <div className="section-head">
        <div>
          <h2>Clinic dashboard</h2>
          <p className="muted" style={{ margin: "0.35rem 0 0" }}>
            {user.businessName} · create appointments, manage clients, train the assistant
          </p>
        </div>
        <div className="row-actions">
          <Link className="btn btn-ghost" to="/app/clients">
            Add client
          </Link>
          <Link className="btn btn-primary" to="/app/calendar">
            New appointment
          </Link>
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom: "1.5rem" }}>
        <div className="stat">
          <strong>{upcoming.length}</strong>
          <span>Upcoming appointments</span>
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
            <Link to="/app/calendar">Edit schedule</Link>
          </div>
          {upcoming.length === 0 ? (
            <p className="muted">No upcoming appointments. Book one from Calendar.</p>
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
                      · {e.location || "—"}
                    </p>
                  </div>
                  <Link
                    className="btn btn-ghost"
                    style={{ padding: "0.35rem 0.65rem", fontSize: "0.8rem" }}
                    to="/app/calendar"
                  >
                    Manage
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="panel">
          <h3 style={{ marginTop: 0 }}>Actions</h3>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            <Link className="btn btn-primary" to="/app/calendar">
              Book / remove appointments
            </Link>
            <Link className="btn btn-ghost" to="/app/calendar">
              Open or close weekly slots
            </Link>
            <Link className="btn btn-ghost" to="/app/clients">
              Add or archive clients
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
