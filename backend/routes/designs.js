const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middlewares/auth'); // JWT -> req.user

// POST /api/designs
router.post('/', verifyToken, async (req, res) => {
  const { title, description, image_url, tags, extra_images } = req.body;
  const techId = req.user.sub;

  // Validate input
  if (!image_url || !title || !techId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (title.length > 50 || description?.length > 300) {
    return res.status(400).json({ error: 'Title or description too long' });
  }

  if (tags?.some(tag => tag.length > 20) || tags?.length > 5) {
    return res.status(400).json({ error: 'Invalid tag input' });
  }

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    // Insert into designs
    const result = await client.query(
      `INSERT INTO designs (id, image_url, title, description, tech_id, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW() AT TIME ZONE 'UTC')
       RETURNING id`,
      [image_url, title, description, techId]
    );
    const designId = result.rows[0].id;

    // Insert tags
    if (tags && tags.length > 0) {
      const tagValues = tags.map(tag => [designId, tag]);
      const tagQuery = `
        INSERT INTO design_tags (design_id, tag)
        VALUES ${tagValues.map((_, i) => `($${i * 2 + 1}, $${i * 2 + 2})`).join(', ')}
      `;
      await client.query(tagQuery, tagValues.flat());
    }

    // Insert extra images
    if (extra_images && extra_images.length > 0) {
      const imageValues = extra_images.map(url => [designId, url]);
      const imageQuery = `
        INSERT INTO design_images (design_id, image_url)
        VALUES ${imageValues.map((_, i) => `($${i * 2 + 1}, $${i * 2 + 2})`).join(', ')}
      `;
      await client.query(imageQuery, imageValues.flat());
    }

    await client.query('COMMIT');
    res.status(201).json({ message: 'Design created successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Design insert failed:', err);
    res.status(500).json({ error: 'Server error creating design' });
  } finally {
    client.release();
  }
});

// GET /api/designs/mine
router.get('/mine', verifyToken, async (req, res) => {
    const techId = req.user.sub;
    try {
      const { rows } = await db.query(
        `
        SELECT 
          d.id,
          d.title,
          d.description,
          d.image_url,
          d.likes,
          d.created_at AT TIME ZONE 'UTC' AS created_at,
          COALESCE(
            STRING_AGG(dt.tag, ',' ORDER BY dt.tag), 
            ''
          ) AS tags
        FROM designs d
        LEFT JOIN design_tags dt ON d.id = dt.design_id
        WHERE d.tech_id = $1
        GROUP BY d.id
        ORDER BY d.created_at DESC
        `,
        [techId]
      );
  
      res.status(200).json(rows);
    } catch (err) {
      console.error("❌ Error fetching technician's designs:", err);
      res.status(500).json({ error: 'Failed to fetch your designs' });
    }
  });

  router.get("/:designId", verifyToken, async (req, res) => {
    const designId = req.params.designId;
    const userId = req.user.sub; // from JWT token
    const client = await db.connect();
  
    const query = `
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
  ) AS "tags",
  COALESCE(
    ARRAY_AGG(di.image_url ORDER BY di.uploaded_at) 
    FILTER (WHERE di.image_url IS NOT NULL),
    ARRAY[]::TEXT[]
  ) AS "extraImages"
FROM designs d 
JOIN users u ON d.tech_id = u.id 
LEFT JOIN design_tags dt ON d.id = dt.design_id 
LEFT JOIN design_images di ON d.id = di.design_id
WHERE d.id = $1
GROUP BY d.id, u.full_name, u.email; 
    `;
  
    try {
      const { rows } = await client.query(query, [designId]);
  
      if (rows.length === 0) {
        return res.status(404).json({ error: "Design not found" });
      }
  
      res.json(rows[0]);
    } catch (err) {
      console.error("Error fetching design with liked status:", err);
      res.status(500).json({ error: "Server error" });
    } finally {
      client.release();
    }
  });
  

module.exports = router;
