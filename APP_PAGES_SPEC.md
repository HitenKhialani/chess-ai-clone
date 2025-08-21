# Chess AI Website – Full UI/GUI Specification

Version: 1.0  
Owner: Design + Frontend  
Last Updated: 2025-08-20 18:38 IST  
Scope: End-to-end, minute-level UI behavior for all pages, navigation, interactions, and theming (current themes detected in code: dark, light, neon, zen, cosmos).

Notes:
- This document mirrors the actual structure/components detected in code:
  - Root layout: `app/layout.tsx` uses `ThemeProvider`, `Navbar`, `FloatingBackground`, `TimeTrackerProvider`, `UserProvider`.
  - Themes present: `dark`, `light`, `neon`, `zen`, `cosmos` (via `ThemeProvider` and `ThemeToggle`).
  - Global CSS vars defined for `:root` and `.dark` in `styles/globals.css`. Other themes are driven by runtime visuals (e.g., `FloatingBackground`) and component tokens.
- If you prefer exactly four themes, see Section 12 to remove/merge one and update this spec accordingly.

---

## 1) Global System

### 1.1 Design Tokens
- Typography
  - Font Family: Inter (via `next/font/google`), fallback: system-ui, sans-serif
  - Base Size: 16px; Scale: 12, 14, 16, 18, 20, 24, 28, 32, 40, 48
  - Weights: 400, 500, 600, 700
  - Line-Height: 1.45 body; 1.2–1.3 headings
- Spacing (rem)
  - 0, 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 6, 8
- Radius
  - `--radius`: 8px base (`styles/globals.css` uses 0.5rem); components can map xs=6, sm=8, md=12, lg=16, xl=24
- Shadows
  - sm, md, lg, xl (theme-tinted)
- Elevation
  - Surface-0 (page bg), Surface-1 (cards), Surface-2 (menus), Surface-3 (modals)
- Motion
  - Duration: 120ms, 200ms, 300ms
  - Easing: ease, ease-out, cubic-bezier(0.22,1,0.36,1)
  - Reduced Motion: respect prefers-reduced-motion

### 1.2 Layout & Grid
- Breakpoints: sm (640), md (768), lg (1024), xl (1280), 2xl (1536)
- Max content width: 1200px center-aligned (`<main class="container mx-auto px-4 py-8">`)
- Page gutters: 16–24px mobile, 24–32px desktop
- Header height: 64px (approx; driven by `Navbar`)
- Footer height: auto (min 56px)

### 1.3 Global Components
- Header (`components/navbar.tsx`)
  - Left: Brand/logo
  - Center: Primary navigation (links to key routes below)
  - Right: Theme toggle (`components/theme-toggle.tsx`), user menu, notifications (if any)
  - States: hover, active underline/tint, focus ring
- Floating Background (`components/FloatingBackground.tsx`)
  - Themed gradient overlay + animated orbs; opacity ≈ 0.25; GPU-accelerated transforms
  - Colors switch per theme; performance-friendly (60 FPS limit)
- Providers
  - `TimeTrackerProvider`: session timing utilities
  - `UserProvider`: auth/session context
  - `Toaster` (`components/ui/toaster`): top-right toasts; auto-dismiss 4–6s
- Modals/Drawers
  - Max width: 520/720px; overlay click, ESC, X button to close
  - Focus trap + scroll lock; accessible roles
- Forms
  - Inputs with labels, helper/error text; inline validation on blur and on submit
  - Keyboard: Enter submits; Tab/Shift+Tab navigates
- Tables/Lists
  - Sticky header (if used), row hover, selection states; sorting indicators if compiled in

### 1.4 Accessibility
- Color contrast AA minimum across themes
- Keyboard-first nav: Tab progression across header, menus, and chessboard controls
- ARIA roles for modals, menus, tabs
- Focus rings visible across themes
- Alt text for content-relevant images/icons

---

## 2) Themes (Detected: dark, light, neon, zen, cosmos)

This section documents each theme’s intended palette, backgrounds, and component mapping. In code, `styles/globals.css` defines tokens for `:root` (light) and `.dark`. `FloatingBackground.tsx` adds distinct visuals for `neon`, `zen`, `cosmos` as well. Ensure all components reference CSS variables/tokens rather than hardcoded hex.

Common tokens (from `styles/globals.css`):
- Background: `--background`
- Text: `--text-primary`, `--text-secondary`
- Surfaces: `--card`, `--popover`, `--secondary`, `--muted`, `--accent`
- Foregrounds: `--card-foreground`, `--popover-foreground`, etc.
- Borders/Ring: `--border`, `--ring`
- Chart colors: `--chart-1..5`
- Sidebar tokens: `--sidebar-*`

For each theme:

### 2.1 Dark
- Palette (from `.dark` in `styles/globals.css`)
  - Background: rgb(18,18,18)
  - Text Primary/Secondary: rgb(230,230,230) / rgb(150,150,150)
  - Card: rgb(30,30,30) with foreground rgb(230,230,230)
  - Border: rgb(60,60,60)
  - Primary/Accent: light-on-dark scheme; ring: light gray
- Floating Background
  - Orbs: electric cyan, sea green, bright cyan, aqua, coral pink, purple/red accents
  - Gradient overlay: subtle cyan/green/purple radial blend
- Chessboard
  - Light/Dark squares: rgb(125,148,93) / rgb(100,133,73)
  - Highlights: use cyan/teal accents at 0.2–0.35 alpha
- Components
  - Buttons: filled primary uses light text; outline with border gray-600
  - Focus ring: `--ring` (light) with sufficient contrast

### 2.2 Light
- Palette (from `:root`)
  - Background: rgb(245,245,245)
  - Text Primary/Secondary: rgb(30,30,30) / rgb(85,85,85)
  - Card: #fff with dark text; Border: rgb(220,220,220)
- Floating Background
  - Orbs: warm orange/amber/coral/yellow tones
  - Gradient overlay: light warm radial accents
- Chessboard
  - Light/Dark squares: rgb(240,217,181) / rgb(181,136,99)
  - Highlights: orange/amber at 0.18–0.28 alpha
- Components
  - Buttons: primary rgb(0,123,255); outline: gray-200 borders; proper hover/active tints

### 2.3 Neon
- Palette
  - High-contrast dark base (inherits from dark tokens at runtime)
  - Neon accents: yellow, pink, green, orange, purple, red, magenta, cyan
- Floating Background
  - Orbs: neon yellow/pink/green/orange/purple/red/magenta/cyan; slightly higher opacity (0.15–0.18)
  - Gradient overlay: neon magenta/green/yellow radial blend
- Chessboard
  - Keep base board; overlays (arrows/highlights) use neon cyan/magenta at 0.25–0.35 alpha
- Components
  - Buttons: add neon-glow hover (shadow with colored spread)
  - Focus ring: neon cyan 2px outer ring

### 2.4 Zen
- Palette
  - Calm blues/indigos/purples; natural accents (brown/green)
- Floating Background
  - Orbs: soft/medium blue, indigo, purple, with mild brown/green accents at 0.08–0.1
  - Gradient overlay: soft blue/indigo/purple radial
- Chessboard
  - Highlight tones: indigo/purple translucent (0.18–0.28 alpha)
- Components
  - Buttons: gentle hover, minimal elevation; muted focus ring with high contrast maintained

### 2.5 Cosmos
- Palette
  - Space-themed: slate/blue-violet/royal blue with hot pink nebula accents
- Floating Background
  - Orbs: medium slate blue, blue violet, royal blue, hot pink, starlight, midnight
  - Gradient overlay: slate/royal blue/hot pink blend
- Chessboard
  - Highlight tones: royal blue/pink at 0.2–0.3 alpha
- Components
  - Buttons: cosmic accent tints; slightly more dramatic hover elevation

Implementation requirements:
- Ensure CSS variable sets exist for all themes if component colors visibly differ. Currently only `:root` and `.dark` define full sets. For stronger fidelity, add theme-specific scopes (e.g., `[data-theme="neon"] { --accent: ... }`) mirroring the tokens above.
- `ThemeToggle` cycles: dark → light → neon → zen → cosmos (persist in localStorage via next-themes).

---

## 3) Navigation Map

### 3.1 Top-Level Routes (detected)
- `/` Home (exists: `app/page.tsx`)
- `/analysis` (exists: `app/analysis/page.tsx`)
- `/dashboard` (exists: `app/dashboard/page.tsx`)
- `/login` (exists: `app/login/page.tsx`)
- `/puzzles` (exists: `app/puzzles/` directory; confirm main entry file `page.tsx`)
- `/game` (exists: `app/game/`; confirm `page.tsx` or nested routes)
- `/play` (exists: `app/play/`)
- `/review` (exists: `app/review/`)
- `/report` (exists: `app/report/`)
- `/learn` (exists: `app/learn/` with many items; confirms courses/lessons)
- Other namespaces: `app/api/*` (server routes), `app/themes/` (internal)

### 3.2 Primary Nav Behavior
- Active link highlighted with accent underline and/or color
- Hover: subtle tint; keyboard focus ring visible
- Mobile: hamburger → slide-in drawer; body scroll lock

### 3.3 Secondary/Contextual Nav
- Tabs within pages (e.g., Analysis: Summary, Engine, Report)
- Breadcrumbs for nested content (Learn/Courses)

---

## 4) Pages

For each page: Purpose, Layout, Sections, States, Interactions, Minute-to-minute walkthrough.

### 4.1 Home (`/`)
- Purpose: Introduce app; funnel to Analysis, Puzzles, Learn
- Layout: Full-width hero; `FloatingBackground` behind content; `Navbar` fixed top
- Above-the-fold
  - Headline + subheadline
  - Primary CTA: Analyze a Game → `/analysis`
  - Secondary CTA: Try Daily Puzzle → `/puzzles`
  - Theme toggle visible in header
- Sections
  - Feature highlights (`components/features.tsx`), testimonials, success stories, hero/How-it-works
- States
  - Normal, reduced-motion (disable heavy background motion)
- Interactions
  - Button hover: scale 1.02, shadow-md → lg; active scale 0.98
  - Theme toggle updates background/accents with 200–300ms transitions
- Minute-to-minute
  1) Load: orbs animate subtly (60 FPS capped)  
  2) Hover CTA: elevation + tint  
  3) Toggle theme: gradient + tokens cross-fade  
  4) Scroll: reveal feature cards with staggered fade-up

### 4.2 Analysis (`/analysis`)
- Purpose: PGN/FEN analysis with engine and insights
- Layout: Two-column on desktop (board left, moves/insights right); stacked on mobile
- Sections
  - Input controls: tabs PGN/FEN, textarea, examples; Analyze button
  - Chessboard panel (board controls: flip, autoplay, arrows toggle; evaluation bar)
  - Move List panel (SAN list with accuracy/blunder markers; click to navigate)
  - Insights cards: Accuracy %, CPL, Mistakes/Blunders, Best Move %
  - Engine pane: best line, depth, nodes, MultiPV toggle (1–3)
- States
  - Empty: placeholder with examples  
  - Loading: skeletons for board frame, list, cards  
  - Error: toast + inline error box  
  - Engine offline: disable live eval; hint to retry
- Interactions
  - Paste PGN → sanitize; analyze triggers async request; top progress bar
  - Click move → board updates with arrows (played vs best) and delta tooltip
  - Keyboard: ←/→ moves, Space autoplay, F flip board
- Minute-to-minute
  1) Paste PGN, click Analyze  
  2) Progress bar animates; list fills incrementally  
  3) Cards count up on first render  
  4) Selecting a blunder shows red arrow + better line tooltip  
  5) Toggle MultiPV expands engine lines

### 4.3 Dashboard (`/dashboard`)
- Purpose: Overview of recent analyses, streaks, progress
- Layout: Header + optional sidebar; grid of widgets
- Widgets
  - Recent Analyses list (5–10)
  - Performance chart (Accuracy over time)
  - Puzzle streak badge
  - Quick actions (New Analysis, Daily Puzzle, Continue Learning)
- States
  - Empty: prompts to start analysis/puzzle
  - Loading: skeletons for cards and list
- Interactions
  - Click cards → deep-link to detail (analysis, puzzle, course)
- Minute-to-minute
  1) Page shows skeletons  
  2) Data arrives; widgets animate in  
  3) User drills down via cards/links

### 4.4 Puzzles (`/puzzles`)
- Purpose: Daily and practice puzzle solving
- Layout: Board-centric; focus mode
- Components
  - Board with attempt state and legal move highlights
  - Prompt: e.g., “White to move and mate in 2”
  - Feedback: correct/try again; optional sound cues; hint levels (square → candidate move → full line)
  - Progress meter + streak indicator
- States
  - Daily puzzle (one per day), Practice categories, Completed summary
- Interactions
  - Drag pieces; snap; invalid moves shake subtly (reduced on prefers-reduced-motion)
  - Keyboard: optional square navigation and Enter
- Minute-to-minute
  1) Start puzzle → side to move highlighted  
  2) On move, animate piece; feedback shows  
  3) On success, themed success animation  
  4) Review line with step controls

### 4.5 Learn (`/learn`, nested)
- Purpose: Structured courses/lessons
- Index
  - Grid of lessons/courses with difficulty tags; filters for phase (opening/middlegame/endgame/tactics)
- Detail / Player
  - Lesson content (video/text) + interactive board steps
  - Notes, key positions, mini-quiz at end
- States
  - Locked/Unlocked; progress ring on completed
- Minute-to-minute
  1) Open lesson; intro expands  
  2) Stepper auto-centers key squares  
  3) Quiz tasks; immediate feedback

### 4.6 Game/Play/Review/Report (confirm exact UX per page)
- Game (`/game`) and Play (`/play`)
  - Live board vs bot/human; time controls; pause/resign; evaluation optional
- Review (`/review`)
  - Post-game review with accuracy, mistakes, themes detected; quick links to puzzles
- Report (`/report`)
  - Full printable/shareable report view; export options (PDF via `components/GameReportPDF.tsx`)

### 4.7 Auth (`/login`)
- Purpose: Sign in to access saved analyses, progress
- UI: Email/password; OAuth (if any); validation; error toasts

---

## 5) Component Catalog (Key Interactive Elements)

- Chessboard (e.g., `components/chess-board.tsx`, `puzzle-board.tsx`, `gm-puzzle-board.tsx`)
  - Props: orientation, arrows, highlights, disabled state
  - States: idle, dragging, illegal move, check, mate
- Move List (`components/move-history.tsx`, `MoveHistoryPanel.tsx`)
  - Click to navigate; hover preview eval delta; virtualized for long games
- Evaluation Graph (`components/EvaluationGraphCard.tsx`)
  - Normalized scale; tooltips; theme-tinted lines
- Score Cards (`components/AccuracyScoreCard.tsx`, `MoveInsightsCard.tsx`)
  - Big number + icon; color-coded by theme
- Progress Bar
  - Slim top loader under header during async
- Buttons (`components/ui/button.tsx`)
  - Variants: primary, secondary, ghost, outline, destructive
  - Loading spinner inside button
- Inputs (`components/ui/input.tsx`, `textarea.tsx`)
  - With labels/help/errors; character counts as needed
- Tabs/Popover/Tooltip (Shadcn UI)
  - Accessible; active indicator; minimal delay for tooltips
- Toasts (`components/ui/toaster.tsx`)
  - Positions: top-right; auto-dismiss 4–6s; accessible content

---

## 6) States and Edge Cases

- Loading
  - Skeletons: board frame, list items, cards (3–5 placeholders)
- Empty
  - Helpful action + sample links (PGN/FEN examples)
- Errors
  - Inline message + retry; toast for unexpected errors
- Offline/Engine Unavailable
  - Disable toggles; show hint to retry or switch engine
- Slow Network
  - Optimistic UI where sensible; show “Still working…” after 3s

---

## 7) Animations & Micro-interactions

- Theme Switch
  - Background gradient cross-fade (200–300ms)
  - Components recolor with 120–200ms transitions
- Board Moves
  - Piece slide (120ms), capture bounce (80ms)
  - Arrow draw fade-in (120ms)
- Buttons/Links
  - Hover: elevation + 2% scale; Active: 98% scale
- Cards
  - Hover lift: shadow-md → shadow-lg
- Success
  - Subtle confetti/particle burst; respect reduced motion

---

## 8) Theming Implementation Rules

- All colors derive from CSS variables per theme root scope 
  - Already present for light/dark (`:root`, `.dark`)
  - For neon/zen/cosmos, add `[data-theme="neon|zen|cosmos"] { --token: value }` blocks to `styles/globals.css` for full parity
- No hardcoded hex in components; use tokens (border, ring, accent)
- `FloatingBackground` reads `resolvedTheme`/`theme` to pick orb palettes and gradient overlays
- Theme toggle cycles among five themes; persists via next-themes
- Focus rings must meet contrast; use `--ring` or theme accent

---

## 9) Responsive Behavior

- Mobile (≤768px)
  - Header condenses; nav inside drawer
  - Analysis: stacked (board above, move list below)
  - Puzzles: full-bleed board; bottom actions bar
- Tablet (768–1024px)
  - Two-column for analysis; move list collapsible
- Desktop (≥1024px)
  - Comfortable gutters; fixed sidebar where applicable

---

## 10) Content Guidelines

- Tone: concise, supportive, expert
- Numbers: formatted with units; 1 decimal for percentages
- Icons: Lucide; sizes 16–20 inline, 24–32 in cards
- Copy for errors: human-friendly and actionable

---

## 11) QA Checklist (Per Page)

- Accessibility
  - Tab order; focus trap in modals; ARIA labels
- Theme Fidelity
  - Compare tokens vs theme spec across five themes
- Performance
  - LCP < 2.5s mid devices; anim frames within 16ms budget
- Error/Empty
  - All async flows have error + empty states
- Keyboard
  - Board nav, move list nav, menu operations
- Responsive
  - Visual checks at sm, md, lg

---

## 12) Adjusting to Exactly Four Themes (If Required)

- Choose four of: dark, light, neon, zen, cosmos
- Update files:
  - `app/layout.tsx`: `themes={["dark","light","neon","zen"]}` (example)
  - `components/theme-toggle.tsx`: same four in the `themes` array and icon mapping
  - `styles/globals.css`: ensure full token sets exist for all remaining themes
  - `components/FloatingBackground.tsx`: keep only selected theme palettes and gradient cases
- Update this document’s Section 2 to only list the four remaining themes

---

## 13) Open Items to Confirm

- Confirm `/puzzles`, `/game`, `/play`, `/review`, `/report`, and `/learn` exact subroutes and their page component names
- Confirm component bindings for engine controls, move list, and evaluation (file names vary)
- Confirm which export/share flows are in scope (PDF/PNG/Link)
- Confirm default engine settings (depth, MultiPV, local/remote)
- Confirm whether sounds are enabled by default in puzzles

---

## 14) Appendices

- A. Theme Token Tables (to be appended once all per-theme CSS variables are finalized)
- B. Chessboard Overlay Color Reference (rgba values per state)
- C. Motion Spec Examples (keyframes if used)
- D. Icon Inventory (name → usage map)
