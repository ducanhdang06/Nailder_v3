import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from "../../context/userContext";
import { authStyles } from "../../styles/authStyles";
import { uploadStyles } from "../../styles/uploadStyles";
import { LinearGradient } from "expo-linear-gradient";

const CustomerSearch = ({ navigation }) => {
  const { user } = useUser();
  const [searchText, setSearchText] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  
  // Configuration
  const MAX_RECENT_SEARCHES = 10;
  const STORAGE_KEY = `recent_searches_${user?.sub || 'guest'}`;

  // Load recent searches on component mount
  useEffect(() => {
    loadRecentSearches();
  }, []);

  // ===== RECENT SEARCHES MANAGEMENT =====

  const loadRecentSearches = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const searches = JSON.parse(stored);
        // Sort by timestamp (most recent first)
        const sortedSearches = searches.sort((a, b) => b.timestamp - a.timestamp);
        setRecentSearches(sortedSearches);
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  };

  const saveSearchToRecent = async (searchQuery) => {
    if (!searchQuery.trim()) return;

    try {
      const newSearch = {
        id: Date.now().toString(),
        query: searchQuery.trim().toLowerCase(),
        displayQuery: searchQuery.trim(),
        timestamp: Date.now(),
        userId: user?.sub || 'guest'
      };

      // Remove duplicate if exists
      const filteredSearches = recentSearches.filter(
        search => search.query !== newSearch.query
      );

      // Add new search at the beginning
      const updatedSearches = [newSearch, ...filteredSearches]
        .slice(0, MAX_RECENT_SEARCHES); // Limit to max searches

      setRecentSearches(updatedSearches);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSearches));

      // Optional: Sync to backend
      await syncSearchToBackend(newSearch);
    } catch (error) {
      console.error('Error saving recent search:', error);
    }
  };

  const removeRecentSearch = async (searchId) => {
    try {
      const updatedSearches = recentSearches.filter(search => search.id !== searchId);
      setRecentSearches(updatedSearches);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSearches));
    } catch (error) {
      console.error('Error removing recent search:', error);
    }
  };

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
              setRecentSearches([]);
              await AsyncStorage.removeItem(STORAGE_KEY);
            } catch (error) {
              console.error('Error clearing recent searches:', error);
            }
          }
        }
      ]
    );
  };

  // ===== BACKEND SYNC (OPTIONAL) =====

  const syncSearchToBackend = async (searchData) => {
    if (!user?.sub) return; // Only sync for logged-in users

    try {
      // TODO: Implement GraphQL mutation to save search to backend
      // const { data } = await saveUserSearch({
      //   variables: {
      //     userId: user.sub,
      //     searchQuery: searchData.query,
      //     timestamp: searchData.timestamp
      //   }
      // });
      console.log('Search synced to backend:', searchData.query);
    } catch (error) {
      console.error('Error syncing search to backend:', error);
      // Fail silently - local storage still works
    }
  };

  // ===== SEARCH FUNCTIONALITY =====

  const performSearch = async (query) => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      // Save to recent searches
      await saveSearchToRecent(query);

      // TODO: Implement actual search logic
      // const { data } = await searchDesigns({
      //   variables: { query: query.trim() }
      // });
      
      // Mock search results for now
      setTimeout(() => {
        setSearchResults([
          { id: 1, title: `Result for "${query}"`, type: 'design' },
          { id: 2, title: `Another result for "${query}"`, type: 'technician' },
        ]);
        setIsLoading(false);
      }, 1000);

    } catch (error) {
      console.error('Search error:', error);
      setIsLoading(false);
      Alert.alert('Error', 'Failed to perform search. Please try again.');
    }
  };

  const handleSearch = () => {
    performSearch(searchText);
  };

  const handleRecentSearchPress = (search) => {
    setSearchText(search.displayQuery);
    performSearch(search.displayQuery);
  };

  // ===== RENDER FUNCTIONS =====

  const renderRecentSearchItem = ({ item }) => (
    <View style={styles.recentSearchItem}>
      <TouchableOpacity
        style={styles.recentSearchButton}
        onPress={() => handleRecentSearchPress(item)}
      >
        <View style={styles.recentSearchContent}>
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.recentSearchText}>{item.displayQuery}</Text>
        </View>
        <Text style={styles.recentSearchTime}>
          {new Date(item.timestamp).toLocaleDateString()}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeRecentSearch(item.id)}
      >
        <Text style={styles.removeButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSearchResult = ({ item }) => (
    <TouchableOpacity style={styles.searchResultItem}>
      <Text style={styles.searchResultTitle}>{item.title}</Text>
      <Text style={styles.searchResultType}>{item.type}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={authStyles.safeArea}>
      {/* Header */}
      <View style={uploadStyles.pageHeader}>
        <Text style={uploadStyles.pageHeaderTitle}>Search</Text>
      </View>

      <View style={styles.container}>
        {/* Search Input */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search designs, styles, techniques..."
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
            disabled={!searchText.trim() || isLoading}
          >
            <LinearGradient
              colors={["#fb7185", "#ec4899"]}
              style={styles.searchButtonGradient}
            >
              <Text style={styles.searchButtonText}>
                {isLoading ? "..." : "Search"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fb7185" />
            <Text style={styles.loadingText}>Searching...</Text>
          </View>
        ) : searchResults.length > 0 ? (
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderSearchResult}
            style={styles.resultsList}
          />
        ) : (
          <View style={styles.recentSection}>
            {/* Recent Searches Header */}
            {recentSearches.length > 0 && (
              <View style={styles.recentHeader}>
                <Text style={styles.recentTitle}>Recent Searches</Text>
                <TouchableOpacity onPress={clearAllRecentSearches}>
                  <Text style={styles.clearButton}>Clear All</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Recent Searches List */}
            {recentSearches.length > 0 ? (
              <FlatList
                data={recentSearches}
                keyExtractor={(item) => item.id}
                renderItem={renderRecentSearchItem}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>🔍</Text>
                <Text style={styles.emptyTitle}>Start Searching</Text>
                <Text style={styles.emptySubtitle}>
                  Search for nail designs, techniques, or find talented technicians
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  searchContainer: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    gap: 12,
  },
  searchInput: {
    flex: 1,
    height: 48,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  searchButton: {
    height: 48,
    minWidth: 80,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchButtonGradient: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    height: 48,
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  recentSection: {
    flex: 1,
    paddingHorizontal: 16,
  },
  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  clearButton: {
    fontSize: 14,
    color: "#fb7185",
    fontWeight: "600",
  },
  recentSearchItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  recentSearchButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  recentSearchContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 12,
    color: "#6b7280",
  },
  recentSearchText: {
    fontSize: 16,
    color: "#111827",
    flex: 1,
  },
  recentSearchTime: {
    fontSize: 12,
    color: "#9ca3af",
  },
  removeButton: {
    padding: 16,
    paddingLeft: 8,
  },
  removeButtonText: {
    fontSize: 18,
    color: "#9ca3af",
    fontWeight: "300",
  },
  resultsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  searchResultItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchResultTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  searchResultType: {
    fontSize: 14,
    color: "#6b7280",
    textTransform: "capitalize",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: "#6b7280",
    marginTop: 16,
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 24,
    fontWeight: "500",
  },
});

export default CustomerSearch;