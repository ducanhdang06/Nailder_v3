const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middlewares/auth');

router.post('/', verifyToken, async (req, res) => {
  const { full_name, email, role } = req.body;
  const userId = req.user.sub;

  const client = await db.connect();

  try {
    await client.query('BEGIN');

    // 1. Insert user
    await client.query(`
      INSERT INTO users (id, full_name, email, role, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      ON CONFLICT (id) DO NOTHING
    `, [userId, full_name, email, role]);

    // 2. If role is technician, create empty profile
    if (role.toLowerCase() === 'technician') {
      await client.query(`
        INSERT INTO technician_profiles (tech_id)
        VALUES ($1)
        ON CONFLICT DO NOTHING
      `, [userId]);
    }

    await client.query('COMMIT');

    console.log("📝 User saved:", { userId, full_name, email, role });
    res.status(201).json({ message: 'User saved to DB' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error("❌ DB error:", err);
    res.status(500).json({ error: 'DB error' });
  } finally {
    client.release();
  }
});

module.exports = router;

