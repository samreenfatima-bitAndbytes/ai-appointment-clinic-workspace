import { Link } from "react-router-dom";
import { DEMO_USERS } from "../data/seed";
import { useStore } from "../hooks/useStore";

export default function Admin() {
  const { clients, events, documents, slots } = useStore();
  const activeClients = clients.filter((c) => c.active);
  const upcoming = events.filter((e) => new Date(e.start) >= new Date());
  const businessUsers = DEMO_USERS.filter((u) => !u.isAdmin);
  const admins = DEMO_USERS.filter((u) => u.isAdmin);

  return (
    <div>
      <div className="section-head">
        <div>
          <h2>Platform overview</h2>
          <p className="muted" style={{ margin: "0.35rem 0 0" }}>
            Admin — monitor seeded clinics and seats. Clinic day-to-day ops belong to Business
            users.
          </p>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: "1.5rem" }}>
        <div className="stat">
          <strong>{DEMO_USERS.length}</strong>
          <span>Accounts</span>
        </div>
        <div className="stat">
          <strong>{businessUsers.length}</strong>
          <span>Business workspaces</span>
        </div>
        <div className="stat">
          <strong>{upcoming.length}</strong>
          <span>Upcoming appointments</span>
        </div>
        <div className="stat">
          <strong>{documents.length}</strong>
          <span>Knowledge docs</span>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: "1rem" }}>
        <div className="panel">
          <h3 style={{ marginTop: 0 }}>Platform seats</h3>
          <ul className="stack-list">
            {admins.map((u) => (
              <li key={u.id} className="stack-item">
                <div className="stack-item-body">
                  <strong>{u.fullName}</strong>
                  <p>{u.email} · Platform admin</p>
                </div>
                <span className="chip chip-admin">Admin</span>
              </li>
            ))}
            {businessUsers.map((u) => (
              <li key={u.id} className="stack-item">
                <div className="stack-item-body">
                  <strong>{u.fullName}</strong>
                  <p>
                    {u.email} · {u.businessName || "Business"}
                  </p>
                </div>
                <span className="chip">Business</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="panel">
          <h3 style={{ marginTop: 0 }}>Harbor Wellness Clinic</h3>
          <p className="muted">Seeded business workspace (read-only for Admin).</p>
          <dl className="detail-dl" style={{ marginTop: "1rem" }}>
            <div>
              <dt>Active clients</dt>
              <dd>{activeClients.length}</dd>
            </div>
            <div>
              <dt>Appointments on file</dt>
              <dd>{events.length}</dd>
            </div>
            <div>
              <dt>Open weekly slots</dt>
              <dd>{slots.filter((s) => s.available).length}</dd>
            </div>
            <div>
              <dt>FAQ documents</dt>
              <dd>{documents.length}</dd>
            </div>
          </dl>
          <div style={{ display: "grid", gap: "0.5rem", marginTop: "1rem" }}>
            <Link className="btn btn-ghost" to="/app/calendar">
              View clinic calendar
            </Link>
            <Link className="btn btn-ghost" to="/app/clients">
              View clinic clients
            </Link>
            <Link className="btn btn-ghost" to="/app/assistant">
              Preview clinic assistant
            </Link>
          </div>
          <p className="muted" style={{ margin: "1rem 0 0", fontSize: "0.9rem" }}>
            You can inspect clinic data. Creating or changing appointments, clients, or docs is a
            Business action — sign in as the clinic owner to demo that flow.
          </p>
        </div>
      </div>
    </div>
  );
}
