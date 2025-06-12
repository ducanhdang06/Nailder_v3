export const SOCIAL_PLATFORMS = {
    instagram: '📷',
    tiktok: '🎵',
    facebook: '📘',
    youtube: '▶️',
    pinterest: '📌',
    website: '🌐',
  };
  
  export const PLATFORM_URLS = {
    instagram: (handle) => `https://instagram.com/${handle.replace('@', '')}`,
    tiktok: (handle) => `https://tiktok.com/@${handle.replace('@', '')}`,
    facebook: (handle) => `https://facebook.com/${handle.replace('@', '')}`,
    youtube: (handle) => `https://youtube.com/@${handle.replace('@', '')}`,
    pinterest: (handle) => `https://pinterest.com/${handle.replace('@', '')}`,
    website: (url) => url.startsWith('http') ? url : `https://${url}`,
  };

  export const SPECIALTY_OPTIONS = [
    "Gel Extensions",
    "Acrylic Nails",
    "Hard Gel",
    "Builder Gel",
    "Natural Nail Manicure",
    "Classic Polish",
    "Gel Polish",
    "Dip Powder",
    "French Tips",
    "Nail Art",
    "3D Nail Art",
    "Chrome Nails",
    "Cat Eye Design",
    "Ombre Nails",
    "Matte Finish",
    "Press-On Custom Design",
    "Stiletto Shape",
    "Coffin Shape",
    "Almond Shape",
    "Square Shape",
    "Pedicure",
    "Spa Pedicure",
    "Cuticle Care",
    "Nail Repair",
    "Kids’ Nail Services",
  ];
  