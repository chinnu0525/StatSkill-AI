# iGOT-style Ministry/Department Dropdown — Working Demo

This is a **runnable** mini-project showing exactly how a database attaches
to a website, using your two-step "Central or State?" → "Which
Ministry/Department?" flow.

## What's inside
```
igot-demo/
├── db/
│   ├── schema.sql        -> defines `ministries` and `state_departments` tables
│   ├── generate_seed.js  -> script that generated seed.sql (edit + rerun to update data)
│   └── seed.sql          -> INSERT statements: 55 central ministries, 36 states/UTs × 20 depts
├── server.js             -> Node/Express backend: connects to DB, serves API
├── public/index.html     -> demo registration page (the two-step dropdown)
└── package.json
```

## How to run it
```bash
npm install
node server.js
```
Then open **http://localhost:3000** in your browser. Pick "Central" or
"State", watch the second dropdown populate from the database live.

## How the database actually "attaches" to the website (the concept)

This is the part you were stuck on — here's the pattern, which is the same
regardless of which language/framework you eventually pick:

1. **A database file or server exists** — here it's `igot_demo.db`, a plain
   SQLite file created automatically the first time you run `server.js`.
   In production you'd instead point at a Postgres/MySQL server (a
   connection string like `postgres://user:pass@host:5432/dbname`).
2. **Your backend code opens a connection** — see the top of `server.js`:
   `const db = new Database(DB_PATH)`. Every backend framework has an
   equivalent (Django's `settings.py DATABASES`, Node's `pg` or
   `mysql2` packages, etc.) — you configure it once, then it's used
   everywhere in your code.
3. **Your backend exposes API endpoints** that query the database and
   return JSON — see `/api/ministries/central`, `/api/states`, etc.
4. **Your frontend (the HTML/JS in `public/index.html`) calls those APIs**
   with `fetch()` and fills in the dropdowns with what comes back.

So "attaching a database" really just means: backend connects to DB →
backend exposes endpoints → frontend calls those endpoints. Nothing on
the frontend ever touches the database directly.

## Moving to production

- **Swap SQLite for Postgres**: replace `better-sqlite3` with the `pg`
  package, and change the schema syntax slightly (`SERIAL PRIMARY KEY`
  instead of `INTEGER PRIMARY KEY AUTOINCREMENT`). Free hosted Postgres:
  Supabase, Neon, Railway.
- **Add a real `users` table** referencing `ministries.id` /
  `state_departments.id` + `orgType`, so registrations actually persist
  (the `/api/register` endpoint here is a stub — it just logs, doesn't save).
- **Refine the state department lists**: the 20 departments per state here
  are a generic starter set so you're unblocked today. Real department
  names/counts differ by state — update `db/generate_seed.js` state by
  state as you pull each state's official department list, then rerun it
  to regenerate `seed.sql`.
- **Add your skill-gap / quiz / course-recommendation tables next**: e.g.
  `skills`, `courses (skill_id FK)`, `quiz_questions (skill_id FK)`,
  `user_quiz_scores`, `user_recommendations` — all following the exact
  same attach-a-database pattern shown here.
