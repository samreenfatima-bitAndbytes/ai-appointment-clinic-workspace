import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useStore } from "../hooks/useStore";

export default function Clients() {
  const { user } = useAuth();
  const { clients, addClient, removeClient } = useStore();
  const readOnly = Boolean(user?.isAdmin);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const list = clients.filter((c) => c.active);

  const onSubmit = (e) => {
    e.preventDefault();
    if (readOnly) return;
    addClient({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      notes: "",
    });
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
  };

  return (
    <div>
      <div className="section-head">
        <div>
          <h2>{readOnly ? "Clinic clients" : "Clients"}</h2>
          <p className="muted" style={{ margin: "0.35rem 0 0" }}>
            {readOnly
              ? "Read-only view of Harbor Wellness Clinic contacts"
              : "Contact book for Harbor Wellness Clinic"}
          </p>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: "1rem" }}>
        {readOnly ? (
          <div className="panel">
            <h3 style={{ marginTop: 0 }}>Platform note</h3>
            <p className="muted" style={{ margin: 0 }}>
              Admins can review the roster. Sign in as Business to add or archive clients.
            </p>
          </div>
        ) : (
        <form className="panel" onSubmit={onSubmit}>
          <h3 style={{ marginTop: 0 }}>Add client</h3>
          <div className="grid-2">
            <label>
              First name
              <input value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </label>
            <label>
              Last name
              <input value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </label>
          </div>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Phone
            <input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </label>
          <button className="btn btn-primary" type="submit">
            Save client
          </button>
        </form>
        )}
        <div className="panel">
          <h3 style={{ marginTop: 0 }}>Active clients</h3>
          <p className="muted">{list.length} on file</p>
        </div>
      </div>

      <div className="panel">
        {list.length === 0 ? (
          <p className="muted">No clients yet.</p>
        ) : (
          <ul className="stack-list">
            {list.map((c) => (
              <li key={c.id} className="stack-item">
                <div className="stack-item-body">
                  <strong>
                    {c.firstName} {c.lastName}
                  </strong>
                  <p>
                    {c.email}
                    {c.phone ? ` · ${c.phone}` : ""}
                    {c.notes ? ` · ${c.notes}` : ""}
                  </p>
                </div>
                {!readOnly ? (
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => removeClient(c.id)}
                  >
                    Archive
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
