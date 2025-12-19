const db = require('./db');

function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Data tidak lengkap' });
  }

  const sql = `
    SELECT * FROM users
    WHERE username = ? AND password = ? AND role = 'admin'
  `;

  db.query(sql, [username, password], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Login gagal' });
    }

    res.json({
      message: 'Login berhasil',
      admin: {
        user_id: results[0].user_id,
        username: results[0].username
      }
    });
  });
}

module.exports = {
  login
};
