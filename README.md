# PizzaHub

A responsive PizzaHub landing page built with Next.js, React, JSX, and CSS. It includes live API-backed authentication, ordering, menus, role dashboards, favorites, reviews, dark mode, and demo seed accounts.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Use `npm run build` to create a production build and `npm start` to run it.

## Demo routes

- `/` — home page
- `/browse-menu` and `/menu/[id]` — searchable menu and item details
- `/sign-in` and `/sign-up` — API-backed authentication screens
- `/dashboard` — role workspace chooser
- `/dashboard/vendor/*`, `/dashboard/customer/*`, and `/dashboard/admin/*` — role-specific dashboard templates
- `/profile-settings`, `/payment/success`, and `/payment/cancel` — account and payment route templates

Use the sign-in page's demo role cards to explore seeded customer, vendor, and admin accounts. Set `NEXT_PUBLIC_API_URL` to the Express API origin. Authentication tokens are stored by the browser and every protected action is still verified by the server.
