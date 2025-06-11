import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { formatSearchDate } from '../../utils/searchUtils';
import { searchStyles } from '../../styles/searchStyles';

/**
 * RecentSearchItem component for displaying recent search entries
 * @param {Object} props - Component props
 * @param {Object} props.item - Search item data
 * @param {Function} props.onPress - Press handler for search item
 * @param {Function} props.onRemove - Remove handler for search item
 * @returns {JSX.Element}
 */
const RecentSearchItem = ({ item, onPress, onRemove }) => {
  return (
    <View style={searchStyles.recentSearchItem}>
      <TouchableOpacity
        style={searchStyles.recentSearchButton}
        onPress={() => onPress(item)}
      >
        <View style={searchStyles.recentSearchContent}>
          <Text style={searchStyles.searchIcon}>🔍</Text>
          <Text style={searchStyles.recentSearchText}>{item.displayQuery}</Text>
        </View>
        <Text style={searchStyles.recentSearchTime}>
          {formatSearchDate(item.timestamp)}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={searchStyles.removeButton}
        onPress={() => onRemove(item.id)}
      >
        <Text style={searchStyles.removeButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RecentSearchItem;