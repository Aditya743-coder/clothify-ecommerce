const express = require('express');
const cors = require('cors');
const db = require('./database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.JWT_SECRET || 'clothify_secret_key';

app.use(cors());
app.use(express.json());

// Auth Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
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

    // Check if item exists in cart
    db.get(`SELECT * FROM cart WHERE user_id = ? AND product_id = ?`, [req.user.id, product_id], (err, row) => {
        if (row) {
            db.run(`UPDATE cart SET quantity = quantity + ? WHERE id = ?`, [quantity, row.id], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: 'Cart updated' });
            });
        } else {
            db.run(`INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)`, [req.user.id, product_id, quantity], function (err) {
                if (err) return res.status(500).json({ error: err.message });
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
    const { total_price, items } = req.body;
    const itemsStr = JSON.stringify(items || []);

    console.log('\n--- NEW ORDER PLACED ---');
    console.log(`User ID: ${req.user.id} (${req.user.username})`);
    console.log(`Total Price: ₹${total_price}`);
    console.log('Items:');
    (items || []).forEach(item => {
        console.log(`- ${item.name} (x${item.quantity}) at ₹${item.price}`);
    });
    console.log('------------------------\n');

    const query = `INSERT INTO orders (user_id, items, total_price) VALUES (?, ?, ?)`;
    db.run(query, [req.user.id, itemsStr, total_price || 0], function (err) {
        if (err) return res.status(500).json({ error: err.message });

        // Clear cart after order
        db.run(`DELETE FROM cart WHERE user_id = ?`, [req.user.id], (err) => {
            res.status(201).json({ id: this.lastID, message: 'Order placed successfully' });
        });
    });
});

if (process.env.NODE_ENV !== 'production' || process.env.RENDER) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
