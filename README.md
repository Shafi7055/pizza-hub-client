# PizzaHub

A responsive PizzaHub demo landing page built with Next.js, React, JSX, and CSS. It includes a sample menu with category filters, search, and an interactive bag counter.

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
- `/sign-in` and `/sign-up` — authentication UI placeholders
- `/dashboard` — role workspace chooser
- `/dashboard/vendor/*`, `/dashboard/customer/*`, and `/dashboard/admin/*` — role-specific dashboard templates
- `/profile-settings`, `/payment/success`, and `/payment/cancel` — account and payment route templates

Authentication, role guards, API data, ordering, and payment processing are not connected in this UI scaffold yet.
