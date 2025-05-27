const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middlewares/auth');

router.post('/', verifyToken, async (req, res) => {
  const { full_name, email, role } = req.body;
  const userId = req.user.sub;

  try {
    await db.query(`
      INSERT INTO users (id, full_name, email, role, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      ON CONFLICT (id) DO NOTHING
    `, [userId, full_name, email, role]);
    
    console.log("📝 Saving user:", { userId, full_name, email, role });
    res.status(201).json({ message: 'User saved to DB' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

module.exports = router;

