# Aura Fit

Aura Fit is a premium dark-mode fitness and health tracking app built with React, Tailwind CSS, and Recharts. It features:

- Personalized dashboard with calorie, activity, and water scoring
- Workout and meal logging with macro breakdowns
- Weight tracking with progress trend charts
- Smart goal setting and milestone tracking
- AI Fitness Coach prompts and personalized guidance
- Secure user auth flow with local profile persistence

## Tech stack

- React + Vite
- Tailwind CSS
- Recharts
- Lucide icons
- Express API stub for local backend orchestration

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the app:
   ```bash
   npm run dev
   ```
3. Open the frontend at http://localhost:5173
4. The API server runs in parallel on http://localhost:5001

## Production build

```bash
npm run build
```

## Notes

This app is designed to be a polished single-page experience and stores progress in local browser state by default. The backend included is intentionally lightweight and serves as an application shell for future integration with a real auth provider or database.
