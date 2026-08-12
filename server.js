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
  try {
    const dbName = process.env.DB_NAME || 'owen_shop';
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306,
      timezone: "+07:00"
    });
    
    try {
      await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    } catch (e) {
      console.log('Skipping CREATE DATABASE (might not have permissions):', e.message);
    }
    await connection.end();

    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: dbName,
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      timezone: "+07:00"
    });

    const conn = await pool.getConnection();
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
    console.log('Connected to MySQL and ready:', dbName);
    conn.release();
  } catch (err) {
    console.error('MySQL Init Failed:', err);
    process.exit(1);
  }
})();

// Root API status
app.get('/api', (req, res) => {
  res.json('API is running');
});

// Get products
app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Inventory ORDER BY id DESC');
    res.json(rows);
  } catch (e) {
    console.error('Products Error:', e.message);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Add product
app.post('/api/products', async (req, res) => {
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

// Update product
app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category_name, type, vp, price, stock, image_url } = req.body;
    
    // Make sure id exists
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

app.listen(port, () => {
  console.log(`🚀 API running on port ${port}`);
});