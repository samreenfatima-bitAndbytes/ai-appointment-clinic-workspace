export const DEMO_PASSWORD = "DemoPass1!";

export const DEMO_USERS = [
  {
    id: "u-admin",
    email: "admin@appointment.example",
    password: DEMO_PASSWORD,
    fullName: "Admin",
    isAdmin: true,
  },
  {
    id: "u-owner",
    email: "owner@clinic.example",
    password: DEMO_PASSWORD,
    fullName: "Dr. Maya Chen",
    isAdmin: false,
    businessName: "Harbor Wellness Clinic",
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

function isoDaysFromNow(days, hour, minute = 0) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

export const SEED_EVENTS = [
  {
    id: "e1",
    title: "Initial consult — Jordan Lee",
    description: "Intake and goals",
    clientId: "c1",
    start: isoDaysFromNow(1, 10, 0),
    end: isoDaysFromNow(1, 10, 45),
    location: "Room A",
  },
  {
    id: "e2",
    title: "Follow-up — Sam Rivera",
    description: "Review plan",
    clientId: "c2",
    start: isoDaysFromNow(2, 14, 0),
    end: isoDaysFromNow(2, 14, 30),
    location: "Virtual",
  },
  {
    id: "e3",
    title: "Wellness check — Avery Nguyen",
    description: "",
    clientId: "c3",
    start: isoDaysFromNow(3, 11, 0),
    end: isoDaysFromNow(3, 11, 30),
    location: "Room B",
  },
];

export const SEED_SLOTS = [
  { id: "s1", day: 1, start: "09:00", end: "12:00", available: true },
  { id: "s2", day: 1, start: "13:00", end: "17:00", available: true },
  { id: "s3", day: 3, start: "09:00", end: "12:00", available: true },
  { id: "s4", day: 4, start: "10:00", end: "16:00", available: true },
];

export const SEED_DOCS = [
  {
    id: "d1",
    filename: "clinic-faq.txt",
    content: `Harbor Wellness Clinic FAQ
Q: Hours?
A: Mon–Fri 9:00–17:00. Closed weekends.

Q: How do I book?
A: Use the assistant or call the front desk — we confirm within one business day.

Q: Cancellation?
A: Please cancel at least 24 hours ahead to avoid a late fee.

Q: Virtual visits?
A: Yes — select Virtual as the location when booking.`,
  },
];

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
    return "Virtual visits are available — choose Virtual as the location when booking.";
  return "Thanks for your message. Ask about hours, booking, cancellation, or virtual visits.";
}
