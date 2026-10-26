import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { SEED_CLIENTS, SEED_DOCS, SEED_EVENTS, SEED_SLOTS } from "../data/seed";

const KEY = "ai_appt_data_v1";
const Ctx = createContext(null);

function seed() {
  return {
    clients: SEED_CLIENTS.map((c) => ({ ...c })),
    events: SEED_EVENTS.map((e) => ({ ...e })),
    slots: SEED_SLOTS.map((s) => ({ ...s })),
    documents: SEED_DOCS.map((d) => ({ ...d })),
  };
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed();
    return { ...seed(), ...JSON.parse(raw) };
  } catch {
    return seed();
  }
}

export function StoreProvider({ children }) {
  const [data, setData] = useState(() => load());
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(data));
  }, [data]);

  const notify = useCallback((msg) => {
    setToast(msg);
    window.clearTimeout(notify._t);
    notify._t = window.setTimeout(() => setToast(null), 2200);
  }, []);

  const resetDemo = useCallback(() => {
    const fresh = seed();
    setData(fresh);
    localStorage.setItem(KEY, JSON.stringify(fresh));
    notify("Demo data reset");
  }, [notify]);

  const addClient = useCallback(
    (client) => {
      const row = { id: `c-${Date.now()}`, active: true, ...client };
      setData((d) => ({ ...d, clients: [row, ...d.clients] }));
      notify("Client added");
      return row;
    },
    [notify]
  );

  const removeClient = useCallback(
    (id) => {
      setData((d) => ({
        ...d,
        clients: d.clients.map((c) =>
          c.id === id ? { ...c, active: false } : c
        ),
      }));
      notify("Client archived");
    },
    [notify]
  );

  const addEvent = useCallback(
    (event) => {
      const row = { id: `e-${Date.now()}`, ...event };
      setData((d) => ({ ...d, events: [...d.events, row] }));
      notify("Appointment saved");
      return row;
    },
    [notify]
  );

  const removeEvent = useCallback(
    (id) => {
      setData((d) => ({
        ...d,
        events: d.events.filter((e) => e.id !== id),
      }));
      notify("Appointment removed");
    },
    [notify]
  );

  const addDocument = useCallback(
    (doc) => {
      const row = { id: `d-${Date.now()}`, ...doc };
      setData((d) => ({ ...d, documents: [row, ...d.documents] }));
      notify(`Uploaded ${row.filename}`);
      return row;
    },
    [notify]
  );

  const removeDocument = useCallback(
    (id) => {
      setData((d) => ({
        ...d,
        documents: d.documents.filter((x) => x.id !== id),
      }));
      notify("Document removed");
    },
    [notify]
  );

  const value = useMemo(
    () => ({
      ...data,
      toast,
      notify,
      resetDemo,
      addClient,
      removeClient,
      addEvent,
      removeEvent,
      addDocument,
      removeDocument,
    }),
    [
      data,
      toast,
      notify,
      resetDemo,
      addClient,
      removeClient,
      addEvent,
      removeEvent,
      addDocument,
      removeDocument,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore requires StoreProvider");
  return ctx;
}
