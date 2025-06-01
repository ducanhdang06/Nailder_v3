// Purpose: Reusable loading indicator component

// Displays activity indicator with customizable message
// Consistent loading UI across the app
// Simple, focused component for initial loading states

import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { swipeScreenStyles } from '../../styles/swipeScreenStyles';

export const LoadingSpinner = ({ message = "Loading designs..." }) => (
  <View style={swipeScreenStyles.loadingContainer}>
    <ActivityIndicator size="large" color="#007AFF" />
    <Text style={swipeScreenStyles.loadingText}>{message}</Text>
  </View>
);