# Frontend Component

## Overview

This section documents the dashboard components in `src/components` and the global styling in `src/style.css`.

The dashboard implements an interactive analytics workflow:

- `ViewSwitcher.vue` — Top-level tab navigation
- `Dashboard.vue` — Coordinates the timeline chart and histogram
- `TimelineChart.vue` — Renders publication counts by year; emits year selection events
- `PatentHistogram.vue` — Displays citation distribution for the selected year
- `style.css` — Global app styling

### Data Flow

The dashboard uses one-way data binding:

1. `TimelineChart.vue` loads and visualizes timeline data
2. User clicks a year on the chart → emits `yearSelected`
3. `Dashboard.vue` updates local state with the selected year
4. `PatentHistogram.vue` watches the `year` prop and fetches corresponding data

## File Details

### `src/components/TimelineChart.vue`

**Purpose:** Renders an interactive D3 line chart of CS publications (2011–2021)

**Key Features:**
- Loads data from `mock/timeline_mock.json`
- Displays a loading spinner while fetching
- Highlights the selected year in orange
- Shows hover tooltips via D3
- Emits `yearSelected` on point click

**Notes:**
- Chart renders once on component mount
- Tooltip DOM is managed directly through D3

### `src/components/Dashboard.vue`

**Purpose:** Manages parent-child communication between timeline and histogram

**Key Features:**
- Stores `selectedYear` in a Vue `ref`
- Listens for `yearSelected` from `TimelineChart`
- Passes the selected year to `PatentHistogram` via prop

### `src/components/PatentHistogram.vue`

**Purpose:** Visualizes citation distribution for a given year

**Key Features:**
- Accepts a `year` prop
- Fetches data via `fetchPatentHistogram(year)` from `services/api`
- Caps citation counts at 20; groups larger values as "20+"
- Uses logarithmic y-axis for readability
- Shows hover tooltips

**Notes:**
- No chart renders until a year is selected
- Clears SVG on each data update

### `src/components/ViewSwitcher.vue`

**Purpose:** Provides tabbed page layout

**Key Features:**
- Uses PrimeVue `TabView` component
- Exposes three tabs: Author Graph, Dashboard, Chat
- `Dashboard.vue` is mounted in the Dashboard tab

**Notes:**
- `activeIndex = 3` may need adjustment based on visible tabs

### `src/style.css`

**Purpose:** Establishes global visual defaults

**Key Features:**
- Defines typography and rendering preferences
- Sets background, link, button, and heading styles
- Provides full-height layout for `#app`
- Includes light-mode media query

## Dependencies

- `vue` — Components, props, state, lifecycle hooks, watchers
- `d3` — SVG rendering, scales, axes, interactions
- `primevue` — Tab layout

## Implementation Notes

- Timeline chart uses mock data; histogram uses live API
- Both charts use fixed dimensions (900×400) and are not responsive
- Tooltips are appended directly to `body`
- Dashboard logic is minimal and extensible

## Getting Started

```bash
npm install
npm run dev
```

## Attribution

Designed and built by Yunkai Xu. GenAI (Codex, ChatGPT) assisted with formatting, styling, and documentation.
