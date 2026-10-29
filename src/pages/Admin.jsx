import { Link } from "react-router-dom";
import { DEMO_USERS } from "../data/seed";
import { useStore } from "../hooks/useStore";

export default function Admin() {
  const { clinics, accounts } = useStore();
  const activeClinics = clinics.filter((c) => c.status === "active").length;
  const totalClients = clinics.reduce((n, c) => n + c.clients, 0);
  const totalAppts = clinics.reduce((n, c) => n + c.appointments, 0);
  const trials = clinics.filter((c) => c.status === "trial").length;
  const suspended = clinics.filter((c) => c.status === "suspended").length;

  return (
    <div>
      <div className="section-head">
        <div>
          <h2>Platform overview</h2>
          <p className="muted" style={{ margin: "0.35rem 0 0" }}>
            Manage clinics and seats across the platform.
          </p>
        </div>
        <div className="row-actions">
          <Link className="btn btn-ghost" to="/app/admin/clinics">
            Manage clinics
          </Link>
          <Link className="btn btn-primary" to="/app/admin/accounts">
            Invite business
          </Link>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: "1.5rem" }}>
        <div className="stat">
          <strong>{clinics.length}</strong>
          <span>Clinics</span>
        </div>
        <div className="stat">
          <strong>{activeClinics}</strong>
          <span>Active</span>
        </div>
        <div className="stat">
          <strong>{totalClients}</strong>
          <span>Clients (all)</span>
        </div>
        <div className="stat">
          <strong>{totalAppts}</strong>
          <span>Appointments (all)</span>
        </div>
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="panel-head-row">
            <h3 style={{ margin: 0 }}>Needs attention</h3>
            <Link to="/app/admin/clinics">Open</Link>
          </div>
          <ul className="stack-list">
            <li className="stack-item">
              <div className="stack-item-body">
                <strong>{trials} on trial</strong>
                <p>Activate or keep in trial from Clinics</p>
              </div>
            </li>
            <li className="stack-item">
              <div className="stack-item-body">
                <strong>{suspended} suspended</strong>
                <p>Reactivate when billing is cleared</p>
              </div>
            </li>
            <li className="stack-item">
              <div className="stack-item-body">
                <strong>{accounts.filter((a) => !a.active).length} inactive owners</strong>
                <p>Toggle seats on Accounts</p>
              </div>
            </li>
          </ul>
        </div>
        <div className="panel">
          <div className="panel-head-row">
            <h3 style={{ margin: 0 }}>Quick actions</h3>
          </div>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            <Link className="btn btn-primary" to="/app/admin/clinics">
              Add clinic / change plans
            </Link>
            <Link className="btn btn-ghost" to="/app/admin/accounts">
              Invite or disable business owners
            </Link>
          </div>
          <p className="muted" style={{ margin: "1rem 0 0", fontSize: "0.9rem" }}>
            {DEMO_USERS.filter((u) => u.isAdmin).length} platform admin · {accounts.length}{" "}
            business seats. Clinic day-to-day ops stay on Business login.
          </p>
        </div>
      </div>
    </div>
  );
}
