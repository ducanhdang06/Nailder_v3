// routes/feed.js
const router = require("express").Router();
const db = require("../db");
const verifyToken = require("../middlewares/auth");

// Get designs the user hasn't swiped on
router.get("/unseen", verifyToken, async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 20, 50);
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
        LIMIT $2
      `,
      [userId, limit]
    );
    console.log(`Fetched ${rows.length} designs (requested: ${limit})`);
    res.status(200).json(rows);
  } catch (err) {
    console.error("❌ Error fetching unseen designs:", err);
    res.status(500).json({ error: "Failed to fetch unseen designs" });
  }
});

// get the saved designs (where the user swipe right)
router.get("/saved", verifyToken, async (req, res) => {
  const userId = req.user.sub;

  try {
    const { rows } = await db.query(
      `SELECT 
      d.id, 
      d.title, 
      d.description, 
      d.image_url AS "imageUrl", 
      d.created_at, 
      d.likes, 
      d.tech_id, 
      u.full_name AS "designerName", 
      u.email AS "designerEmail", 
      m.created_at AS "savedAt", 
      COALESCE(
        STRING_AGG(dt.tag, ',' ORDER BY dt.tag), 
        ''
      ) AS "tags",
      COALESCE(
        ARRAY_AGG(di.image_url ORDER BY di.uploaded_at) FILTER (WHERE di.image_url IS NOT NULL),
        ARRAY[]::TEXT[]
      ) AS "extraImages"
    FROM matches m 
    JOIN designs d ON m.design_id = d.id 
    JOIN users u ON d.tech_id = u.id 
    LEFT JOIN design_tags dt ON d.id = dt.design_id 
    LEFT JOIN design_images di ON d.id = di.design_id
    WHERE m.user_id = $1 AND m.liked = true 
    GROUP BY d.id, d.title, d.description, d.image_url, d.created_at, d.likes, d.tech_id, u.full_name, u.email, m.created_at 
    ORDER BY m.created_at DESC;`,
      [userId]
    );

    res.status(200).json(rows);
  } catch (err) {
    console.error("❌ Error fetching saved designs:", err);
    res.status(500).json({ error: "Failed to fetch saved designs" });
  }
});

module.exports = router;
