Blast Design & Fragmentation Prototype
=======================================

Educational prototype for underground drill-and-blast round design
(tunnels, stopes, shafts). Given rock properties, opening geometry and
site conditions, it recommends an explosive type, a total charge
quantity, a drilling pattern (cut / reliever / lifter / perimeter
holes) and an estimated blast radius per hole.

This is a learning / demo tool. It is NOT a certified blast design
tool and must never be used to plan a live blast.

What this scaffold builds
--------------------------
- server/  Express + TypeScript API, with a framework-free calculation
  engine under server/src/engine (Phase 1), wired to Postgres via
  node-pg (Phase 2).
- client/  React + Vite + TypeScript + Tailwind UI: a round design
  input form and a results dashboard with an explosive recommendation
  card, a charge summary, and a 2D canvas drilling-pattern view
  color-coded by hole role (Phase 3 + the 2D pattern differentiator).
- docker-compose.yml runs Postgres locally.

What is intentionally left as a stub / next step
--------------------------------------------------
The reference doc's Phase 4/5 "differentiator" and "bonus polish"
items are structured for but not fully built in this first pass, so
the core engine and UI stay easy to review:
  - Round history / persistence: server/src/db/queries/rounds.sql.ts
    already has insertRound / insertRoundHoles / listRounds -- the
    round controller does not call them yet. Wiring "save this round"
    is a small addition once you're happy with the design.
  - Cost estimator, sensitivity sliders, side-by-side comparison mode.
  - Optional open-bench mode (Kuz-Ram + flyrock/PPV) -- the mean
    fragment size estimate in engine/fragmentation.ts is reused for
    this, but flyrock/PPV formulas are not implemented.
  - PDF report export, quiz/scenario training mode, admin panel for
    editing rock/explosive reference tables (currently edited via SQL
    seed files only).
  - Auth is implemented (register/login/logout via bcrypt + sessions)
    but the client does not yet have login UI wired in -- the round
    designer works without being logged in.

Setup
-----
1. Start Postgres:
     docker compose up -d

2. Backend:
     cd server
     npm install
     cp .env.example .env
     npm run migrate:up
     npm run db:seed
     npm run dev
   API runs on http://localhost:4000

3. Frontend (new terminal):
     cd client
     npm install
     cp .env.example .env
     npm run dev
   UI runs on http://localhost:5173

4. Run engine unit tests:
     cd server
     npm test

Architecture notes
-------------------
- server/src/engine is pure TypeScript with no Express or pg imports,
  so the blast math can be unit tested in isolation, reused in a CLI,
  or ported elsewhere later. Routes/controllers pull rock and
  explosive rows from Postgres and pass them into engine.designRound
  as plain data -- the engine never hardcodes reference values.
- rock_types and explosive_types are reference data (source +
  is_generic columns track provenance) seeded from
  server/src/db/seeds/*.sql, separate from the transactional rounds /
  round_holes / users tables created by the migration.

Notes on the domain math (simplified for an educational tool)
----------------------------------------------------------------
- hole_depth = advance_required / cut_efficiency, cut_efficiency
  defaults to 0.92 (typical 0.90-0.95 for a good burn/wedge cut).
- Explosive selection: wet holes exclude non-water-resistant products
  (e.g. ANFO); among the remaining candidates, harder rock (UCS >=
  100 MPa) prefers the highest relative weight strength (RWS)
  product, softer rock prefers the lowest-cost option. Every
  recommendation carries an "explain why" reason list and an excluded
  list with reasons, shown in the UI.
- Powder factor (kg explosive / m3 rock) is a simplified linear model
  driven by rock UCS and the target fragmentation size in millimetres, then multiplied by
  rock volume (face area x advance) for total charge.
- Drilling pattern: burden and spacing are derived from hole diameter
  (a rule-of-thumb multiplier), cut holes use a wedge (V) layout for
  small headings and a burn cut with an uncharged large-diameter
  relief hole for larger ones, lifters run along the floor, and
  perimeter/contour holes use tighter spacing for wall control. Total
  charge is then distributed across holes weighted by role.
- Blast radius per hole scales with hole diameter and explosive
  energy (density x RWS), and inversely with rock UCS.
- These are representative, textbook-style approximations for
  teaching the relationships involved -- not a substitute for a real
  blast design engineer.
