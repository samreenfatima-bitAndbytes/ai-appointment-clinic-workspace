import { DEMO_USERS } from "../data/seed";
import { useStore } from "../hooks/useStore";

export default function Admin() {
  const { clients, events, documents } = useStore();
  return (
    <div>
      <div className="section-head">
        <div>
          <h2>Admin</h2>
          <p className="muted" style={{ margin: "0.35rem 0 0" }}>
            Platform overview for the static demo
          </p>
        </div>
      </div>
      <div className="grid-3" style={{ marginBottom: "1.5rem" }}>
        <div className="stat">
          <strong>{DEMO_USERS.length}</strong>
          <span>Users</span>
        </div>
        <div className="stat">
          <strong>{clients.filter((c) => c.active).length}</strong>
          <span>Clients</span>
        </div>
        <div className="stat">
          <strong>{events.length}</strong>
          <span>Appointments</span>
        </div>
      </div>
      <div className="panel">
        <h3 style={{ marginTop: 0 }}>Demo users</h3>
        <ul className="stack-list">
          {DEMO_USERS.map((u) => (
            <li key={u.id} className="stack-item">
              <div className="stack-item-body">
                <strong>{u.fullName}</strong>
                <p>
                  {u.email} · {u.isAdmin ? "Admin" : "Business"}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <p className="muted" style={{ marginTop: "1rem" }}>
          {documents.length} knowledge document(s) in the seeded clinic workspace.
        </p>
      </div>
    </div>
  );
}
