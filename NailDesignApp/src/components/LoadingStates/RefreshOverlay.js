// Purpose: Overlay loading indicator for background operations

// Shows loading state when fetching additional content
// Non-blocking UI indicator for background operations
// Conditional rendering based on visibility prop

import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { swipeScreenStyles } from '../../styles/swipeScreenStyles';

export const RefreshOverlay = ({ visible }) => {
  if (!visible) return null;
  
  return (
    <View style={swipeScreenStyles.refreshOverlay}>
      <ActivityIndicator size="small" color="#007AFF" />
      <Text style={swipeScreenStyles.refreshText}>Loading more designs...</Text>
    </View>
  );
};