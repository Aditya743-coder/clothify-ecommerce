const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.resolve(__dirname, 'backend', 'clothify.db'));

db.serialize(() => {
    console.log('--- DUPLICATE CHECK ---');
    db.all(`SELECT transaction_id, COUNT(*) as c FROM orders WHERE transaction_id IS NOT NULL GROUP BY transaction_id HAVING c > 1`, (err, rows) => {
        if (err) console.error('Error checking duplicates:', err.message);
        else console.log('Duplicates (non-null):', rows);
    });

    db.all(`SELECT COUNT(*) as empty_count FROM orders WHERE transaction_id = ''`, (err, rows) => {
        if (err) console.error('Error checking empty strings:', err.message);
        else console.log('Empty string transaction IDs:', rows);
    });

    db.all(`SELECT id, name FROM products LIMIT 5`, (err, rows) => {
        if (err) console.error('Error reading products:', err.message);
        else console.log('Sample Products:', rows);
    });
});
