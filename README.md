# Finlytics

Finlytics is a premium single-page finance dashboard built for a frontend developer assessment. It combines a cinematic scroll-driven intro with a fully interactive dashboard experience for tracking balance, spending, transactions, and insights.

## Live Product Direction

- Futuristic scrollytelling intro using the provided image sequence
- Neon purple dark theme with glassmorphism surfaces
- Warm beige light theme with improved readability
- Dashboard UI that feels like a product showcase, not just a CRUD table

## Core Features

- Scroll-based animated intro sequence
  - particle field
  - flowing wave transition
  - chart formation reveal
  - dashboard preview handoff
- Dashboard overview
  - total balance
  - income
  - expenses
  - clickable metric drilldowns
- Charts and analytics
  - revenue trend chart
  - category spending donut
  - monthly net balance bars
  - calendar-linked filtering
- Transactions system
  - add transaction modal
  - edit transaction
  - delete transaction
  - search
  - filters
  - sort by date and amount
  - CSV export
- Role-based UI
  - admin can add, edit, and delete
  - viewer is read-only
- Insights
  - highest spending category
  - monthly comparison
  - average transaction
  - savings rate
  - smart observations
- Persistence
  - transactions saved in localStorage
  - selected theme saved in localStorage
  - selected role saved in localStorage

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- React Context + `useReducer`
- Custom CSS animations
- Custom SVG-based data visualizations

## Project Structure

```text
src/
  components/
    BalanceBars.jsx
    CalendarPanel.jsx
    CategoryChart.jsx
    DashboardPreview.jsx
    FiltersBar.jsx
    Header.jsx
    InsightsPanel.jsx
    InvoicesPanel.jsx
    ParticleScrollAnimation.jsx
    ScrollIntro.jsx
    Sidebar.jsx
    SummaryCard.jsx
    TextOverlays.jsx
    TransactionModal.jsx
    TransactionTable.jsx
    TrendChart.jsx
  context/
  data/
  utils/
public/
  intro-sequence/
```

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The app runs on:

```text
http://localhost:5173
```

## Production Build

```bash
npm run build
```

## Demo Usage

There is no backend auth flow in this build. Role behavior is simulated from the UI.

- `Admin`
  - can add transactions
  - can edit transactions
  - can delete transactions
- `Viewer`
  - can explore the dashboard
  - cannot modify data

## Design Notes

This project was intentionally designed as a premium finance experience:

- dark mode uses deep purple-blue neon lighting
- light mode uses warm beige surfaces rather than plain white
- cards use layered glassmorphism, glow, and depth
- the intro turns abstract visual motion into structured dashboard content
- the layout is responsive across desktop, tablet, and mobile

## Deployment

This is a static frontend and can be deployed directly on Vercel.

### Vercel Settings

- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`

## Assessment Coverage

This submission covers the requested frontend assignment areas:

- clean dashboard overview
- time-based and category-based charts
- transaction exploration
- role-based UI
- insights section
- state management
- responsive layout
- empty states
- local persistence
- export functionality
- polished documentation

## Final Notes

The app is frontend-only by design because the original assignment allowed static or mock data and focused primarily on frontend thinking, component structure, interaction design, and UI quality.

If extended later, the next natural additions would be:

- backend API integration
- authentication
- database persistence
- live data sync
- advanced analytics
