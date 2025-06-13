const getTechnicianProfileQuery = `
SELECT 
u.id AS user_id,
u.full_name,
u.email,
u.role,
tp.bio,
tp.phone_number,
tp.location,
tp.profile_image_url,
tp.social_links,
tp.years_experience,
tp.specialties,

COUNT(d.id) AS total_designs,
COALESCE(SUM(d.likes), 0) AS total_likes,

(
  SELECT json_agg(top_designs)
  FROM (
    SELECT 
      d.id, 
      d.title, 
      d.image_url, 
      d.likes, 
      d.description,
      (
        SELECT array_agg(tag)
        FROM design_tags
        WHERE design_id = d.id
      ) AS tags,
      (
        SELECT array_agg(image_url)
        FROM design_images
        WHERE design_id = d.id
      ) AS extra_images
    FROM designs d
    WHERE d.tech_id = u.id
    ORDER BY d.likes DESC
    LIMIT 3
  ) top_designs
) AS top_liked_designs,

(
  SELECT json_agg(recent_designs)
  FROM (
    SELECT 
      d.id, 
      d.title, 
      d.image_url, 
      d.created_at, 
      d.likes, 
      d.description,
      (
        SELECT array_agg(tag)
        FROM design_tags
        WHERE design_id = d.id
      ) AS tags,
      (
        SELECT array_agg(image_url)
        FROM design_images
        WHERE design_id = d.id
      ) AS extra_images
    FROM designs d
    WHERE d.tech_id = u.id
    ORDER BY d.created_at DESC
    LIMIT 3
  ) recent_designs
) AS recent_designs

FROM users u
LEFT JOIN technician_profiles tp ON tp.tech_id = u.id
LEFT JOIN designs d ON d.tech_id = u.id
WHERE u.id = $1 AND u.role = 'technician'
GROUP BY 
u.id, 
tp.tech_id, 
tp.bio, 
tp.phone_number, 
tp.location, 
tp.profile_image_url, 
tp.social_links, 
tp.years_experience, 
tp.specialties;
`;

module.exports = {
  getTechnicianProfileQuery,
};
