import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS, SEARCH_CONFIG } from '../constants/searchConstants';
import { 
  createSearchObject, 
  updateSearchHistory, 
  sortSearchesByTimestamp 
} from '../utils/searchUtils';

/**
 * Search storage service for managing recent searches
 */
export class SearchStorageService {
  constructor(userId) {
    this.userId = userId;
    this.storageKey = STORAGE_KEYS.RECENT_SEARCHES(userId);
  }

  /**
   * Load recent searches from storage
   * @returns {Promise<Array>} - Array of recent searches
   */
  async loadRecentSearches() {
    try {
      const stored = await AsyncStorage.getItem(this.storageKey);
      if (stored) {
        const searches = JSON.parse(stored);
        return sortSearchesByTimestamp(searches);
      }
      return [];
    } catch (error) {
      console.error("Error loading recent searches:", error);
      return [];
    }
  }

  /**
   * Save search to recent searches
   * @param {string} searchQuery - Search query to save
   * @param {Array} currentSearches - Current searches array
   * @returns {Promise<Array>} - Updated searches array
   */
  async saveSearchToRecent(searchQuery, currentSearches) {
    if (!searchQuery.trim()) return currentSearches;

    try {
      const newSearch = createSearchObject(searchQuery, this.userId);
      const updatedSearches = updateSearchHistory(
        currentSearches,
        newSearch,
        SEARCH_CONFIG.MAX_RECENT_SEARCHES
      );

      await AsyncStorage.setItem(this.storageKey, JSON.stringify(updatedSearches));
      return updatedSearches;
    } catch (error) {
      console.error("Error saving recent search:", error);
      return currentSearches;
    }
  }

  /**
   * Remove a recent search
   * @param {string} searchId - ID of search to remove
   * @param {Array} currentSearches - Current searches array
   * @returns {Promise<Array>} - Updated searches array
   */
  async removeRecentSearch(searchId, currentSearches) {
    try {
      const updatedSearches = currentSearches.filter(
        (search) => search.id !== searchId
      );
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(updatedSearches));
      return updatedSearches;
    } catch (error) {
      console.error("Error removing recent search:", error);
      return currentSearches;
    }
  }

  /**
   * Clear all recent searches
   * @returns {Promise<void>}
   */
  async clearAllRecentSearches() {
    try {
      await AsyncStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error("Error clearing recent searches:", error);
      throw error;
    }
  }
}

/**
 * Backend sync service for search history
 */
export class SearchSyncService {
  constructor(user) {
    this.user = user;
  }

  /**
   * Sync search to backend
   * @param {Object} searchData - Search data to sync
   * @returns {Promise<void>}
   */
  async syncSearchToBackend(searchData) {
    if (!this.user?.sub) return; // Only sync for logged-in users

    try {
      // TODO: Implement GraphQL mutation to save search to backend
      // Example implementation:
      // const { data } = await client.mutate({
      //   mutation: SAVE_SEARCH_MUTATION,
      //   variables: {
      //     userId: this.user.sub,
      //     searchQuery: searchData.query,
      //     timestamp: searchData.timestamp
      //   }
      // });

      console.log("Search synced to backend:", searchData.query);
    } catch (error) {
      console.error("Error syncing search to backend:", error);
      // Fail silently - local storage still works
    }
  }
}