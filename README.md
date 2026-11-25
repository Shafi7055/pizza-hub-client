# PizzaHub

A responsive PizzaHub landing page built with Next.js, React, JSX, and CSS. It includes live API-backed authentication, ordering, menus, role dashboards, favorites, reviews, dark mode, and demo seed accounts.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Set `NEXT_PUBLIC_API_URL` in `.env.local` to the Express API origin (see `.env.example`). Use `npm run build` to create a production build and `npm start` to run it.

## Demo routes

- `/` — home page
- `/browse-menu` and `/menu/[id]` — searchable menu and item details
- `/sign-in` and `/sign-up` — API-backed authentication screens
- `/dashboard` — role workspace chooser
- `/dashboard/vendor/*`, `/dashboard/customer/*`, and `/dashboard/admin/*` — role-specific dashboard templates
- `/profile-settings`, `/payment/success`, and `/payment/cancel` — account and payment route templates

Use the sign-in page's demo role cards to explore seeded customer, vendor, and admin accounts. Email/password sign-in uses Better Auth when MongoDB-backed auth is enabled and the local token auth otherwise. Google sign-in appears only when the OAuth credentials are configured.
