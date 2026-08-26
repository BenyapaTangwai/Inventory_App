require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const port = process.env.PORT || 3027;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

let pool;

(async function initDB() {
  const dbName = process.env.DB_NAME || 'ip_std6730202271';
  const configsToTry = [
    {
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'std6730202271',
      password: process.env.DB_PASSWORD || 'jV9!L3hN',
      database: dbName,
      port: parseInt(process.env.DB_PORT || '3306', 10),
      connectTimeout: 5000,
    },
    {
      host: '127.0.0.1',
      user: 'std6730202271',
      password: 'jV9!L3hN',
      database: dbName,
      port: 3306,
      connectTimeout: 5000,
    },
    {
      host: '127.0.0.1',
      user: 'root',
      password: '',
      database: dbName,
      port: 3306,
      connectTimeout: 5000,
    }
  ];

  for (const config of configsToTry) {
    try {
      console.log(`Connecting to MySQL host: ${config.host} with user: ${config.user}...`);
      const tempPool = mysql.createPool({
        ...config,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        timezone: "+07:00"
      });

      const conn = await tempPool.getConnection();
      await conn.query(`
        CREATE TABLE IF NOT EXISTS Inventory (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          category_name VARCHAR(255),
          type VARCHAR(255),
          vp INT DEFAULT 0,
          price DECIMAL(10,2) DEFAULT 0,
          stock INT DEFAULT 10,
          brand VARCHAR(255),
          badge_status VARCHAR(255),
          image_url TEXT,
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await conn.query(`
        CREATE TABLE IF NOT EXISTS users (
          user_id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(50) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          email VARCHAR(100),
          role VARCHAR(20) DEFAULT 'user',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      pool = tempPool;
      console.log(`✅ Successfully connected to MySQL database: ${config.database} on ${config.host} as ${config.user}`);
      conn.release();
      return;
    } catch (err) {
      console.warn(`MySQL connection attempt failed for ${config.host} (${config.user}):`, err.message);
    }
  }
  console.error('❌ Unable to connect to MySQL database on any host.');
})();

// Admin Middleware check
const requireAdmin = (req, res, next) => {
  const role = req.headers['x-user-role'] || (req.body && req.body._userRole);
  if (role && role !== 'admin') {
    return res.status(403).json({ error: '403 Forbidden: Requires admin role to perform this action.' });
  }
  next();
};

// Root API status
app.get('/api', (req, res) => {
  res.json('API is running');
});

// Login route
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    const user = rows[0];
    if (password && user.password !== password && !user.password.startsWith('$2b$')) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    res.json({
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      role: user.role || 'user',
      token: `token_${user.user_id}_${Date.now()}`
    });
  } catch (e) {
    console.error('Login Error:', e.message);
    res.status(500).json({ error: 'Failed to process login' });
  }
});

// Register route
app.post('/api/register', async (req, res) => {
  try {
    if (!pool) {
      return res.status(500).json({ error: 'Database connection is initializing. Please try again in a moment.' });
    }
    const { username, password, email, role } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const trimmedUsername = username.trim();
    const [existing] = await pool.query('SELECT * FROM users WHERE username = ?', [trimmedUsername]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Username is already taken' });
    }

    const userRole = (role === 'admin' || role === 'user') ? role : 'user';
    const userEmail = email ? email.trim() : `${trimmedUsername}@example.com`;

    const [result] = await pool.query(
      `INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)`,
      [trimmedUsername, password.trim(), userEmail, userRole]
    );

    console.log(`[REGISTER SUCCESS] Created user ${trimmedUsername} (id: ${result.insertId}, role: ${userRole})`);

    res.status(201).json({
      user_id: result.insertId,
      username: trimmedUsername,
      email: userEmail,
      role: userRole,
      token: `token_${result.insertId}_${Date.now()}`,
      message: 'Account registered successfully'
    });
  } catch (e) {
    console.error('Register Exception:', e);
    res.status(500).json({ error: e.message || 'Failed to register account' });
  }
});

// Get products (Public for both admin and user)
app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Inventory ORDER BY id DESC');
    const mapped = rows.map((r) => ({
      ...r,
      vp: Number(r.vp || 0),
      price: Number(r.price || 0),
      stock: Number(r.stock || 0),
      image_url: r.image_url || r.image || ''
    }));
    res.json(mapped);
  } catch (e) {
    console.error('Products Error:', e.message);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Add product (Admin only)
app.post('/api/products', requireAdmin, async (req, res) => {
  try {
    const { name, category_name, type, vp, price, stock, image_url } = req.body;
    const [result] = await pool.query(
      `INSERT INTO Inventory (name, type, vp, price, stock, image) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        name, 
        category_name || type || 'Skin', 
        vp || 0, 
        price || 0, 
        stock || 10,
        image_url || ''
      ]
    );
    res.status(201).json({ id: result.insertId, message: 'Product added successfully' });
  } catch (e) {
    console.error('Add Product Error:', e.message);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// Update product (Admin only)
app.put('/api/products/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category_name, type, vp, price, stock, image_url } = req.body;
    
    const [existing] = await pool.query('SELECT * FROM Inventory WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const [result] = await pool.query(
      `UPDATE Inventory SET name = ?, type = ?, vp = ?, price = ?, stock = ?, image = ? WHERE id = ?`,
      [
        name, 
        category_name || type || 'Skin', 
        vp || 0, 
        price || 0, 
        stock || 0,
        image_url || '',
        id
      ]
    );
    res.json({ message: 'Product updated successfully' });
  } catch (e) {
    console.error('Update Product Error:', e.message);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product (Admin only)
app.delete('/api/products/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [existing] = await pool.query('SELECT * FROM Inventory WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await pool.query('DELETE FROM Inventory WHERE id = ?', [id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (e) {
    console.error('Delete Product Error:', e.message);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

app.listen(port, () => {
  console.log(`🚀 API running on port ${port}`);
});