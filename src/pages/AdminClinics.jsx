import { useState } from "react";
import { useStore } from "../hooks/useStore";

export default function AdminClinics() {
  const { clinics, addClinic, setClinicStatus, setClinicPlan } = useStore();
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");
  const [plan, setPlan] = useState("Starter");
  const [error, setError] = useState("");

  const totalDocs = clinics.reduce((n, c) => n + c.docs, 0);

  const onAdd = (e) => {
    e.preventDefault();
    setError("");
    const res = addClinic({ name, owner, plan });
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setName("");
    setOwner("");
    setPlan("Starter");
  };

  return (
    <div>
      <div className="section-head">
        <div>
          <h2>Clinics</h2>
          <p className="muted" style={{ margin: "0.35rem 0 0" }}>
            Add tenants, change plans, activate / suspend
          </p>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: "1rem" }}>
        <form className="panel" onSubmit={onAdd}>
          <h3 style={{ marginTop: 0 }}>Add clinic</h3>
          <label>
            Clinic name
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            Owner name
            <input value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="Optional" />
          </label>
          <label>
            Plan
            <select value={plan} onChange={(e) => setPlan(e.target.value)}>
              <option>Starter</option>
              <option>Growth</option>
              <option>Enterprise</option>
            </select>
          </label>
          {error ? <p className="error">{error}</p> : null}
          <button className="btn btn-primary" type="submit">
            Create trial clinic
          </button>
        </form>
        <div className="panel">
          <h3 style={{ marginTop: 0 }}>What you can do</h3>
          <ul className="muted" style={{ margin: 0, paddingLeft: "1.1rem", lineHeight: 1.55 }}>
            <li>Create a new clinic (starts on trial)</li>
            <li>Switch plan: Starter / Growth / Enterprise</li>
            <li>Set status: active, trial, or suspended</li>
          </ul>
          <p className="muted" style={{ margin: "1rem 0 0", fontSize: "0.9rem" }}>
            {totalDocs} knowledge docs across clinics. Harbor remains the interactive Business demo.
          </p>
        </div>
      </div>

      <div className="panel">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Clinic</th>
                <th>Owner</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Clients</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clinics.map((c) => (
                <tr key={c.id}>
                  <td>
                    <strong>{c.name}</strong>
                    {c.demoLogin ? (
                      <span className="chip chip-demo" style={{ marginLeft: "0.45rem" }}>
                        Interactive demo
                      </span>
                    ) : null}
                  </td>
                  <td>{c.owner}</td>
                  <td>
                    <select
                      className="inline-select"
                      value={c.plan}
                      onChange={(e) => setClinicPlan(c.id, e.target.value)}
                      aria-label={`Plan for ${c.name}`}
                    >
                      <option>Starter</option>
                      <option>Growth</option>
                      <option>Enterprise</option>
                    </select>
                  </td>
                  <td>
                    <span className={`chip ${c.status === "active" ? "chip-ok" : c.status === "trial" ? "chip-trial" : "chip-suspended"}`}>
                      {c.status}
                    </span>
                  </td>
                  <td>{c.clients}</td>
                  <td>
                    <div className="row-actions">
                      {c.status !== "active" ? (
                        <button
                          type="button"
                          className="btn btn-primary"
                          style={{ padding: "0.35rem 0.65rem", fontSize: "0.8rem" }}
                          onClick={() => setClinicStatus(c.id, "active")}
                        >
                          Activate
                        </button>
                      ) : null}
                      {c.status !== "trial" ? (
                        <button
                          type="button"
                          className="btn btn-ghost"
                          style={{ padding: "0.35rem 0.65rem", fontSize: "0.8rem" }}
                          onClick={() => setClinicStatus(c.id, "trial")}
                        >
                          Trial
                        </button>
                      ) : null}
                      {c.status !== "suspended" ? (
                        <button
                          type="button"
                          className="btn btn-danger"
                          style={{ padding: "0.35rem 0.65rem", fontSize: "0.8rem" }}
                          onClick={() => setClinicStatus(c.id, "suspended")}
                        >
                          Suspend
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
