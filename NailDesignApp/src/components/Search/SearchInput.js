import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { searchStyles } from '../../styles/searchStyles';

/**
 * SearchInput component for search functionality
 * @param {Object} props - Component props
 * @param {string} props.searchText - Current search text
 * @param {Function} props.onSearchTextChange - Handler for search text changes
 * @param {Function} props.onSearch - Handler for search submission
 * @param {Function} props.onBack - Handler for back button (optional)
 * @param {boolean} props.isLoading - Loading state
 * @param {boolean} props.showBackButton - Whether to show back button
 * @returns {JSX.Element}
 */
const SearchInput = ({
  searchText,
  onSearchTextChange,
  onSearch,
  onBack,
  isLoading = false,
  showBackButton = false,
}) => {
  return (
    <View style={searchStyles.searchContainer}>
      {showBackButton && (
        <TouchableOpacity
          style={searchStyles.backButton}
          onPress={onBack}
        >
          <Text style={searchStyles.backButtonText}>←</Text>
        </TouchableOpacity>
      )}
      
      <TextInput
        style={[
          searchStyles.searchInput,
          showBackButton && searchStyles.searchInputWithBack,
        ]}
        placeholder="Search designs, styles, techniques..."
        value={searchText}
        onChangeText={onSearchTextChange}
        onSubmitEditing={onSearch}
        returnKeyType="search"
      />
      
      <TouchableOpacity
        style={searchStyles.searchButton}
        onPress={onSearch}
        disabled={!searchText.trim() || isLoading}
      >
        <LinearGradient
          colors={["#fb7185", "#ec4899"]}
          style={searchStyles.searchButtonGradient}
        >
          <Text style={searchStyles.searchButtonText}>
            {isLoading ? "..." : "Search"}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;