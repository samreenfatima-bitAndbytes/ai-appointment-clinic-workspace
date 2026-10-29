import { useState } from "react";
import { DEMO_USERS } from "../data/seed";
import { useStore } from "../hooks/useStore";

export default function AdminAccounts() {
  const { accounts, inviteBusiness, toggleAccountActive } = useStore();
  const admins = DEMO_USERS.filter((u) => u.isAdmin);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [error, setError] = useState("");

  const onInvite = (e) => {
    e.preventDefault();
    setError("");
    const res = inviteBusiness({ fullName, email, businessName });
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setFullName("");
    setEmail("");
    setBusinessName("");
  };

  return (
    <div>
      <div className="section-head">
        <div>
          <h2>Accounts</h2>
          <p className="muted" style={{ margin: "0.35rem 0 0" }}>
            Invite business owners and enable / disable seats
          </p>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: "1rem" }}>
        <form className="panel" onSubmit={onInvite}>
          <h3 style={{ marginTop: 0 }}>Invite business owner</h3>
          <label>
            Full name
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </label>
          <label>
            Work email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Clinic name
            <input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
            />
          </label>
          {error ? <p className="error">{error}</p> : null}
          <button className="btn btn-primary" type="submit">
            Send invite
          </button>
        </form>
        <div className="panel">
          <h3 style={{ marginTop: 0 }}>Platform admins</h3>
          <p className="muted" style={{ marginTop: 0 }}>
            Fixed demo admins — cannot run clinic calendars.
          </p>
          <ul className="stack-list">
            {admins.map((u) => (
              <li key={u.id} className="stack-item">
                <div className="stack-item-body">
                  <strong>{u.fullName}</strong>
                  <p>{u.email}</p>
                </div>
                <span className="chip chip-admin">Admin</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="panel">
        <h3 style={{ marginTop: 0 }}>Business owners</h3>
        <ul className="stack-list">
          {accounts.map((a) => (
            <li key={a.id} className="stack-item">
              <div className="stack-item-body">
                <strong>{a.fullName}</strong>
                <p>
                  {a.email} · {a.businessName}
                  {!a.active ? " · disabled" : ""}
                  {a.clinicId === "clinic-harbor" ? " · demo login" : ""}
                </p>
              </div>
              <div className="row-actions">
                <span className={`chip ${a.active ? "chip-ok" : "chip-suspended"}`}>
                  {a.active ? "Active" : "Disabled"}
                </span>
                <button
                  type="button"
                  className={a.active ? "btn btn-danger" : "btn btn-primary"}
                  style={{ padding: "0.35rem 0.65rem", fontSize: "0.8rem" }}
                  onClick={() => toggleAccountActive(a.id)}
                >
                  {a.active ? "Disable" : "Enable"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
