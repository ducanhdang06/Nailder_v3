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

// POST /api/matches/unsave
router.post('/unsave', verifyToken, async (req, res) => {
    const { design_id } = req.body;
    const user_id = req.user.sub;
  
    const client = await db.connect();
    try {
      await client.query('BEGIN');
  
      const result = await client.query(`
        WITH updated AS (
          UPDATE matches
          SET liked = FALSE
          WHERE user_id = $1
            AND design_id = $2
            AND liked = TRUE
          RETURNING design_id
        )
        UPDATE designs
        SET likes = GREATEST(likes - 1, 0)
        WHERE id IN (SELECT design_id FROM updated)
      `, [user_id, design_id]);
  
      await client.query('COMMIT');
      res.status(200).json({ message: 'Design unsaved' });
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('❌ Error unsaving design:', err);
      res.status(500).json({ message: 'Failed to unsave design' });
    } finally {
      client.release();
    }
  });
  

module.exports = router;
