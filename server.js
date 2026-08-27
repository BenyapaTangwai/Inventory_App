require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3027;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

let pool = null;

// Local persistent fallback store
const fallbackFile = path.join(__dirname, 'local_store.json');
let fallbackData = {
  users: [
    { user_id: 1, username: 'Nyxpaszin', password: '@Bento2549', email: 'mikukung19@gmail.com', role: 'admin' },
    { user_id: 2, username: 'Bento', password: '@Bento2549', email: 'mikukung19@gmail.com', role: 'user' },
    { user_id: 3, username: 'admin', password: 'admin123', email: 'admin@valmodel.com', role: 'admin' },
    { user_id: 5, username: 'Nyx', password: 'B123', email: 'bentokung.mada@gmail.com', role: 'user' }
  ],
  products: [
    { id: 1, name: 'Phaseguard Vandal', type: 'Vandal', vp: 2475, price: 625, stock: 9, image_url: 'https://github.com/BenyapaTangwai/Inventory_App/raw/main/image_Product/Phaseguard_Vandal.webp' },
    { id: 2, name: 'Reaver Vandal', type: 'Vandal', vp: 1175, price: 500, stock: 3, image_url: 'https://github.com/BenyapaTangwai/Inventory_App/raw/main/image_Product/Reaver_Vandal.webp' },
    { id: 3, name: 'CYRAX Vandal', type: 'Vandal', vp: 2175, price: 625, stock: 8, image_url: 'https://github.com/BenyapaTangwai/Inventory_App/raw/main/image_Product/CYRAX_Vandal.webp' },
    { id: 4, name: 'Kuronami Vandal', type: 'Vandal', vp: 2375, price: 625, stock: 8, image_url: 'https://static.wikia.nocookie.net/valorant/images/2/2e/Kuronami_Vandal.png/revision/latest?cb=20240109154323' },
    { id: 5, name: 'Neo Frontier  Phantom', type: 'Phantom', vp: 2175, price: 625, stock: 1, image_url: 'https://media.valorant-api.com/weaponskinlevels/814fb822-4585-c9fe-85b4-bf8157646ae7/displayicon.png' }
  ],
  orders: [
    {
      order_id: 101,
      order_number: 'VAL-89421',
      customer_name: 'Nyxpaszin',
      customer_email: 'mikukung19@gmail.com',
      shipping_address: 'Asia Pacific (AP) - Nyx#BENTO',
      payment_method: 'PromptPay QR',
      total_amount: 625,
      total_vp: 2375,
      status: 'Preparing Model',
      items: [
        { id: 4, name: 'Kuronami Vandal', type: 'Vandal', vp: 2375, price: 625, quantity: 1, image_url: 'https://static.wikia.nocookie.net/valorant/images/2/2e/Kuronami_Vandal.png/revision/latest?cb=20240109154323' }
      ],
      created_at: '2026-08-26 21:35:00'
    },
    {
      order_id: 102,
      order_number: 'VAL-74190',
      customer_name: 'Bento',
      customer_email: 'bento.val@gmail.com',
      shipping_address: 'Thailand - Bento#2549',
      payment_method: 'Credit Card',
      total_amount: 1125,
      total_vp: 3650,
      status: 'Shipping',
      items: [
        { id: 2, name: 'Reaver Vandal', type: 'Vandal', vp: 1175, price: 500, quantity: 1, image_url: 'https://github.com/BenyapaTangwai/Inventory_App/raw/main/image_Product/Reaver_Vandal.webp' },
        { id: 5, name: 'Neo Frontier Phantom', type: 'Phantom', vp: 2175, price: 625, quantity: 1, image_url: 'https://media.valorant-api.com/weaponskinlevels/814fb822-4585-c9fe-85b4-bf8157646ae7/displayicon.png' }
      ],
      created_at: '2026-08-26 22:10:00'
    }
  ]
};

function loadFallbackData() {
  try {
    if (fs.existsSync(fallbackFile)) {
      const data = JSON.parse(fs.readFileSync(fallbackFile, 'utf8'));
      if (data.users) fallbackData.users = data.users;
      if (data.products) fallbackData.products = data.products;
      if (data.orders) fallbackData.orders = data.orders;
    }
  } catch (e) {
    console.warn('Fallback file load warning:', e.message);
  }
}
loadFallbackData();

function saveFallbackData() {
  try {
    fs.writeFileSync(fallbackFile, JSON.stringify(fallbackData, null, 2), 'utf8');
  } catch (e) {
    console.warn('Fallback save warning:', e.message);
  }
}

(async function initDB() {
  const dbName = process.env.DB_NAME || 'ip_std6730202271';
  const configsToTry = [
    {
      host: '127.0.0.1',
      user: 'root',
      password: '',
      database: dbName,
      port: 3306,
      connectTimeout: 3000,
    },
    {
      host: '127.0.0.1',
      user: 'std6730202271',
      password: 'jV9!L3hN',
      database: dbName,
      port: 3306,
      connectTimeout: 3000,
    },
    {
      host: process.env.DB_HOST || '119.59.102.161',
      user: process.env.DB_USER || 'std6730202271',
      password: process.env.DB_PASSWORD || 'jV9!L3hN',
      database: dbName,
      port: parseInt(process.env.DB_PORT || '3306', 10),
      connectTimeout: 3000,
    }
  ];

  for (const config of configsToTry) {
    try {
      console.log(`Connecting to MySQL host: ${config.host} with user: ${config.user}...`);
      
      // Auto-create database if possible
      try {
        const rootConn = await mysql.createConnection({
          host: config.host,
          user: config.user,
          password: config.password,
          port: config.port,
          connectTimeout: 2000
        });
        await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
        await rootConn.end();
      } catch (dbCreateErr) {
        // Ignore if no permission to CREATE DATABASE
      }

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
          image TEXT,
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

      await conn.query(`
        CREATE TABLE IF NOT EXISTS orders (
          order_id INT AUTO_INCREMENT PRIMARY KEY,
          order_number VARCHAR(50) NOT NULL,
          customer_name VARCHAR(100) NOT NULL,
          customer_email VARCHAR(100),
          customer_phone VARCHAR(50),
          shipping_address TEXT,
          payment_method VARCHAR(50) DEFAULT 'PromptPay',
          total_amount DECIMAL(10,2) NOT NULL,
          total_vp INT DEFAULT 0,
          status VARCHAR(50) DEFAULT 'Preparing Model',
          items_json TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Seed initial users if empty
      const [existingUsers] = await conn.query('SELECT * FROM users');
      if (existingUsers.length === 0) {
        await conn.query(`
          INSERT INTO users (username, password, email, role) VALUES
          ('Nyxpaszin', '@Bento2549', 'mikukung19@gmail.com', 'admin'),
          ('Bento', '@Bento2549', 'mikukung19@gmail.com', 'user'),
          ('admin', 'admin123', 'admin@valmodel.com', 'admin')
        `);
        console.log('✅ Seeded default users into MySQL');
      }

      // Seed initial products if empty
      const [existingProducts] = await conn.query('SELECT * FROM Inventory');
      if (existingProducts.length === 0) {
        await conn.query(`
          INSERT INTO Inventory (name, type, vp, price, stock, image_url) VALUES 
          ('Phaseguard Vandal', 'Vandal', 2475, 625, 9, 'https://github.com/BenyapaTangwai/Inventory_App/raw/main/image_Product/Phaseguard_Vandal.webp'),
          ('Reaver Vandal', 'Vandal', 1175, 500, 3, 'https://github.com/BenyapaTangwai/Inventory_App/raw/main/image_Product/Reaver_Vandal.webp'),
          ('CYRAX Vandal', 'Vandal', 2175, 625, 8, 'https://github.com/BenyapaTangwai/Inventory_App/raw/main/image_Product/CYRAX_Vandal.webp'),
          ('Kuronami Vandal', 'Vandal', 2375, 625, 8, 'https://static.wikia.nocookie.net/valorant/images/2/2e/Kuronami_Vandal.png/revision/latest?cb=20240109154323'),
          ('Neo Frontier  Phantom', 'Phantom', 2175, 625, 1, 'https://media.valorant-api.com/weaponskinlevels/814fb822-4585-c9fe-85b4-bf8157646ae7/displayicon.png')
        `);
        console.log('✅ Seeded default inventory products into MySQL');
      }

      pool = tempPool;
      console.log(`✅ Successfully connected to MySQL database: ${config.database} on ${config.host} as ${config.user}`);
      conn.release();
      return;
    } catch (err) {
      console.warn(`MySQL connection attempt failed for ${config.host} (${config.user}):`, err.message);
    }
  }
  console.warn('⚠️ MySQL not reachable — running with local persistent data store.');
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
  res.json({ status: 'API is running', mysql: !!pool });
});

// Login route
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const trimmedUser = username.trim();
    let user = null;

    if (pool) {
      try {
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [trimmedUser]);
        if (rows.length > 0) {
          user = rows[0];
        }
      } catch (dbErr) {
        console.warn('MySQL login query failed, using fallback:', dbErr.message);
      }
    }

    if (!user) {
      user = fallbackData.users.find(u => u.username.toLowerCase() === trimmedUser.toLowerCase());
    }

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (password && user.password !== password.trim() && !user.password.startsWith('$2b$')) {
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
    const { username, password, email, role } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const trimmedUsername = username.trim();
    const userRole = (role === 'admin' || role === 'user') ? role : 'user';
    const userEmail = email ? email.trim() : `${trimmedUsername}@example.com`;

    if (pool) {
      try {
        const [existing] = await pool.query('SELECT * FROM users WHERE username = ?', [trimmedUsername]);
        if (existing.length > 0) {
          return res.status(400).json({ error: 'Username is already taken' });
        }

        const [result] = await pool.query(
          `INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)`,
          [trimmedUsername, password.trim(), userEmail, userRole]
        );

        return res.status(201).json({
          user_id: result.insertId,
          username: trimmedUsername,
          email: userEmail,
          role: userRole,
          token: `token_${result.insertId}_${Date.now()}`,
          message: 'Account registered successfully'
        });
      } catch (dbErr) {
        console.warn('MySQL register failed, saving to fallback:', dbErr.message);
      }
    }

    // Fallback store
    if (fallbackData.users.some(u => u.username.toLowerCase() === trimmedUsername.toLowerCase())) {
      return res.status(400).json({ error: 'Username is already taken' });
    }

    const newId = fallbackData.users.length + 1;
    const newUser = {
      user_id: newId,
      username: trimmedUsername,
      password: password.trim(),
      email: userEmail,
      role: userRole
    };
    fallbackData.users.push(newUser);
    saveFallbackData();

    res.status(201).json({
      user_id: newId,
      username: trimmedUsername,
      email: userEmail,
      role: userRole,
      token: `token_${newId}_${Date.now()}`,
      message: 'Account registered successfully'
    });
  } catch (e) {
    console.error('Register Exception:', e);
    res.status(500).json({ error: e.message || 'Failed to register account' });
  }
});

// Get products
app.get('/api/products', async (req, res) => {
  try {
    if (pool) {
      try {
        const [rows] = await pool.query('SELECT * FROM Inventory ORDER BY id DESC');
        const mapped = rows.map((r) => ({
          ...r,
          vp: Number(r.vp || 0),
          price: Number(r.price || 0),
          stock: Number(r.stock || 0),
          image_url: r.image_url || r.image || ''
        }));
        return res.json(mapped);
      } catch (dbErr) {
        console.warn('MySQL products query failed, using fallback:', dbErr.message);
      }
    }
    res.json(fallbackData.products);
  } catch (e) {
    console.error('Products Error:', e.message);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Add product (Admin only)
app.post('/api/products', requireAdmin, async (req, res) => {
  try {
    const { name, category_name, type, vp, price, stock, image_url } = req.body;
    
    if (pool) {
      try {
        const [result] = await pool.query(
          `INSERT INTO Inventory (name, type, vp, price, stock, image) VALUES (?, ?, ?, ?, ?, ?)`,
          [name, category_name || type || 'Skin', vp || 0, price || 0, stock || 10, image_url || '']
        );
        return res.status(201).json({ id: result.insertId, message: 'Product added successfully' });
      } catch (dbErr) {
        console.warn('MySQL add product failed, using fallback:', dbErr.message);
      }
    }

    const newProd = {
      id: Date.now(),
      name,
      type: category_name || type || 'Skin',
      vp: Number(vp || 0),
      price: Number(price || 0),
      stock: Number(stock || 10),
      image_url: image_url || ''
    };
    fallbackData.products.unshift(newProd);
    saveFallbackData();

    res.status(201).json({ id: newProd.id, message: 'Product added successfully' });
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
    
    if (pool) {
      try {
        await pool.query(
          `UPDATE Inventory SET name = ?, type = ?, vp = ?, price = ?, stock = ?, image = ? WHERE id = ?`,
          [name, category_name || type || 'Skin', vp || 0, price || 0, stock || 0, image_url || '', id]
        );
        return res.json({ message: 'Product updated successfully' });
      } catch (dbErr) {
        console.warn('MySQL update product failed, using fallback:', dbErr.message);
      }
    }

    const idx = fallbackData.products.findIndex(p => String(p.id) === String(id));
    if (idx !== -1) {
      fallbackData.products[idx] = {
        ...fallbackData.products[idx],
        name,
        type: category_name || type || 'Skin',
        vp: Number(vp || 0),
        price: Number(price || 0),
        stock: Number(stock || 0),
        image_url: image_url || ''
      };
      saveFallbackData();
    }
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
    if (pool) {
      try {
        await pool.query('DELETE FROM Inventory WHERE id = ?', [id]);
        return res.json({ message: 'Product deleted successfully' });
      } catch (dbErr) {
        console.warn('MySQL delete product failed, using fallback:', dbErr.message);
      }
    }
    fallbackData.products = fallbackData.products.filter(p => String(p.id) !== String(id));
    saveFallbackData();
    res.json({ message: 'Product deleted successfully' });
  } catch (e) {
    console.error('Delete Product Error:', e.message);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Get all orders
app.get('/api/orders', async (req, res) => {
  try {
    if (pool) {
      try {
        const [rows] = await pool.query('SELECT * FROM orders ORDER BY order_id DESC');
        const mapped = rows.map((r) => {
          let items = [];
          try {
            items = typeof r.items_json === 'string' ? JSON.parse(r.items_json) : (r.items_json || []);
          } catch {
            items = [];
          }
          return {
            ...r,
            total_amount: Number(r.total_amount || 0),
            total_vp: Number(r.total_vp || 0),
            items
          };
        });
        return res.json(mapped);
      } catch (dbErr) {
        console.warn('MySQL orders get failed, using fallback:', dbErr.message);
      }
    }
    res.json(fallbackData.orders);
  } catch (e) {
    console.error('Orders GET Error:', e.message);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Create new order
app.post('/api/orders', async (req, res) => {
  try {
    const {
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      payment_method,
      items,
      total_amount,
      total_vp,
      status
    } = req.body;

    if (!customer_name || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Customer name and order items are required' });
    }

    const orderNumber = `VAL-${Date.now().toString().slice(-5)}${Math.floor(Math.random() * 90 + 10)}`;
    const orderStatus = status || 'Preparing Model';
    const itemsJson = JSON.stringify(items);

    if (pool) {
      try {
        const [result] = await pool.query(
          `INSERT INTO orders (order_number, customer_name, customer_email, customer_phone, shipping_address, payment_method, total_amount, total_vp, status, items_json)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            orderNumber,
            customer_name.trim(),
            customer_email ? customer_email.trim() : null,
            customer_phone ? customer_phone.trim() : null,
            shipping_address ? shipping_address.trim() : null,
            payment_method || 'PromptPay',
            total_amount || 0,
            total_vp || 0,
            orderStatus,
            itemsJson
          ]
        );

        // Deduct stock in Inventory
        for (const item of items) {
          if (item.id && item.quantity) {
            await pool.query(
              `UPDATE Inventory SET stock = GREATEST(0, stock - ?) WHERE id = ?`,
              [item.quantity, item.id]
            ).catch(() => {});
          }
        }

        return res.status(201).json({
          order_id: result.insertId,
          order_number: orderNumber,
          customer_name,
          total_amount,
          total_vp,
          status: orderStatus,
          items,
          created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
          message: 'Order created successfully'
        });
      } catch (dbErr) {
        console.warn('MySQL create order failed, using fallback:', dbErr.message);
      }
    }

    // Fallback store
    const newOrder = {
      order_id: Date.now(),
      order_number: orderNumber,
      customer_name: customer_name.trim(),
      customer_email: customer_email ? customer_email.trim() : null,
      shipping_address: shipping_address ? shipping_address.trim() : null,
      payment_method: payment_method || 'PromptPay',
      total_amount: Number(total_amount || 0),
      total_vp: Number(total_vp || 0),
      status: orderStatus,
      items,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    // Deduct stock in fallback
    for (const item of items) {
      const p = fallbackData.products.find(prod => prod.id === item.id);
      if (p && p.stock != null) {
        p.stock = Math.max(0, p.stock - (item.quantity || 1));
      }
    }

    fallbackData.orders.unshift(newOrder);
    saveFallbackData();

    res.status(201).json({
      ...newOrder,
      message: 'Order created successfully'
    });
  } catch (e) {
    console.error('Create Order Error:', e.message);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Update order status (Admin)
app.patch('/api/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    if (pool) {
      try {
        await pool.query('UPDATE orders SET status = ? WHERE order_id = ? OR order_number = ?', [status, id, id]);
        return res.json({ message: 'Order status updated successfully' });
      } catch (dbErr) {
        console.warn('MySQL update status failed, using fallback:', dbErr.message);
      }
    }

    const order = fallbackData.orders.find(o => String(o.order_id) === String(id) || o.order_number === id);
    if (order) {
      order.status = status;
      saveFallbackData();
    }

    res.json({ message: 'Order status updated successfully' });
  } catch (e) {
    console.error('Update Order Status Error:', e.message);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

app.listen(port, () => {
  console.log(`🚀 API running on port ${port}`);
});