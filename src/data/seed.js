export const DEMO_PASSWORD = "DemoPass1!";

export const DEMO_USERS = [
  {
    id: "u-admin",
    email: "admin@appointment.example",
    password: DEMO_PASSWORD,
    fullName: "Alex Rivera",
    isAdmin: true,
    businessName: "AI Appointment Platform",
  },
  {
    id: "u-owner",
    email: "owner@clinic.example",
    password: DEMO_PASSWORD,
    fullName: "Dr. Maya Chen",
    isAdmin: false,
    businessName: "Harbor Wellness Clinic",
    clinicId: "clinic-harbor",
  },
  {
    id: "u-ridge",
    email: "ops@ridgeview.example",
    password: DEMO_PASSWORD,
    fullName: "Jordan Blake",
    isAdmin: false,
    businessName: "Ridgeview Dental",
    clinicId: "clinic-ridge",
  },
  {
    id: "u-north",
    email: "front@northline.example",
    password: DEMO_PASSWORD,
    fullName: "Sam Ortiz",
    isAdmin: false,
    businessName: "Northline Physio",
    clinicId: "clinic-north",
  },
];

/** Platform catalog for Admin (multi-tenant overview). Harbor is the live Business demo workspace. */
export const SEED_CLINICS = [
  {
    id: "clinic-harbor",
    name: "Harbor Wellness Clinic",
    owner: "Dr. Maya Chen",
    plan: "Growth",
    status: "active",
    clients: 3,
    appointments: 3,
    docs: 1,
    demoLogin: true,
  },
  {
    id: "clinic-ridge",
    name: "Ridgeview Dental",
    owner: "Jordan Blake",
    plan: "Starter",
    status: "active",
    clients: 28,
    appointments: 41,
    docs: 4,
    demoLogin: false,
  },
  {
    id: "clinic-north",
    name: "Northline Physio",
    owner: "Sam Ortiz",
    plan: "Growth",
    status: "trial",
    clients: 12,
    appointments: 9,
    docs: 2,
    demoLogin: false,
  },
];

export const SEED_CLIENTS = [
  {
    id: "c1",
    firstName: "Jordan",
    lastName: "Lee",
    email: "jordan.lee@example.com",
    phone: "+1 555 0101",
    notes: "Prefers morning slots",
    active: true,
  },
  {
    id: "c2",
    firstName: "Sam",
    lastName: "Rivera",
    email: "sam.rivera@example.com",
    phone: "+1 555 0102",
    notes: "Follow-up after consult",
    active: true,
  },
  {
    id: "c3",
    firstName: "Avery",
    lastName: "Nguyen",
    email: "avery.n@example.com",
    phone: "+1 555 0103",
    notes: "",
    active: true,
  },
];

/** Monday=0 … Sunday=6 (matches DAY_NAMES). Skip weekends for clinic hours. */
function isoNextWeekday(weekdayMon0, hour, minute = 0, weekOffset = 0) {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  const jsDay = d.getDay(); // Sun=0
  const mon0 = jsDay === 0 ? 6 : jsDay - 1;
  let add = (weekdayMon0 - mon0 + 7) % 7;
  if (add === 0 && d <= new Date()) add = 7;
  add += weekOffset * 7;
  d.setDate(d.getDate() + add);
  return d.toISOString();
}

export const SEED_EVENTS = [
  {
    id: "e1",
    title: "Initial consult — Jordan Lee",
    description: "Intake and goals",
    clientId: "c1",
    start: isoNextWeekday(0, 10, 0),
    end: isoNextWeekday(0, 10, 45),
    visitType: "in_person",
    room: "Room A",
    status: "confirmed",
  },
  {
    id: "e2",
    title: "Follow-up — Sam Rivera",
    description: "Review plan",
    clientId: "c2",
    start: isoNextWeekday(2, 14, 0),
    end: isoNextWeekday(2, 14, 30),
    visitType: "virtual",
    room: "",
    status: "confirmed",
  },
  {
    id: "e3",
    title: "Wellness check — Avery Nguyen",
    description: "",
    clientId: "c3",
    start: isoNextWeekday(3, 11, 0),
    end: isoNextWeekday(3, 11, 30),
    visitType: "in_person",
    room: "Room B",
    status: "confirmed",
  },
];

/** Monday=0 … Friday=4 — matches FAQ Mon–Fri hours */
export const SEED_SLOTS = [
  { id: "s1", day: 0, start: "09:00", end: "12:00", available: true },
  { id: "s2", day: 0, start: "13:00", end: "17:00", available: true },
  { id: "s3", day: 2, start: "09:00", end: "12:00", available: true },
  { id: "s4", day: 3, start: "10:00", end: "16:00", available: true },
  { id: "s5", day: 4, start: "09:00", end: "17:00", available: true },
];

export const SEED_DOCS = [
  {
    id: "d1",
    filename: "clinic-faq.txt",
    content: `Harbor Wellness Clinic FAQ
Q: Hours?
A: Mon–Fri 9:00–17:00. Closed Saturdays and Sundays — appointments are only booked on weekdays.

Q: How do I book?
A: Use the assistant or call the front desk — we confirm within one business day.

Q: Cancellation?
A: Please cancel at least 24 hours ahead to avoid a late fee. Cancelled visits stay on the calendar as Cancelled.

Q: Virtual visits?
A: Yes — choose visit type Virtual when booking (no room needed).`,
  },
];

export const APPT_STATUSES = ["confirmed", "pending", "cancelled", "completed", "no_show"];

export const DAY_NAMES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function replyFromDocs(message, documents) {
  const q = String(message || "").toLowerCase();
  const corpus = documents.map((d) => d.content).join("\n");
  const pairs = [];
  for (const block of corpus.split(/\n(?=Q:)/i)) {
    const qm = block.match(/Q:\s*(.+)/i);
    const am = block.match(/A:\s*([\s\S]+)/i);
    if (qm && am) {
      pairs.push({
        q: qm[1].trim().toLowerCase(),
        a: am[1].trim().split("\n")[0].trim(),
      });
    }
  }
  const hit = pairs.find(
    (p) =>
      q.includes(p.q.slice(0, 10)) ||
      p.q.split(/\W+/).filter((w) => w.length > 3).some((w) => q.includes(w))
  );
  if (hit) return hit.a;
  if (/hour|open|when/i.test(q)) return "We are open Mon–Fri 9:00–17:00.";
  if (/book|appoint|schedule/i.test(q))
    return "You can book via this assistant or the front desk — we confirm within one business day.";
  if (/cancel/i.test(q)) return "Please cancel at least 24 hours ahead to avoid a late fee.";
  if (/virtual|zoom|online/i.test(q))
    return "Virtual visits are available — choose visit type Virtual when booking (no room needed).";
  if (/weekend|saturday|sunday/i.test(q))
    return "We are closed weekends. Appointments are only booked Monday–Friday.";
  return "Thanks for your message. Ask about hours, booking, cancellation, or virtual visits.";
}
