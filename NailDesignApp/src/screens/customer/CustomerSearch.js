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
  ScrollView,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "../../context/userContext";
import { authStyles } from "../../styles/authStyles";
import { uploadStyles } from "../../styles/uploadStyles";
import { LinearGradient } from "expo-linear-gradient";
import { savedDesignsApi } from "../../services/savedDesigns";

const CustomerSearch = ({ navigation }) => {
  const { user } = useUser();
  const [searchText, setSearchText] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [topLikedDesigns, setTopLikedDesigns] = useState([]);
  const [isLoadingTopDesigns, setIsLoadingTopDesigns] = useState(true);

  // Configuration
  const TOP_DESIGNS = 10;
  const MAX_RECENT_SEARCHES = 10;
  const STORAGE_KEY = `recent_searches_${user?.sub || "guest"}`;

  // Load recent searches and top designs on component mount
  useEffect(() => {
    loadRecentSearches();
    loadTopLikedDesigns();
  }, []);

  // ===== RECENT SEARCHES MANAGEMENT =====

  const loadRecentSearches = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const searches = JSON.parse(stored);
        // Sort by timestamp (most recent first)
        const sortedSearches = searches.sort(
          (a, b) => b.timestamp - a.timestamp
        );
        setRecentSearches(sortedSearches);
      }
    } catch (error) {
      console.error("Error loading recent searches:", error);
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
        userId: user?.sub || "guest",
      };

      // Remove duplicate if exists
      const filteredSearches = recentSearches.filter(
        (search) => search.query !== newSearch.query
      );

      // Add new search at the beginning
      const updatedSearches = [newSearch, ...filteredSearches].slice(
        0,
        MAX_RECENT_SEARCHES
      ); // Limit to max searches

      setRecentSearches(updatedSearches);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSearches));

      // Optional: Sync to backend
      await syncSearchToBackend(newSearch);
    } catch (error) {
      console.error("Error saving recent search:", error);
    }
  };

  const removeRecentSearch = async (searchId) => {
    try {
      const updatedSearches = recentSearches.filter(
        (search) => search.id !== searchId
      );
      setRecentSearches(updatedSearches);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSearches));
    } catch (error) {
      console.error("Error removing recent search:", error);
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
              console.error("Error clearing recent searches:", error);
            }
          },
        },
      ]
    );
  };

  // ===== BACKEND SYNC (OPTIONAL) =====

  const syncSearchToBackend = async (searchData) => {
    if (!user?.sub) return; // Only sync for logged-in users

    try {
      // TODO: Implement GraphQL mutation to save search to backend

      //   variables: {
      //     userId: user.sub,
      //     searchQuery: searchData.query,
      //     timestamp: searchData.timestamp
      //   }

      console.log("Search synced to backend:", searchData.query);
    } catch (error) {
      console.error("Error syncing search to backend:", error);
      // Fail silently - local storage still works
    }
  };

  // ===== TOP LIKED DESIGNS =====

  const loadTopLikedDesigns = async () => {
    try {
      setIsLoadingTopDesigns(true);
      const data = await savedDesignsApi.searchFeed(TOP_DESIGNS);
      setTopLikedDesigns(data);
      setIsLoadingTopDesigns(false);
    } catch (error) {
      console.error("Error loading top liked designs:", error);
      setIsLoadingTopDesigns(false);
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
          { id: 1, title: `Result for "${query}"`, type: "design" },
          { id: 2, title: `Another result for "${query}"`, type: "technician" },
        ]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Search error:", error);
      setIsLoading(false);
      Alert.alert("Error", "Failed to perform search. Please try again.");
    }
  };

  const handleSearch = () => {
    performSearch(searchText);
  };

  const handleRecentSearchPress = (search) => {
    setSearchText(search.displayQuery);
    performSearch(search.displayQuery);
  };

  const clearSearchResults = () => {
    setSearchResults([]);
    setSearchText("");
  };

  // ===== RENDER FUNCTIONS =====

  const renderTopDesignItem = ({ item, index }) => {
    // Get ranking indicators for top 3
    const getRankingIndicator = (position) => {
      switch (position) {
        case 0: return { icon: "👑", color: "#FFD700", label: "#1" }; // Gold crown
        case 1: return { icon: "🥈", color: "#C0C0C0", label: "#2" }; // Silver medal
        case 2: return { icon: "🥉", color: "#CD7F32", label: "#3" }; // Bronze medal
        default: return null;
      }
    };

    const ranking = getRankingIndicator(index);

    return (
      <TouchableOpacity
        style={styles.topDesignCard}
        onPress={() => {
          navigation.navigate('DesignDetail', { design: item });
          // TODO: Navigate to design details
          console.log("Navigate to design:", item.id);
        }}
      >
        <View style={styles.designImageContainer}>
          <Image source={{ uri: item.imageUrl }} style={styles.designImage} />
          
          {/* Ranking Badge - Top Left */}
          {ranking && (
            <View style={[styles.rankingBadge, { backgroundColor: ranking.color }]}>
              <Text style={styles.rankingIcon}>{ranking.icon}</Text>
              <Text style={styles.rankingText}>{ranking.label}</Text>
            </View>
          )}
          
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.6)"]}
            style={styles.designImageOverlay}
          >
            <View style={styles.designLikes}>
              <Text style={styles.likesIcon}>❤️</Text>
              <Text style={styles.likesCount}>{item.likes}</Text>
            </View>
          </LinearGradient>
        </View>
        <View style={styles.designInfo}>
          <Text style={styles.designTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.designCreator} numberOfLines={1}>
            by {item.designerName}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tagsContainer}
          >
            {item.tags.split(",").map((tag, index) => (
              <View key={index} style={styles.tagChip}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    );
  };

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
          {searchResults.length > 0 && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={clearSearchResults}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
          )}
          <TextInput
            style={[
              styles.searchInput,
              searchResults.length > 0 && styles.searchInputWithBack,
            ]}
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
          <ScrollView
            style={styles.recentSection}
            showsVerticalScrollIndicator={false}
          >
            {/* Top Liked Designs Section */}
            <View style={styles.topDesignsSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>✨ Most Loved Designs</Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("AllDesignsScreen", {
                      topDesigns: topLikedDesigns
                    });
                  }}
                >
                  <Text style={styles.seeAllButton}>See All</Text>
                </TouchableOpacity>
              </View>

              {isLoadingTopDesigns ? (
                <View style={styles.topDesignsLoading}>
                  <ActivityIndicator size="small" color="#fb7185" />
                  <Text style={styles.loadingSmallText}>
                    Loading trending designs...
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={topLikedDesigns.slice(0, 3)}
                  keyExtractor={(item) => item.id}
                  renderItem={renderTopDesignItem}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.topDesignsList}
                />
              )}
            </View>

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
                  Search for nail designs, techniques, or find talented
                  technicians
                </Text>
              </View>
            )}
          </ScrollView>
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
  searchInputWithBack: {
    marginLeft: 0,
  },
  backButton: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginRight: 8,
  },
  backButtonText: {
    fontSize: 20,
    color: "#6b7280",
    fontWeight: "400",
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
  // Top Designs Styles
  topDesignsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  seeAllButton: {
    fontSize: 14,
    color: "#fb7185",
    fontWeight: "600",
  },
  topDesignsList: {
    paddingRight: 16,
  },
  topDesignCard: {
    width: 180,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    overflow: "hidden",
  },
  designImageContainer: {
    position: "relative",
    height: 140,
  },
  designImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f3f4f6",
  },
  designImageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    justifyContent: "flex-end",
    padding: 12,
  },
  designLikes: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  likesIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  likesCount: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
  },
  designInfo: {
    padding: 12,
  },
  designTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  designCreator: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: "row",
  },
  tagChip: {
    backgroundColor: "#fef3f4",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 6,
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  tagText: {
    fontSize: 10,
    color: "#dc2626",
    fontWeight: "500",
  },
  topDesignsLoading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  loadingSmallText: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 12,
    fontWeight: "500",
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
  rankingBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  rankingIcon: {
    fontSize: 14,
    marginRight: 2,
  },
  rankingText: {
    fontSize: 11,
    color: "#fff",
    fontWeight: "700",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default CustomerSearch;
