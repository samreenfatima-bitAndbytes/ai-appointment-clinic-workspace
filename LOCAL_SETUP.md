# AI Appointment static demo — local setup

Vite + React static build for Vercel. No Django, calendar OAuth, or LLM keys.

## Run locally

```bash
cd local-projects/AI-Appointment-static
npm install
npm run dev
```

Open http://localhost:2100

## Demo logins

| Role     | Email                       | Password     | Focus |
|----------|-----------------------------|--------------|--------|
| Business | `owner@clinic.example`      | `DemoPass1!` | Book/remove appointments, toggle slots, add/archive clients, FAQ upload + chat |
| Admin    | `admin@appointment.example` | `DemoPass1!` | Add clinics, change plan/status, invite/disable business owners |

## Vercel

- Root: this folder
- Build: `npm run build`
- Output: `dist`
