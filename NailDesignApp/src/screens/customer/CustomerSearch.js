import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useUser } from "../../context/userContext";
import { authStyles } from "../../styles/authStyles";
import { uploadStyles } from "../../styles/uploadStyles";
import { searchStyles } from "../../styles/searchStyles";
import { SEARCH_TYPES } from "../../constants/searchConstants";

// Custom hook
import { useSearch } from "../../hooks/Search/useSearch";

// Components
import SearchInput from "../../components/Search/SearchInput";
import TopDesignCard from "../../components/Search/TopDesignCard";
import RecentSearchItem from "../../components/Search/RecentSearchItem";
import SearchResultItem from "../../components/Search/SearchResultItem";
import EmptySearchState from "../../components/Search/EmptySearchState";

const CustomerSearch = ({ navigation }) => {
  const { user } = useUser();
  
  // Use custom search hook
  const {
    searchText,
    recentSearches,
    isLoading,
    searchResults,
    topLikedDesigns,
    isLoadingTopDesigns,
    setSearchText,
    handleSearch,
    handleRecentSearchPress,
    removeRecentSearch,
    clearAllRecentSearches,
    clearSearchResults,
  } = useSearch(user);

  // Navigation handlers
  const handleDesignPress = (design) => {
    navigation.navigate('DesignDetail', { design });
  };

  const handleSeeAllPress = () => {
    navigation.navigate("AllDesignsScreen", {
      topDesigns: topLikedDesigns
    });
  };

  const handleSearchResultPress = (result) => {
    // Navigate based on result type
    switch (result.type) {
      case SEARCH_TYPES.DESIGN:
        navigation.navigate('DesignDetail', { design: result });
        break;
      case SEARCH_TYPES.TECHNICIAN:
        navigation.navigate('TechnicianProfile', { technician: result });
        break;
      default:
        console.log("Unknown result type:", result.type);
    }
  };

  return (
    <SafeAreaView style={authStyles.safeArea}>
      {/* Header */}
      <View style={uploadStyles.pageHeader}>
        <Text style={uploadStyles.pageHeaderTitle}>Search</Text>
      </View>

      <View style={searchStyles.container}>
        {/* Search Input */}
        <SearchInput
          searchText={searchText}
          onSearchTextChange={setSearchText}
          onSearch={handleSearch}
          onBack={clearSearchResults}
          isLoading={isLoading}
          showBackButton={searchResults.length > 0}
        />

        {/* Content */}
        {isLoading ? (
          <View style={searchStyles.loadingContainer}>
            <ActivityIndicator size="large" color="#fb7185" />
            <Text style={searchStyles.loadingText}>Searching...</Text>
          </View>
        ) : searchResults.length > 0 ? (
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <SearchResultItem 
                item={item} 
                onPress={handleSearchResultPress}
              />
            )}
            style={searchStyles.resultsList}
          />
        ) : (
          <FlatList
            data={recentSearches}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <RecentSearchItem
                item={item}
                onPress={handleRecentSearchPress}
                onRemove={removeRecentSearch}
              />
            )}
            style={searchStyles.recentSection}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() => (
              <View>
                {/* Top Liked Designs Section */}
                <View style={searchStyles.topDesignsSection}>
                  <View style={searchStyles.sectionHeader}>
                    <Text style={searchStyles.sectionTitle}>✨ Most Loved Designs</Text>
                    <TouchableOpacity onPress={handleSeeAllPress}>
                      <Text style={searchStyles.seeAllButton}>See All</Text>
                    </TouchableOpacity>
                  </View>

                  {isLoadingTopDesigns ? (
                    <View style={searchStyles.topDesignsLoading}>
                      <ActivityIndicator size="small" color="#fb7185" />
                      <Text style={searchStyles.loadingSmallText}>
                        Loading trending designs...
                      </Text>
                    </View>
                  ) : (
                    <FlatList
                      data={topLikedDesigns.slice(0, 3)}
                      keyExtractor={(item) => item.id}
                      renderItem={({ item, index }) => (
                        <TopDesignCard
                          item={item}
                          index={index}
                          onPress={handleDesignPress}
                        />
                      )}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={searchStyles.topDesignsList}
                    />
                  )}
                </View>

                {/* Recent Searches Header */}
                {recentSearches.length > 0 && (
                  <View style={searchStyles.recentHeader}>
                    <Text style={searchStyles.recentTitle}>Recent Searches</Text>
                    <TouchableOpacity onPress={clearAllRecentSearches}>
                      <Text style={searchStyles.clearButton}>Clear All</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
            ListEmptyComponent={() => 
              recentSearches.length === 0 ? <EmptySearchState /> : null
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default CustomerSearch;
