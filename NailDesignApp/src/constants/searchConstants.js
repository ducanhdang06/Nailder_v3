export const SEARCH_CONFIG = {
    TOP_DESIGNS: 10,
    MAX_RECENT_SEARCHES: 10,
    SEARCH_DELAY: 1000, // Mock search delay
  };
  
  // Storage keys
  export const STORAGE_KEYS = {
    RECENT_SEARCHES: (userId) => `recent_searches_${userId || "guest"}`,
  };
  
  // Ranking indicators for top designs
  export const RANKING_INDICATORS = {
    0: { icon: "👑", color: "#FFD700", label: "#1" }, // Gold crown
    1: { icon: "🥈", color: "#C0C0C0", label: "#2" }, // Silver medal
    2: { icon: "🥉", color: "#CD7F32", label: "#3" }, // Bronze medal
  };
  
  // Search types
  export const SEARCH_TYPES = {
    DESIGN: "design",
    TECHNICIAN: "technician",
  };