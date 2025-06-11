import React from 'react';
import { View, Text } from 'react-native';
import DesignResultCard from './DesignResultCard';
import TechnicianResultCard from './TechnicianResultCard';
import { SEARCH_TYPES } from '../../constants/searchConstants';

/**
 * SearchResultItem component for displaying search results
 * @param {Object} props - Component props
 * @param {Object} props.item - Search result item data
 * @param {Function} props.onPress - Press handler
 * @returns {JSX.Element}
 */
const SearchResultItem = ({ item, onPress }) => {
  switch (item.type) {
    case SEARCH_TYPES.DESIGN:
      return <DesignResultCard design={item} onPress={onPress} />;
    
    case SEARCH_TYPES.TECHNICIAN:
      return <TechnicianResultCard technician={item} onPress={onPress} />;
    
    default:
      // Fallback for unknown types
      return (
        <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.title || item.name}</Text>
          <Text style={{ color: '#666', marginTop: 4 }}>Type: {item.type}</Text>
        </View>
      );
  }
};

export default SearchResultItem;