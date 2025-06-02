import React, { useCallback } from "react";
import { View } from "react-native";
import TinderSwipeCards from "../../components/SwipeCard/TinderSwipeCards";
import { swipeScreenStyles } from "../../styles/swipeScreenStyles";
import { useDesignFeed } from "../../hooks/SwipeCard/useDesignFeed";
import { useSwipeActions } from "../../hooks/SwipeCard/useSwipeActions";
import {
  LoadingSpinner,
  ErrorState,
  EmptyState,
  RefreshOverlay
} from "../../components/LoadingStates";

const SwipeScreen = () => {
  const {
    designs,
    loading,
    error,
    refreshing,
    refresh,
    loadMore,
    setError
  } = useDesignFeed();

  const { handleSwipe, resetIndex } = useSwipeActions(designs.length);

  const handleSwipeLeft = useCallback((design) => {
    handleSwipe(design, false, "👈 Swiped left");
  }, [handleSwipe]);

  const handleSwipeRight = useCallback((design) => {
    handleSwipe(design, true, "👉 Swiped right");
  }, [handleSwipe]);

  const handleSwipeUp = useCallback((design) => {
    handleSwipe(design, true, "👆 Super liked");
  }, [handleSwipe]);

  const handleRetry = useCallback(() => {
    setError(null);
    resetIndex();
    refresh();
  }, [setError, resetIndex, refresh]);

  // Loading state
  if (loading && !refreshing && designs.length === 0) {
    return <LoadingSpinner />;
  }

  // Error state
  if (error && !refreshing && designs.length === 0) {
    return (
      <ErrorState
        error={error}
        onRefresh={refresh}
        refreshing={refreshing}
        onRetry={handleRetry}
      />
    );
  }

  // Empty state
  if (designs.length === 0 && !loading && !refreshing) {
    return <EmptyState onRefresh={refresh} refreshing={refreshing} />;
  }

  return (
    <View style={swipeScreenStyles.container}>
      <TinderSwipeCards
        designs={designs}
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
        onSwipeUp={handleSwipeUp}
        onNoMoreCards={loadMore}
        refreshing={refreshing}
      />
      <RefreshOverlay visible={refreshing && designs.length > 0} />
    </View>
  );
};

export default SwipeScreen;
