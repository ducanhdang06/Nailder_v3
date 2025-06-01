// Purpose: Displays empty state when no designs are available

// Shows friendly message when no content exists
// Includes pull-to-refresh functionality
// Guides user on how to get more content
// Consistent empty state UI pattern

import React from 'react';
import { ScrollView, Text, RefreshControl } from 'react-native';
import { swipeScreenStyles } from '../../styles/swipeScreenStyles';

export const EmptyState = ({ onRefresh, refreshing }) => (
  <ScrollView
    contentContainerStyle={swipeScreenStyles.emptyContainer}
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }
  >
    <Text style={swipeScreenStyles.emptyText}>No designs available</Text>
    <Text style={swipeScreenStyles.emptySubtext}>
      Pull down to refresh and check for new designs
    </Text>
  </ScrollView>
);