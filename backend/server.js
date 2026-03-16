const express = require('express');
const cors = require('cors');
const db = require('./database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const seedDatabase = require('./seed');
require('dotenv').config();

const app = express();
const logFile = path.resolve(__dirname, 'server_persistent.log');
if (!fs.existsSync(logFile)) fs.writeFileSync(logFile, '');

const debugLog = (msg) => {
    const timestamp = new Date().toISOString();
    try {
        fs.appendFileSync(logFile, `[${timestamp}] ${msg}\n`);
    } catch(e) {}
    console.log(msg);
};
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.JWT_SECRET || 'clothify_secret_key';

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Clothify Backend Live'));
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

debugLog(`[STARTUP] Environment: RENDER=${process.env.RENDER}, PORT=${process.env.PORT}, NODE_ENV=${process.env.NODE_ENV}`);

app.get('/api/debug/db', (req, res) => {
    const dbPath = process.env.RENDER ? '/data/clothify.db' : (process.env.NODE_ENV === 'production' ? '/tmp/clothify.db' : path.resolve(__dirname, 'clothify.db'));
    db.get(`SELECT COUNT(*) as count FROM products`, (err, row) => {
        res.json({
            dbPath,
            productCount: row ? row.count : 0,
            error: err ? err.message : null,
            env: {
                RENDER: process.env.RENDER,
                NODE_ENV: process.env.NODE_ENV
            }
        });
    });
});

app.use((req, res, next) => {
    debugLog(`[REQUEST] ${req.method} ${req.url}`);
    next();
});

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        debugLog('[AUTH] No token provided');
        return res.sendStatus(401);
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            debugLog(`[AUTH] Token verification failed: ${err.message}`);
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};

// --- AUTH ROUTES ---
app.post('/api/auth/register', (req, res) => {
    const { username, email, password } = req.body;
    const hash = bcrypt.hashSync(password, 10);

    const query = `INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)`;
    db.run(query, [username, email, hash], function (err) {
        if (err) return res.status(400).json({ error: 'Username or email already exists' });
        res.status(201).json({ id: this.lastID, username, email });
    });
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const query = `SELECT * FROM users WHERE email = ?`;

    db.get(query, [email], (err, user) => {
        if (err || !user) return res.status(401).json({ error: 'Invalid credentials' });

        if (bcrypt.compareSync(password, user.password_hash)) {
            const token = jwt.sign({ id: user.id, username: user.username, is_admin: user.is_admin }, SECRET_KEY);
            res.json({ token, user: { id: user.id, username: user.username, email: user.email, is_admin: user.is_admin } });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    });
});

// --- PRODUCT ROUTES ---
app.get('/api/products', (req, res) => {
    const { search, category } = req.query;
    let query = `SELECT * FROM products`;
    let params = [];
    let conditions = [];

    if (category) {
        conditions.push(`LOWER(category) = ?`);
        params.push(category.toLowerCase());
    }

    if (search) {
        conditions.push(`(name LIKE ? OR category LIKE ? OR sub_category LIKE ?)`);
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (conditions.length > 0) {
        query += ` WHERE ` + conditions.join(' AND ');
    }

    console.log('Executing Query:', query, 'with params:', params);

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Database Error:', err.message);
            return res.status(500).json({ error: err.message });
        }
        console.log('Found', rows.length, 'products');
        res.json(rows);
    });
});

app.get('/api/products/:id', (req, res) => {
    db.get(`SELECT * FROM products WHERE id = ?`, [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Product not found' });
        res.json(row);
    });
});

// Admin Route to add product
app.post('/api/products', authenticateToken, (req, res) => {
    if (!req.user.is_admin) return res.status(403).json({ error: 'Admin access required' });

    const { name, description, price, category, sub_category, image_url, stock } = req.body;
    const query = `INSERT INTO products (name, description, price, category, sub_category, image_url, stock) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.run(query, [name, description, price, category, sub_category, image_url, stock], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, name, description, price, category, sub_category, image_url, stock });
    });
});

// --- CART ROUTES ---
app.get('/api/cart', authenticateToken, (req, res) => {
    const query = `
    SELECT cart.*, products.name, products.price, products.image_url 
    FROM cart 
    JOIN products ON cart.product_id = products.id 
    WHERE cart.user_id = ?
  `;
    db.all(query, [req.user.id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/cart', authenticateToken, (req, res) => {
    const { product_id, quantity } = req.body;
    debugLog(`[CART POST] Attempting to add item: product_id=${product_id}, user_id=${req.user.id}`);

    // Check if item exists in cart
    db.get(`SELECT * FROM cart WHERE user_id = ? AND product_id = ?`, [req.user.id, product_id], (err, row) => {
        if (err) {
            debugLog(`[CART POST] DB Get Error: ${err.message}`);
            return res.status(500).json({ error: err.message });
        }
        if (row) {
            debugLog(`[CART POST] Item exists, updating quantity for row ID: ${row.id}`);
            db.run(`UPDATE cart SET quantity = quantity + ? WHERE id = ?`, [quantity, row.id], (err) => {
                if (err) {
                    debugLog(`[CART POST] DB Update Error: ${err.message}`);
                    return res.status(500).json({ error: err.message });
                }
                debugLog('[CART POST] Quantity updated successfully');
                res.json({ message: 'Cart updated' });
            });
        } else {
            debugLog(`[CART POST] Item doesn't exist, inserting new row`);
            db.run(`INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)`, [req.user.id, product_id, quantity], function (err) {
                if (err) {
                    debugLog(`[CART POST] DB Insert Error: ${err.message}`);
                    return res.status(500).json({ error: err.message });
                }
                debugLog(`[CART POST] Item inserted successfully, new row ID: ${this.lastID}`);
                res.status(201).json({ id: this.lastID });
            });
        }
    });
});

app.patch('/api/cart/:id', authenticateToken, (req, res) => {
    const { quantity } = req.body;
    db.run(`UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?`, [quantity, req.params.id, req.user.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Quantity updated' });
    });
});

app.delete('/api/cart/:id', authenticateToken, (req, res) => {
    db.run(`DELETE FROM cart WHERE id = ? AND user_id = ?`, [req.params.id, req.user.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Item removed' });
    });
});

// --- ORDER ROUTES ---
app.post('/api/orders', authenticateToken, (req, res) => {
    const { total_price, items, transaction_id } = req.body;
    const itemsStr = JSON.stringify(items || []);

    // Basic validation
    if (!transaction_id || transaction_id.trim().length < 10) {
        debugLog(`[ORDER POST] Validation failed: ID too short or missing`);
        return res.status(400).json({ error: 'Please enter a valid Transaction ID (min 10 characters).' });
    }

    debugLog('\n--- NEW ORDER PLACED (Manual Payment) ---');
    debugLog(`User ID: ${req.user.id} (${req.user.username})`);
    debugLog(`Total Price: ₹${total_price}`);
    debugLog(`Transaction ID: ${transaction_id || 'N/A'}`);
    debugLog('Items:');
    (items || []).forEach(item => {
        debugLog(`- ${item.name} (x${item.quantity}) at ₹${item.price}`);
    });
    debugLog('------------------------\n');

    const query = `INSERT INTO orders (user_id, total_price, items, transaction_id, status) VALUES (?, ?, ?, ?, ?)`;
    
    db.run(query, [req.user.id, total_price || 0, itemsStr, transaction_id, 'waiting_for_admin_verification'], function (err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                debugLog(`[ORDER POST] Duplicate Transaction ID detected: ${transaction_id}`);
                return res.status(400).json({ error: 'This Transaction ID has already been used. Please enter a valid unique ID.' });
            }
            debugLog(`[ORDER POST] DB Insert Error: ${err.message}`);
            return res.status(500).json({ error: err.message });
        }
        debugLog(`[ORDER POST] Order saved successfully, ID: ${this.lastID}`);

        // Clear cart after order
        const orderId = this.lastID; // Capture lastID before the next db.run
        db.run(`DELETE FROM cart WHERE user_id = ?`, [req.user.id], (err) => {
            if (err) {
                debugLog(`[ORDER POST] Error clearing cart: ${err.message}`);
                // Even if cart clearing fails, the order was placed.
                return res.status(201).json({ id: orderId, message: 'Order placed, but failed to clear cart.' });
            }
            debugLog(`[ORDER POST] Cart cleared for user ${req.user.id}`);
            res.status(201).json({ id: orderId, message: 'Order placed' });
        });
    });
});

app.get('/api/orders/my', authenticateToken, (req, res) => {
    const query = `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`;
    db.all(query, [req.user.id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        
        // Parse items JSON for each order
        const orders = rows.map(order => ({
            ...order,
            items: JSON.parse(order.items || '[]')
        }));
        
        res.json(orders);
    });
});

app.listen(PORT, () => {
    debugLog(`--- SERVER STARTED ---`);
    debugLog(`Listening on port ${PORT}`);
    
    // Background seeding
    debugLog(`[STARTUP] Triggering background seeding...`);
    seedDatabase()
        .then(() => debugLog('[STARTUP] Seeding check complete.'))
        .catch(err => debugLog(`[STARTUP] Seeding error: ${err.message}`));
});

module.exports = app;
