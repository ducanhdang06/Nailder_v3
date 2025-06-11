import React from 'react';
import { View, Text } from 'react-native';
import { searchStyles } from '../../styles/searchStyles';

/**
 * EmptySearchState component for when there are no recent searches
 * @returns {JSX.Element}
 */
const EmptySearchState = () => {
  return (
    <View style={searchStyles.emptyContainer}>
      <Text style={searchStyles.emptyIcon}>🔍</Text>
      <Text style={searchStyles.emptyTitle}>Start Searching</Text>
      <Text style={searchStyles.emptySubtitle}>
        Search for nail designs, techniques, or find talented technicians
      </Text>
    </View>
  );
};

export default EmptySearchState;