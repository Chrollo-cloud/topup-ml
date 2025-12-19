const express = require('express');
const cors = require('cors');
const db = require('./db');
const Queue = require('./queue');
const Stack = require('./stack');
const { bubbleSortByPrice } = require('./sorting');
const { linearSearchByOrderId } = require('./searching');
const { login } = require('./auth');



const orderQueue = new Queue();
const orderHistory = new Stack();


const app = express();
const PORT = 3000;

// middleware
app.use(cors());
app.use(express.json());

// test route
app.get('/', (req, res) => {
  res.send('Backend Top Up ML is running');
});

// create order
app.post('/api/orders', (req, res) => {
  const { user_id, ml_id, server, diamond, price } = req.body;

    // validasi sederhana
    if (!ml_id || !server || !diamond || !price) {
    return res.status(400).json({ message: 'Data tidak lengkap' });
    }

    const status = 'pending';
    const created_at = new Date();

    const sql = `INSERT INTO orders (user_id, ml_id, server, diamond, price, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.query(
    sql,
    [user_id || null, ml_id, server, diamond, price, status, created_at],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Gagal menyimpan order' });
      }

      orderQueue.enqueue({
      order_id: result.insertId,
      ml_id,
      server,
      diamond,
      price,
      status
    });

    res.json({
    message: 'Order berhasil dibuat',
    order_id: result.insertId
    });
    }
  );
});

// start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// lihat semua order di queue (DSA)
app.get('/api/queue', (req, res) => {
  res.json(orderQueue.getAll());
});

// admin memproses order (DEQUEUE)
app.post('/api/admin/process', (req, res) => {
  const order = orderQueue.dequeue();

  if (!order) {
    return res.json({ message: 'Tidak ada order di antrian' });
  }

  // update status di database
  const sql = `
    UPDATE orders
    SET status = 'success'
    WHERE order_id = ?
  `;

  db.query(sql, [order.order_id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Gagal update order' });
    }

    orderHistory.push({
    order_id: order.order_id,
    ml_id: order.ml_id,
    server: order.server,
    diamond: order.diamond,
    price: order.price,
    status: 'success'
  });

    res.json({
      message: 'Order berhasil diproses',
      order: order
    });
  });
});

// lihat riwayat order (STACK)
app.get('/api/history', (req, res) => {
  res.json(orderHistory.getAll());
});

// sorting order berdasarkan harga (DSA)
app.get('/api/admin/orders/sort/price', (req, res) => {
  const sql = `SELECT * FROM orders`;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Gagal ambil data' });
    }

    const sorted = bubbleSortByPrice(results);
    res.json(sorted);
  });
});

// searching order berdasarkan order_id (DSA)
app.get('/api/admin/orders/search/:id', (req, res) => {
  const orderId = parseInt(req.params.id);
  const sql = `SELECT * FROM orders`;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Gagal ambil data' });
    }

    const result = linearSearchByOrderId(results, orderId);

    if (!result) {
      return res.json({ message: 'Order tidak ditemukan' });
    }

    res.json(result);
  });
});

// admin login
app.post('/api/admin/login', login);

// cek pesanan oleh user
app.get('/api/orders/:id', (req, res) => {
  const orderId = parseInt(req.params.id);

  const sql = `SELECT order_id, ml_id, diamond, price, status FROM orders WHERE order_id = ?`;

  db.query(sql, [orderId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
    }

    res.json(results[0]);
  });
});
