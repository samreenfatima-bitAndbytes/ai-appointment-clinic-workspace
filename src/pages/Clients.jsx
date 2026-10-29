import { useState } from "react";
import ConfirmModal from "../components/ConfirmModal";
import { useStore } from "../hooks/useStore";

export default function Clients() {
  const { clients, addClient, removeClient, restoreClient } = useStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [archiveId, setArchiveId] = useState(null);

  const list = clients.filter((c) => c.active);
  const archived = clients.filter((c) => !c.active);
  const pendingArchive = clients.find((c) => c.id === archiveId);

  const onSubmit = (e) => {
    e.preventDefault();
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
          <h2>Clients</h2>
          <p className="muted" style={{ margin: "0.35rem 0 0" }}>
            Contact book for Harbor Wellness Clinic · archive keeps history
          </p>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: "1rem" }}>
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
        <div className="panel">
          <h3 style={{ marginTop: 0 }}>Active clients</h3>
          <p className="muted">{list.length} on file</p>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: "1rem" }}>
        {list.length === 0 ? (
          <p className="muted">No active clients.</p>
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
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => setArchiveId(c.id)}
                >
                  Archive
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {archived.length > 0 ? (
        <div className="panel">
          <h3 style={{ marginTop: 0 }}>Archived</h3>
          <p className="muted" style={{ marginTop: 0 }}>
            Soft-removed from booking lists — restore anytime.
          </p>
          <ul className="stack-list">
            {archived.map((c) => (
              <li key={c.id} className="stack-item">
                <div className="stack-item-body">
                  <strong>
                    {c.firstName} {c.lastName}
                  </strong>
                  <p>{c.email}</p>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => restoreClient(c.id)}
                >
                  Restore
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <ConfirmModal
        open={Boolean(archiveId)}
        title="Archive client?"
        message={
          pendingArchive
            ? `${pendingArchive.firstName} ${pendingArchive.lastName} leaves the active list but can be restored anytime.`
            : "They leave the active list but can be restored anytime."
        }
        confirmLabel="Archive"
        cancelLabel="Keep active"
        danger
        onCancel={() => setArchiveId(null)}
        onConfirm={() => {
          if (archiveId) removeClient(archiveId);
          setArchiveId(null);
        }}
      />
    </div>
  );
}
