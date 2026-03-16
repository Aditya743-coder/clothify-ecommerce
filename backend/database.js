const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = process.env.RENDER 
    ? (fs.existsSync('/data') ? '/data/clothify.db' : path.resolve(process.cwd(), 'clothify.db'))
    : (process.env.NODE_ENV === 'production' ? '/tmp/clothify.db' : path.resolve(__dirname, 'clothify.db'));

console.log('[DB] Resolved Database Path:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database:', dbPath);
        db.run("PRAGMA busy_timeout = 5000"); // Ensure timeouts
        db.run("PRAGMA journal_mode = WAL"); // Ensure WAL to fix locking
    }
});

createTables();

function createTables() {
    db.serialize(() => {
        // Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      is_admin INTEGER DEFAULT 0
    )`);

        // Products Table
        db.run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      category TEXT,
      sub_category TEXT,
      image_url TEXT,
      stock INTEGER DEFAULT 0
    )`);

        // Cart Table
        db.run(`CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      product_id INTEGER,
      quantity INTEGER DEFAULT 1,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(product_id) REFERENCES products(id)
    )`);

        // Orders Table
        db.run(`CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      items TEXT, -- JSON string of items
      total_price REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      transaction_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

        // Index for faster searching and unique constraint
        db.run(`CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_transaction_id ON orders(transaction_id)`, (err) => {
            if (err) {
                console.error('[DB] Warning: Could not create unique index on transaction_id (might have duplicates):', err.message);
            }
        });
    });
}

module.exports = db;
