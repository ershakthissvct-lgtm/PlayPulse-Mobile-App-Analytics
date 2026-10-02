# PlayPulse – Mobile App Rating & Store Analytics

A React + TypeScript dashboard for exploring mobile app store data. It calculates rating statistics, compares categories, explores install and pricing patterns, and lets users upload and export CSV data.

## Run locally

Install Node.js, then run:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Production build

```bash
npm run build
npm run preview
```

## Features

- App rating overview and distribution charts
- Category-level comparisons
- Install, app-size and pricing analysis
- Competitor benchmark simulator
- CSV upload and analysed-data export
- App and category detail views

## Technology

React, TypeScript, Vite, Tailwind CSS, and the chart and icon libraries used by the project.

## Analysis

The dashboard uses local TypeScript statistical functions in `src/utils/analytics.ts`. It does not require a Gemini API key or make Gemini API calls. The sample data is in `src/data/dataset.ts`.
