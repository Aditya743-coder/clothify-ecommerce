const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'clothify.db');
const db = new sqlite3.Database(dbPath);

console.log('Checking cart contents...');
db.all("SELECT * FROM cart", (err, rows) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log('Cart Items:', JSON.stringify(rows, null, 2));
    db.close();
});
