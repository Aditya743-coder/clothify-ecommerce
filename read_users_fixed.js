const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'backend', 'clothify.db');
const db = new sqlite3.Database(dbPath);

console.log('--- LOCAL USER LIST ---');
db.all(`SELECT id, username, email, is_admin FROM users`, [], (err, rows) => {
    if (err) {
        console.error('Error:', err.message);
    } else {
        console.table(rows);
    }
    db.close();
});
