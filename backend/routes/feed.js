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
    SELECT 
    d.id, 
    d.title, 
    d.description, 
    d.image_url AS "imageUrl", 
    d.created_at,
    d.likes,
    d.tech_id,
    u.full_name AS "designerName",
    u.email AS "designerEmail",
    COALESCE(
        STRING_AGG(dt.tag, ',' ORDER BY dt.tag), 
        ''
    ) AS "tags"
    FROM designs d
    JOIN users u ON d.tech_id = u.id
    LEFT JOIN design_tags dt ON d.id = dt.design_id
    WHERE NOT EXISTS (
      SELECT 1 FROM matches m
      WHERE m.design_id = d.id AND m.user_id = $1
    )
    GROUP BY d.id, d.title, d.description, d.image_url, d.created_at, d.likes, d.tech_id, u.full_name, u.email
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
