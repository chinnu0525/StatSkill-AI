// ============================================================
// Minimal server showing how to "attach a database to your website"
// Stack: Node.js + Express + SQLite (better-sqlite3)
// ============================================================
const express = require('express');
const cors = require('cors');
const path = require('path');
const Database = require('better-sqlite3');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'igot_demo.db');
const SCHEMA_PATH = path.join(__dirname, 'db', 'schema.sql');
const SEED_PATH = path.join(__dirname, 'db', 'seed.sql');

// 1) CONNECT to the database file (creates it if it doesn't exist)
const db = new Database(DB_PATH);

// 2) BUILD the tables + load seed data — only runs once (checks if empty)
function initDbIfNeeded() {
  const row = db.prepare(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='ministries'"
  ).get();

  if (!row) {
    console.log('No tables found — running schema.sql + seed.sql ...');
    db.exec(fs.readFileSync(SCHEMA_PATH, 'utf8'));
    db.exec(fs.readFileSync(SEED_PATH, 'utf8'));
    console.log('Database initialized and seeded.');
  } else {
    console.log('Database already initialized — skipping seed.');
  }
}
initDbIfNeeded();

// 3) SET UP the web server
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // serves index.html

// --- API: list of all states/UTs (step 1 -> if user picks "State") ------
app.get('/api/states', (req, res) => {
  const rows = db.prepare(
    'SELECT DISTINCT state FROM state_departments ORDER BY state'
  ).all();
  res.json(rows.map(r => r.state));
});

// --- API: central ministries (top-level only, no sub-departments) -------
app.get('/api/ministries/central', (req, res) => {
  const rows = db.prepare(
    'SELECT id, name FROM ministries WHERE parent_ministry IS NULL ORDER BY name'
  ).all();
  res.json(rows);
});

// --- API: sub-departments of a chosen central ministry -------------------
app.get('/api/ministries/central/:id/departments', (req, res) => {
  const rows = db.prepare(
    'SELECT id, name FROM ministries WHERE parent_ministry = ? ORDER BY name'
  ).all(req.params.id);
  res.json(rows);
});

// --- API: departments for a chosen state ---------------------------------
app.get('/api/departments/state/:stateName', (req, res) => {
  const rows = db.prepare(
    'SELECT id, name FROM state_departments WHERE state = ? AND parent_ministry IS NULL ORDER BY name'
  ).all(req.params.stateName);
  res.json(rows);
});

// --- Example: registration endpoint (where you'd save the user) ---------
app.post('/api/register', (req, res) => {
  const { name, email, orgType, orgId, state } = req.body;
  // In a real app: insert into a `users` table referencing orgId/orgType/state.
  // Kept as a stub here so you can see what data your form should send.
  console.log('New registration received:', { name, email, orgType, orgId, state });
  res.json({ success: true, message: 'Registered (demo only, not persisted yet).' });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running: http://localhost:${PORT}`));
