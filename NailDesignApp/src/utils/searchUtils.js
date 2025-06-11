import { RANKING_INDICATORS } from '../constants/searchConstants';

/**
 * Get ranking indicator for top designs
 * @param {number} position - Position in the ranking (0-based)
 * @returns {Object|null} - Ranking indicator object or null
 */
export const getRankingIndicator = (position) => {
  return RANKING_INDICATORS[position] || null;
};

/**
 * Format timestamp to readable date
 * @param {number} timestamp - Timestamp in milliseconds
 * @returns {string} - Formatted date string
 */
export const formatSearchDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString();
};

/**
 * Create search object
 * @param {string} searchQuery - Search query string
 * @param {string} userId - User ID
 * @returns {Object} - Search object
 */
export const createSearchObject = (searchQuery, userId) => {
  return {
    id: Date.now().toString(),
    query: searchQuery.trim().toLowerCase(),
    displayQuery: searchQuery.trim(),
    timestamp: Date.now(),
    userId: userId || "guest",
  };
};

/**
 * Remove duplicate searches and limit to max count
 * @param {Array} searches - Array of search objects
 * @param {Object} newSearch - New search object
 * @param {number} maxCount - Maximum number of searches to keep
 * @returns {Array} - Updated searches array
 */
export const updateSearchHistory = (searches, newSearch, maxCount) => {
  // Remove duplicate if exists
  const filteredSearches = searches.filter(
    (search) => search.query !== newSearch.query
  );

  // Add new search at the beginning and limit to max searches
  return [newSearch, ...filteredSearches].slice(0, maxCount);
};

/**
 * Sort searches by timestamp (most recent first)
 * @param {Array} searches - Array of search objects
 * @returns {Array} - Sorted searches array
 */
export const sortSearchesByTimestamp = (searches) => {
  return searches.sort((a, b) => b.timestamp - a.timestamp);
};