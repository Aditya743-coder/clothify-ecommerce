const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = 'c:\\Users\\mailm\\Desktop\\clothi\\backend\\clothify.db';
if (!fs.existsSync(dbPath)) {
    console.error('Database not found at:', dbPath);
    process.exit(1);
}

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
