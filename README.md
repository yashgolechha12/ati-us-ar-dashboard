# Ati US AR Dashboard

Live Accounts Receivable dashboard for Ati Motors Inc (US entity).

Forked from the AMIDC AR Dashboard — same 5-tab layout, styling, and logic,
pointed at a different ERPNext site and reporting in USD instead of INR.

## Features

- 5-tab dashboard: Overview, Customer Ageing, Customer Drill-down, Collections Queue, Monthly MIS
- Dark theme with Ati Robotics brand colors
- Real-time data from ERPNext (ati-us.v.frappe.cloud)
- Password-protected with 8-hour session cookies
- Server-side API calls (token never exposed to browser)

## Setup

```bash
npm install
cp .env.example .env.local
# Fill in your environment variables
npm run dev
```

## Environment Variables

- `ERPNEXT_URL`: ERPNext instance URL (https://ati-us.v.frappe.cloud)
- `ERPNEXT_TOKEN`: API token (key:secret format)
- `DASHBOARD_PASSWORD`: Dashboard login password

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Recharts
- Deployed on Vercel
