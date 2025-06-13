const express = require("express");
const router = express.Router();
const db = require("../db");
const verifyToken = require("../middlewares/auth");
const { getTechnicianProfileQuery } = require("../queries/profile");

// for the technician to access their own info
router.get("/me", verifyToken, async (req, res) => {
  const techId = req.user.sub;
  const client = await db.connect();

  try {
    const { rows } = await client.query(getTechnicianProfileQuery, [techId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Technician not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching own technician profile:", err);
    res.status(500).json({ error: "Server error" });
  } finally {
    client.release();
  }
});

// for the technician to edit their own info
router.put("/me", verifyToken, async (req, res) => {
  const techId = req.user.sub;
  const {
    profile_image_url,
    bio,
    location,
    phone_number,
    years_experience,
    social_links,
    specialties,
  } = req.body;

  const client = await db.connect();

  try {
    await client.query(
      `
        UPDATE technician_profiles
        SET
          profile_image_url = $1,
          bio = $2,
          location = $3,
          phone_number = $4,
          years_experience = $5,
          social_links = $6,
          specialties = $7,
          updated_at = NOW()
        WHERE tech_id = $8
      `,
      [
        profile_image_url,
        bio,
        location,
        phone_number,
        years_experience,
        social_links,
        specialties,
        techId,
      ]
    );

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("❌ Failed to update profile:", err);
    res.status(500).json({ error: "Failed to update profile" });
  } finally {
    client.release();
  }
});

// for the user to access the technician info
router.get("/:techId", verifyToken, async (req, res) => {
  const techId = req.params.techId;
  const client = await db.connect();

  try {
    const { rows } = await client.query(getTechnicianProfileQuery, [techId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Technician not found" });
    }
    console.log("FOUNDDDDD", rows[0]);
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching technician profile:", err);
    res.status(500).json({ error: "Server error" });
  } finally {
    client.release();
  }
});

module.exports = router;
