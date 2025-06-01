// Purpose: Handles edge cases when there's no content

// EmptyState: Shows "Loading..." or "No designs available"
// NoMoreCards: Shows "No more designs! Pull to refresh"

// Why separate:

// Clean separation of concerns
// Easy to customize empty states
// Reusable across different contexts

import React from "react";
import { View, Text } from "react-native";
import { swipeCardStyles } from "../../styles/swipeCardStyles";

export const EmptyState = ({ refreshing }) => (
  <View style={swipeCardStyles.emptyState}>
    <Text style={swipeCardStyles.emptyStateText}>
      {refreshing ? "Loading designs..." : "No designs available"}
    </Text>
  </View>
);

export const NoMoreCards = () => (
  <View style={swipeCardStyles.noMoreCards}>
    <Text style={swipeCardStyles.noMoreCardsText}>No more designs!</Text>
    <Text style={swipeCardStyles.noMoreCardsSubtext}>Pull down to refresh</Text>
  </View>
);
