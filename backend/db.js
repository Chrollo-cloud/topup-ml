const mysql = require('mysql2');

// buat koneksi
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',        // sesuaikan
  password: '',        // sesuaikan
  database: 'topup_ml'
});

// test koneksi
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

module.exports = db;
