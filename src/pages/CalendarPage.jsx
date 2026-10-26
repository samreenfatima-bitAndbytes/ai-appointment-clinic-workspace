import { useMemo, useState } from "react";
import { DAY_NAMES } from "../data/seed";
import { useStore } from "../hooks/useStore";

export default function CalendarPage() {
  const { events, clients, slots, addEvent, removeEvent } = useStore();
  const [title, setTitle] = useState("");
  const [clientId, setClientId] = useState(clients.find((c) => c.active)?.id || "");
  const [when, setWhen] = useState("");
  const [location, setLocation] = useState("Room A");

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
    if (!title.trim() || !when) return;
    const start = new Date(when);
    const end = new Date(start.getTime() + 45 * 60 * 1000);
    addEvent({
      title: title.trim(),
      clientId: clientId || null,
      start: start.toISOString(),
      end: end.toISOString(),
      location,
      description: "",
    });
    setTitle("");
    setWhen("");
  };

  return (
    <div>
      <div className="section-head">
        <div>
          <h2>Calendar</h2>
          <p className="muted" style={{ margin: "0.35rem 0 0" }}>
            This week’s appointments (local demo — no Google sync)
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
            Start
            <input
              type="datetime-local"
              value={when}
              onChange={(e) => setWhen(e.target.value)}
              required
            />
          </label>
          <label>
            Location
            <input value={location} onChange={(e) => setLocation(e.target.value)} />
          </label>
          <button className="btn btn-primary" type="submit">
            Save appointment
          </button>
        </form>
        <div className="panel">
          <h3 style={{ marginTop: 0 }}>Weekly availability</h3>
          <ul className="stack-list">
            {slots.map((s) => (
              <li key={s.id} className="stack-item">
                <div className="stack-item-body">
                  <strong>{DAY_NAMES[s.day]}</strong>
                  <p>
                    {s.start}–{s.end} · {s.available ? "Open" : "Closed"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid-3">
        {week.map((d) => (
          <div key={d.toISOString()} className="cal-day">
            <strong>
              {d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}
            </strong>
            {eventsByDay(d).length === 0 ? (
              <p className="muted" style={{ fontSize: "0.8rem", margin: 0 }}>
                Free
              </p>
            ) : (
              eventsByDay(d).map((ev) => (
                <div key={ev.id} className="cal-event">
                  {new Date(ev.start).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  · {ev.title}
                  <div>
                    <button
                      type="button"
                      className="btn btn-danger"
                      style={{ marginTop: 6, padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}
                      onClick={() => removeEvent(ev.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
