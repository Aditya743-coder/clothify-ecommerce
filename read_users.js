const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.resolve(__dirname, 'backend', 'clothify.db'));

db.all(`SELECT id, username, email, is_admin FROM users`, [], (err, rows) => {
    if (err) {
        console.error(err.message);
        return;
    }
    console.log(JSON.stringify(rows, null, 2));
    db.close();
});
