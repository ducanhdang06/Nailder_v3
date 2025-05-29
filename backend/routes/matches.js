const router = require('express').Router();
const db = require('../db');
const verifyToken = require('../middlewares/auth');

// Record a swipe (like or dislike)
router.post('/', verifyToken, async (req, res) => {
  const { design_id, liked } = req.body;
  const user_id = req.user.sub;

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    // 1. Insert or update match
    await client.query(`
      INSERT INTO matches (id, design_id, user_id, liked, created_at)
      VALUES (gen_random_uuid(), $1, $2, $3, NOW())
      ON CONFLICT (user_id, design_id)
      DO UPDATE SET liked = EXCLUDED.liked
    `, [design_id, user_id, liked]);

    // 2. Increment likes if swipe was a "like"
    if (liked) {
      await client.query(`
        UPDATE designs
        SET likes = likes + 1
        WHERE id = $1
      `, [design_id]);
    }

    await client.query('COMMIT');
    res.status(201).json({ message: 'Swipe recorded' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error saving swipe:', err);
    res.status(500).json({ message: 'Failed to save swipe' });
  } finally {
    client.release();
  }
});

module.exports = router;
