# KisanSetu — Frontend Prototype

A working React + Tailwind prototype covering all four roles from the
technical approach diagram: Farmer, Procurement Officer, Quality
Inspector, and Administrator. Built for demoing the SIH26032 solution
end to end in a browser — no backend required, all data lives in memory
for the session.

## Run it

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

## What's real vs. what's mocked

- **Real**: every screen, every form, every state transition. Submitting
  a request as the Farmer actually appears in the Procurement Officer's
  queue live — try it. Approving a lot as the Quality Inspector actually
  unlocks invoicing for the Officer.
- **Mocked**: data resets on page refresh (in-memory only, no database).
  SMS notifications appear in the in-app Notifications tab instead of
  being sent to a real phone.

## How the demo flow works

1. Open the landing page, pick **Farmer**, submit a procurement request.
2. Click **Switch role** → **Procurement Officer** → verify the request,
   schedule it, record weighing.
3. Switch to **Quality Inspector** → record grade/moisture → approve the
   lot.
4. Switch back to **Procurement Officer** → generate invoice → confirm
   payment.
5. Switch to **Farmer** → see the payment status and SMS-style
   notification appear.
6. Switch to **Administrator** → see the whole thing reflected in the
   live monitoring dashboard.

## Structure

```
src/
  lib/store.jsx        shared in-memory data + actions (the "backend" for this demo)
  components/          PortalShell (sidebar shell), ui.jsx (Card, Badge, StatCard)
  pages/Landing.jsx     role picker with the bridge hero
  pages/farmer/         Farmer portal
  pages/officer/        Procurement Officer portal
  pages/inspector/      Quality Inspector portal
  pages/admin/          Administrator portal
```

## Connecting to a real backend later

Replace the actions inside `src/lib/store.jsx` with calls to your API
(the Node.js/Express/PostgreSQL backend from earlier) — the component
code doesn't need to change, since every page reads/writes through
`useStore()`.

## Tech stack

React 19 · Vite · Tailwind CSS v4 · React Router · Lucide icons
