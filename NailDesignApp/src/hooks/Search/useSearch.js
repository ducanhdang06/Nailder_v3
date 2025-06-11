import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { SearchStorageService, SearchSyncService } from '../../services/searchStorageService';
import SearchApiService from '../../services/searchService';
import { savedDesignsApi } from '../../services/savedDesigns';
import { SEARCH_CONFIG } from '../../constants/searchConstants';

/**
 * Custom hook for search functionality
 * @param {Object} user - User object from context
 * @returns {Object} - Search state and methods
 */
export const useSearch = (user) => {
  const [searchText, setSearchText] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [topLikedDesigns, setTopLikedDesigns] = useState([]);
  const [isLoadingTopDesigns, setIsLoadingTopDesigns] = useState(true);

  // Initialize services
  const storageService = new SearchStorageService(user?.sub);
  const syncService = new SearchSyncService(user);
  const searchApiService = new SearchApiService(); // Pass your API client here

  // Load initial data
  useEffect(() => {
    loadRecentSearches();
    loadTopLikedDesigns();
  }, []);

  /**
   * Load recent searches from storage
   */
  const loadRecentSearches = async () => {
    const searches = await storageService.loadRecentSearches();
    setRecentSearches(searches);
  };

  /**
   * Load top liked designs
   */
  const loadTopLikedDesigns = async () => {
    try {
      setIsLoadingTopDesigns(true);
      const data = await savedDesignsApi.searchFeed(SEARCH_CONFIG.TOP_DESIGNS);
      setTopLikedDesigns(data);
    } catch (error) {
      console.error("Error loading top liked designs:", error);
    } finally {
      setIsLoadingTopDesigns(false);
    }
  };

  /**
   * Perform search operation
   * @param {string} query - Search query
   */
  const performSearch = async (query) => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      // Save to recent searches
      const updatedSearches = await storageService.saveSearchToRecent(query, recentSearches);
      setRecentSearches(updatedSearches);

      // Sync to backend if user is logged in
      if (user?.sub) {
        const newSearch = updatedSearches.find(s => s.displayQuery === query.trim());
        if (newSearch) {
          await syncService.syncSearchToBackend(newSearch);
        }
      }

      // Perform actual search using the API service
      const searchResults = await searchApiService.performCombinedSearch(query, {
        includeDesigns: true,
        includeTechnicians: true,
        designFilters: { limit: 20 },
        technicianFilters: { radius: 25 }
      });

      // Combine and format results for display
      const combinedResults = [
        ...searchResults.designs,
        ...searchResults.technicians
      ];

      setSearchResults(combinedResults);
    } catch (error) {
      console.error("Search error:", error);
      Alert.alert("Error", "Failed to perform search. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle search button press
   */
  const handleSearch = () => {
    performSearch(searchText);
  };

  /**
   * Handle recent search item press
   * @param {Object} search - Search object
   */
  const handleRecentSearchPress = (search) => {
    setSearchText(search.displayQuery);
    performSearch(search.displayQuery);
  };

  /**
   * Remove a recent search
   * @param {string} searchId - Search ID to remove
   */
  const removeRecentSearch = async (searchId) => {
    const updatedSearches = await storageService.removeRecentSearch(searchId, recentSearches);
    setRecentSearches(updatedSearches);
  };

  /**
   * Clear all recent searches with confirmation
   */
  const clearAllRecentSearches = () => {
    Alert.alert(
      "Clear Search History",
      "Are you sure you want to clear all recent searches?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              await storageService.clearAllRecentSearches();
              setRecentSearches([]);
            } catch (error) {
              console.error("Error clearing recent searches:", error);
            }
          },
        },
      ]
    );
  };

  /**
   * Clear search results and reset search text
   */
  const clearSearchResults = () => {
    setSearchResults([]);
    setSearchText("");
  };

  return {
    // State
    searchText,
    recentSearches,
    isLoading,
    searchResults,
    topLikedDesigns,
    isLoadingTopDesigns,

    // Setters
    setSearchText,

    // Methods
    handleSearch,
    handleRecentSearchPress,
    removeRecentSearch,
    clearAllRecentSearches,
    clearSearchResults,
    loadTopLikedDesigns,
  };
};