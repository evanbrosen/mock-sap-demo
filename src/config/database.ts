import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../data/mock-sap.db');

// Ensure data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

export function initializeDatabase() {
  // Create Purchase Orders table
  db.exec(`
    CREATE TABLE IF NOT EXISTS purchase_orders (
      id TEXT PRIMARY KEY,
      vendor_id TEXT NOT NULL,
      amount REAL NOT NULL,
      currency TEXT DEFAULT 'USD',
      status TEXT DEFAULT 'DRAFT',
      description TEXT,
      created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      modified_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_by TEXT,
      modified_by TEXT
    )
  `);

  // Create Purchase Requests table
  db.exec(`
    CREATE TABLE IF NOT EXISTS purchase_requests (
      id TEXT PRIMARY KEY,
      requester_id TEXT NOT NULL,
      amount REAL NOT NULL,
      currency TEXT DEFAULT 'USD',
      status TEXT DEFAULT 'DRAFT',
      description TEXT,
      created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      modified_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_by TEXT,
      modified_by TEXT
    )
  `);

  // Create Work Orders table
  db.exec(`
    CREATE TABLE IF NOT EXISTS work_orders (
      id TEXT PRIMARY KEY,
      assigned_to TEXT NOT NULL,
      priority TEXT DEFAULT 'MEDIUM',
      status TEXT DEFAULT 'OPEN',
      description TEXT,
      created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      modified_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_by TEXT,
      modified_by TEXT
    )
  `);

  // Create audit log table
  db.exec(`
    CREATE TABLE IF NOT EXISTS audit_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      object_type TEXT NOT NULL,
      object_id TEXT NOT NULL,
      action TEXT NOT NULL,
      old_values TEXT,
      new_values TEXT,
      user_id TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('Database initialized successfully');
}

export default db;
