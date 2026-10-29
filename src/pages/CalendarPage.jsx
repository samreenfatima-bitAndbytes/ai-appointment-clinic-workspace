import { useMemo, useState } from "react";
import ConfirmModal from "../components/ConfirmModal";
import { DAY_NAMES } from "../data/seed";
import { useStore } from "../hooks/useStore";

function visitLabel(ev) {
  if (ev.visitType === "virtual") return "Virtual";
  return ev.room || "In person";
}

export default function CalendarPage() {
  const { events, clients, slots, addEvent, cancelEvent, setEventStatus, toggleSlot } =
    useStore();
  const [title, setTitle] = useState("");
  const [clientId, setClientId] = useState(clients.find((c) => c.active)?.id || "");
  const [when, setWhen] = useState("");
  const [visitType, setVisitType] = useState("in_person");
  const [room, setRoom] = useState("Room A");
  const [formError, setFormError] = useState("");
  const [cancelId, setCancelId] = useState(null);

  const week = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const day = start.getDay();
    const mondayOffset = day === 0 ? -6 : 1 - day;
    start.setDate(start.getDate() + mondayOffset);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, []);

  const eventsByDay = (date) =>
    events.filter((e) => {
      const s = new Date(e.start);
      return (
        s.getFullYear() === date.getFullYear() &&
        s.getMonth() === date.getMonth() &&
        s.getDate() === date.getDate()
      );
    });

  const onCreate = (e) => {
    e.preventDefault();
    setFormError("");
    if (!title.trim() || !when) return;
    const start = new Date(when);
    const dow = start.getDay();
    if (dow === 0 || dow === 6) {
      setFormError("Clinic is closed weekends (Mon–Fri only).");
      return;
    }
    const end = new Date(start.getTime() + 45 * 60 * 1000);
    addEvent({
      title: title.trim(),
      clientId: clientId || null,
      start: start.toISOString(),
      end: end.toISOString(),
      visitType,
      room: visitType === "virtual" ? "" : room.trim(),
      status: "confirmed",
      description: "",
    });
    setTitle("");
    setWhen("");
  };

  const pendingCancel = events.find((e) => e.id === cancelId);

  return (
    <div>
      <div className="section-head">
        <div>
          <h2>Calendar</h2>
          <p className="muted" style={{ margin: "0.35rem 0 0" }}>
            Weekday visits only · cancel keeps history (does not hard-delete)
          </p>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: "1rem" }}>
        <form className="panel" onSubmit={onCreate}>
          <h3 style={{ marginTop: 0 }}>New appointment</h3>
          <label>
            Title
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>
          <label>
            Client
            <select value={clientId} onChange={(e) => setClientId(e.target.value)}>
              <option value="">—</option>
              {clients
                .filter((c) => c.active)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.firstName} {c.lastName}
                  </option>
                ))}
            </select>
          </label>
          <label>
            Start (Mon–Fri)
            <input
              type="datetime-local"
              value={when}
              onChange={(e) => setWhen(e.target.value)}
              required
            />
          </label>
          <label>
            Visit type
            <select value={visitType} onChange={(e) => setVisitType(e.target.value)}>
              <option value="in_person">In person</option>
              <option value="virtual">Virtual</option>
            </select>
          </label>
          {visitType === "in_person" ? (
            <label>
              Room
              <input value={room} onChange={(e) => setRoom(e.target.value)} placeholder="Room A" />
            </label>
          ) : null}
          {formError ? <p className="error">{formError}</p> : null}
          <button className="btn btn-primary" type="submit">
            Save appointment
          </button>
        </form>
        <div className="panel">
          <h3 style={{ marginTop: 0 }}>Weekly availability</h3>
          <p className="muted" style={{ marginTop: 0 }}>
            Mon–Fri open hours — toggle slots for booking.
          </p>
          <ul className="stack-list">
            {slots.map((s) => (
              <li key={s.id} className="stack-item">
                <div className="stack-item-body">
                  <strong>{DAY_NAMES[s.day]}</strong>
                  <p>
                    {s.start}–{s.end} · {s.available ? "Open" : "Closed"}
                  </p>
                </div>
                <button
                  type="button"
                  className={s.available ? "btn btn-ghost" : "btn btn-primary"}
                  style={{ padding: "0.35rem 0.65rem", fontSize: "0.8rem" }}
                  onClick={() => toggleSlot(s.id)}
                >
                  {s.available ? "Close" : "Open"}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid-3">
        {week.map((d) => {
          const isWeekend = d.getDay() === 0 || d.getDay() === 6;
          const dayEvents = eventsByDay(d);
          return (
            <div key={d.toISOString()} className={`cal-day${isWeekend ? " is-weekend" : ""}`}>
              <strong>
                {d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}
              </strong>
              {isWeekend ? (
                <p className="muted" style={{ fontSize: "0.8rem", margin: 0 }}>
                  Closed
                </p>
              ) : null}
              {!isWeekend && dayEvents.length === 0 ? (
                <p className="muted" style={{ fontSize: "0.8rem", margin: 0 }}>
                  Free
                </p>
              ) : null}
              {dayEvents.map((ev) => (
                <div
                  key={ev.id}
                  className={`cal-event${ev.status === "cancelled" ? " is-cancelled" : ""}`}
                >
                  <div>
                    {new Date(ev.start).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    · {ev.title}
                  </div>
                  <div className="cal-event-meta">
                    <span className={`chip chip-status-${ev.status || "confirmed"}`}>
                      {(ev.status || "confirmed").replace("_", " ")}
                    </span>
                    <span className="chip">{visitLabel(ev)}</span>
                  </div>
                  {ev.status !== "cancelled" && ev.status !== "completed" ? (
                    <div className="row-actions" style={{ marginTop: 6 }}>
                      <button
                        type="button"
                        className="btn btn-ghost"
                        style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}
                        onClick={() => setEventStatus(ev.id, "completed")}
                      >
                        Complete
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger"
                        style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}
                        onClick={() => setCancelId(ev.id)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <ConfirmModal
        open={Boolean(cancelId)}
        title="Cancel appointment?"
        message={
          pendingCancel
            ? `"${pendingCancel.title}" will stay on the calendar marked as Cancelled.`
            : "This visit will stay on the calendar marked as Cancelled."
        }
        confirmLabel="Cancel appointment"
        cancelLabel="Keep appointment"
        danger
        onCancel={() => setCancelId(null)}
        onConfirm={() => {
          if (cancelId) cancelEvent(cancelId);
          setCancelId(null);
        }}
      />
    </div>
  );
}
