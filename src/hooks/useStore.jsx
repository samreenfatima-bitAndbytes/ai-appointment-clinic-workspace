import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DEMO_USERS,
  SEED_CLIENTS,
  SEED_CLINICS,
  SEED_DOCS,
  SEED_EVENTS,
  SEED_SLOTS,
} from "../data/seed";

const KEY = "ai_appt_data_v3";
const Ctx = createContext(null);

function normalizeEvent(e) {
  const visitType =
    e.visitType || (e.location === "Virtual" ? "virtual" : "in_person");
  const room =
    e.room ??
    (e.location && e.location !== "Virtual" ? e.location : "") ??
    "";
  return {
    ...e,
    status: e.status || "confirmed",
    visitType,
    room: visitType === "virtual" ? "" : room,
  };
}

function seedAccounts() {
  return DEMO_USERS.filter((u) => !u.isAdmin).map((u) => ({
    id: u.id,
    fullName: u.fullName,
    email: u.email,
    businessName: u.businessName,
    clinicId: u.clinicId,
    role: "Business",
    active: true,
  }));
}

function seed() {
  return {
    clients: SEED_CLIENTS.map((c) => ({ ...c })),
    events: SEED_EVENTS.map((e) => normalizeEvent({ ...e })),
    slots: SEED_SLOTS.map((s) => ({ ...s })),
    documents: SEED_DOCS.map((d) => ({ ...d })),
    clinics: SEED_CLINICS.map((c) => ({ ...c })),
    accounts: seedAccounts(),
  };
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed();
    const parsed = JSON.parse(raw);
    const base = seed();
    return {
      ...base,
      ...parsed,
      clients: Array.isArray(parsed.clients) ? parsed.clients : base.clients,
      events: Array.isArray(parsed.events)
        ? parsed.events.map((e) => normalizeEvent(e))
        : base.events,
      slots: Array.isArray(parsed.slots) ? parsed.slots : base.slots,
      documents: Array.isArray(parsed.documents) ? parsed.documents : base.documents,
      clinics: Array.isArray(parsed.clinics) ? parsed.clinics : base.clinics,
      accounts: Array.isArray(parsed.accounts) ? parsed.accounts : base.accounts,
    };
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
    notify("Demo data reset (local only)");
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
        clients: d.clients.map((c) => (c.id === id ? { ...c, active: false } : c)),
      }));
      notify("Client archived");
    },
    [notify]
  );

  const addEvent = useCallback(
    (event) => {
      const row = normalizeEvent({
        id: `e-${Date.now()}`,
        status: "confirmed",
        ...event,
      });
      setData((d) => ({ ...d, events: [...d.events, row] }));
      notify("Appointment saved");
      return row;
    },
    [notify]
  );

  const cancelEvent = useCallback(
    (id) => {
      setData((d) => ({
        ...d,
        events: d.events.map((e) =>
          e.id === id ? { ...e, status: "cancelled" } : e
        ),
      }));
      notify("Appointment cancelled");
    },
    [notify]
  );

  const setEventStatus = useCallback(
    (id, status) => {
      setData((d) => ({
        ...d,
        events: d.events.map((e) => (e.id === id ? { ...e, status } : e)),
      }));
      notify(`Marked ${status.replace("_", "-")}`);
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

  const restoreClient = useCallback(
    (id) => {
      setData((d) => ({
        ...d,
        clients: d.clients.map((c) => (c.id === id ? { ...c, active: true } : c)),
      }));
      notify("Client restored");
    },
    [notify]
  );

  const toggleSlot = useCallback(
    (id) => {
      setData((d) => ({
        ...d,
        slots: d.slots.map((s) => (s.id === id ? { ...s, available: !s.available } : s)),
      }));
      notify("Availability updated");
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

  const setClinicStatus = useCallback(
    (id, status) => {
      setData((d) => ({
        ...d,
        clinics: d.clinics.map((c) => (c.id === id ? { ...c, status } : c)),
      }));
      notify(`Clinic marked ${status}`);
    },
    [notify]
  );

  const setClinicPlan = useCallback(
    (id, plan) => {
      setData((d) => ({
        ...d,
        clinics: d.clinics.map((c) => (c.id === id ? { ...c, plan } : c)),
      }));
      notify(`Plan set to ${plan}`);
    },
    [notify]
  );

  const addClinic = useCallback(
    ({ name, owner, plan }) => {
      const clean = String(name || "").trim();
      if (!clean) return { ok: false, error: "Clinic name is required." };
      const id = `clinic-${Date.now()}`;
      const row = {
        id,
        name: clean,
        owner: String(owner || "New owner").trim() || "New owner",
        plan: plan || "Starter",
        status: "trial",
        clients: 0,
        appointments: 0,
        docs: 0,
        demoLogin: false,
      };
      setData((d) => ({ ...d, clinics: [row, ...d.clinics] }));
      notify("Clinic added (trial)");
      return { ok: true, clinic: row };
    },
    [notify]
  );

  const inviteBusiness = useCallback(
    ({ fullName, email, businessName }) => {
      const cleanEmail = String(email || "").trim().toLowerCase();
      const name = String(fullName || "").trim();
      const biz = String(businessName || "").trim();
      if (!cleanEmail || !name || !biz) {
        return { ok: false, error: "Name, email, and clinic name are required." };
      }
      let exists = false;
      setData((d) => {
        if (d.accounts.some((a) => a.email.toLowerCase() === cleanEmail)) {
          exists = true;
          return d;
        }
        const clinicId = `clinic-${Date.now()}`;
        const account = {
          id: `acc-${Date.now()}`,
          fullName: name,
          email: cleanEmail,
          businessName: biz,
          clinicId,
          role: "Business",
          active: true,
        };
        const clinic = {
          id: clinicId,
          name: biz,
          owner: name,
          plan: "Starter",
          status: "trial",
          clients: 0,
          appointments: 0,
          docs: 0,
          demoLogin: false,
        };
        return {
          ...d,
          accounts: [account, ...d.accounts],
          clinics: [clinic, ...d.clinics],
        };
      });
      if (exists) return { ok: false, error: "That email is already on the platform." };
      notify("Business owner invited");
      return { ok: true };
    },
    [notify]
  );

  const toggleAccountActive = useCallback(
    (id) => {
      setData((d) => ({
        ...d,
        accounts: d.accounts.map((a) =>
          a.id === id ? { ...a, active: !a.active } : a
        ),
      }));
      notify("Account updated");
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
      restoreClient,
      addEvent,
      cancelEvent,
      setEventStatus,
      removeEvent,
      toggleSlot,
      addDocument,
      removeDocument,
      setClinicStatus,
      setClinicPlan,
      addClinic,
      inviteBusiness,
      toggleAccountActive,
    }),
    [
      data,
      toast,
      notify,
      resetDemo,
      addClient,
      removeClient,
      restoreClient,
      addEvent,
      cancelEvent,
      setEventStatus,
      removeEvent,
      toggleSlot,
      addDocument,
      removeDocument,
      setClinicStatus,
      setClinicPlan,
      addClinic,
      inviteBusiness,
      toggleAccountActive,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore requires StoreProvider");
  return ctx;
}
