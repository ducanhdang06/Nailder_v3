// routes/feed.js
const router = require("express").Router();
const db = require("../db");
const verifyToken = require("../middlewares/auth");

// Get designs the user hasn't swiped on
router.get("/unseen", verifyToken, async (req, res) => {
  const userId = req.user.sub;

  try {
    const { rows } = await db.query(
    `
      SELECT d.id, d.title, d.description, d.image_url AS "imageUrl", d.created_at
      FROM designs d
      WHERE NOT EXISTS (
        SELECT 1 FROM matches m
        WHERE m.design_id = d.id AND m.user_id = $1
      )
      ORDER BY d.created_at DESC
      LIMIT 20
    `,
      [userId]
    );

    res.status(200).json(rows);
  } catch (err) {
    console.error("❌ Error fetching unseen designs:", err);
    res.status(500).json({ error: "Failed to fetch unseen designs" });
  }
});

module.exports = router;
