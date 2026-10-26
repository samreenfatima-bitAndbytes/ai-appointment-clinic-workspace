import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useStore } from "../hooks/useStore";

export default function Dashboard() {
  const { user } = useAuth();
  const { clients, events, slots, documents } = useStore();
  const activeClients = clients.filter((c) => c.active);
  const upcoming = [...events]
    .filter((e) => new Date(e.start) >= new Date())
    .sort((a, b) => new Date(a.start) - new Date(b.start))
    .slice(0, 4);

  return (
    <div>
      <div className="section-head">
        <div>
          <h2>Dashboard</h2>
          <p className="muted" style={{ margin: "0.35rem 0 0" }}>
            {user.businessName} · {user.fullName}
          </p>
        </div>
        <Link className="btn btn-primary" to="/app/calendar">
          Open calendar
        </Link>
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
          <strong>{slots.filter((s) => s.available).length}</strong>
          <span>Open weekly slots</span>
        </div>
      </div>

      <div className="grid-2">
        <div className="panel">
          <h3 style={{ marginTop: 0 }}>Next up</h3>
          {upcoming.length === 0 ? (
            <p className="muted">No upcoming appointments.</p>
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
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="panel">
          <h3 style={{ marginTop: 0 }}>Quick links</h3>
          <p className="muted">{documents.length} knowledge document(s) for the assistant.</p>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            <Link className="btn btn-ghost" to="/app/clients">
              Manage clients
            </Link>
            <Link className="btn btn-ghost" to="/app/assistant">
              Try clinic assistant
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
