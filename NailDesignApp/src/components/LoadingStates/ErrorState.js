// Purpose: Handles error display and retry functionality

// Shows error messages with pull-to-refresh capability
// Provides retry button for failed operations
// Consistent error handling UI pattern
// Includes refresh control for manual retry

import React from 'react';
import { ScrollView, Text, RefreshControl } from 'react-native';
import { swipeScreenStyles } from '../../styles/swipeScreenStyles';

export const ErrorState = ({ error, onRefresh, refreshing, onRetry }) => (
  <ScrollView
    contentContainerStyle={swipeScreenStyles.errorContainer}
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }
  >
    <Text style={swipeScreenStyles.errorText}>Failed to load designs</Text>
    <Text style={swipeScreenStyles.errorSubtext}>{error}</Text>
    <Text style={swipeScreenStyles.retryText} onPress={onRetry}>
      Tap to retry
    </Text>
  </ScrollView>
);