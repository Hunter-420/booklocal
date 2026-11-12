# BookLocal - Service Business Booking App

A specialized scheduling web application built for service-based businesses, featuring double-booking exclusion constraints, automated 30-minute interval slot generation, 24-hour cancellation governance, customer self-service, and owner management. Demonstrates the Standard Package for the Next.js and Modern Web App Fiverr gig.

## Demo Notice

This application is a demo project showcasing custom booking logic, client-side persistence, accessible component design, and dual-perspective workflows (Customer and Studio Owner).

## Project Overview

- Package: Standard Package ($450)
- Demo Brand: Willow and Stone (organic hair and styling studio)
- Location: 142 Ponsonby Road, Ponsonby, Auckland 1011
- Live Demo: Hosted on GitHub Pages
- Stack: React 18, TypeScript (strict), Vite, Tailwind CSS, Lucide Icons, Zod

## Design Tokens and Styling

- Headings Typography: Fraunces
- Body Typography: DM Sans
- Primary Brand Color: Forest Green (#1F4D3F), Hover (#2C6652)
- Background: Cream (#FBF6EF)
- Body Ink: Dark Forest Ink (#1F2A24), Muted Text (#6B7A72)
- Sand Surfaces: Sand (#F0E6D8), Sand Light (#F5F0E8), Line Border (#E8DDCB)
- Mint Accent: Mint Tint (#E3F1E8)
- Supporting Terracotta: Terracotta Accent (#E07A5F)
- Radii: 12px for buttons and action elements, 20px for cards

## Core Features and Workflows

1. Client Online Booking (/):
   - Service selection with duration (30 to 180 min) and price tags.
   - Interactive appointment date picker.
   - Dynamic slot generation: 30-minute increments enforcing business hours, excluding Sunday rest days, excluding blocked dates, and excluding slots running past studio closing.
   - Double-booking exclusion constraint: impossible for two users to hold overlapping appointment windows.
   - Immediate confirmation with instant iCalendar (.ics) download.

2. Client Portal (/my-bookings):
   - Upcoming and Past booking tabs.
   - Booking detail cards with service, date, time, and tabular pricing.
   - Strict 24-hour cancellation rule: buttons are disabled within 24 hours of appointment start time with explanatory messaging.
   - Confirmation dialog before completing cancellations.
   - Empty states with call to action.

3. Owner Dashboard (/owner):
   - Real-time studio metric tiles (Today Schedule, Total Revenue Booked, Confirmed Bookings count, Blocked Holidays).
   - Filterable appointments schedule table by status (Confirmed, Cancelled) and client search.
   - Quick date blocker tool to take the studio offline for holidays or maintenance.

4. Owner Settings (/owner/settings):
   - Full weekly opening hours configurator with open/close times and day-off toggles.
   - Treatment and service catalog editor (add, edit duration, price, description, remove).
   - Blocked dates holiday calendar manager.

5. Client and Owner Demo Switcher:
   - One-click role switcher in navigation allows instant switching between Samantha Reed (Customer) and Maya Ellison (Studio Owner).

## Local Development

```bash
# Install dependencies
npm install

# Run local dev server
npm run dev

# Run automated tests
npm test

# Build production bundle
npm run build

# Preview build locally
npm run preview
```

## License

MIT
