import React, { useState, useCallback, useMemo, useEffect } from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withSpring,
  withTiming,
  interpolate,
  useAnimatedReaction,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const SWIPE_THRESHOLD = screenWidth * 0.25;
const ROTATION_STRENGTH = 0.4;
const ANIMATION_DURATION = 300;
const VELOCITY_THRESHOLD = 500;

const TinderSwipeCards = ({
  designs = [],
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onNoMoreCards,
  refreshing = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset currentIndex when designs changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [designs]);

  // Shared values for animations
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);
  const scale = useSharedValue(1);
  const isAnimating = useSharedValue(false);

  // Reset animation values
  const resetAnimationValues = useCallback(() => {
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    rotate.value = withSpring(0);
    scale.value = withSpring(1);
    isAnimating.value = false;
  }, [translateX, translateY, rotate, scale, isAnimating]);

  // Handle swipe completion
  const handleSwipeComplete = useCallback((direction, cardData, index) => {
    try {
      switch (direction) {
        case "right":
          onSwipeRight?.(cardData, index);
          break;
        case "left":
          onSwipeLeft?.(cardData, index);
          break;
        case "up":
          onSwipeUp?.(cardData, index);
          break;
      }
    } catch (error) {
      console.error("Error handling swipe:", error);
    } finally {
      isAnimating.value = false;
    }
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, isAnimating]);

  // Move to next card
  const nextCard = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      
      if (nextIndex >= designs.length) {
        // No more cards available
        onNoMoreCards?.();
        return prevIndex;
      }
      
      // Reset animation values for the next card
      setTimeout(() => {
        resetAnimationValues();
      }, 50);
      
      return nextIndex;
    });
  }, [designs.length, onNoMoreCards, resetAnimationValues]);

  // Handle swipe gesture
  const handleSwipe = useCallback((direction) => {
    const currentCard = designs[currentIndex];
    
    // Execute swipe callback after animation
    setTimeout(() => {
      handleSwipeComplete(direction, currentCard, currentIndex);
      nextCard();
    }, ANIMATION_DURATION);
  }, [currentIndex, designs, handleSwipeComplete, nextCard]);

  // Pan gesture handler
  const panGesture = useMemo(() => Gesture.Pan()
    .onUpdate((event) => {
      if (isAnimating.value) return;
      
      const { translationX, translationY } = event;
      
      translateX.value = translationX;
      translateY.value = translationY;
      
      // Calculate rotation based on horizontal movement
      rotate.value = interpolate(
        translationX,
        [-screenWidth / 2, 0, screenWidth / 2],
        [-ROTATION_STRENGTH, 0, ROTATION_STRENGTH],
        "clamp"
      );
      
      // Calculate scale based on distance moved
      const distance = Math.sqrt(translationX ** 2 + translationY ** 2);
      scale.value = interpolate(
        distance,
        [0, screenWidth * 0.3],
        [1, 0.95],
        "clamp"
      );
    })
    .onEnd((event) => {
      if (isAnimating.value) return;
      
      const { translationX, translationY, velocityX, velocityY } = event;
      
      // Determine swipe direction based on position and velocity
      const isRightSwipe = translationX > SWIPE_THRESHOLD || velocityX > VELOCITY_THRESHOLD;
      const isLeftSwipe = translationX < -SWIPE_THRESHOLD || velocityX < -VELOCITY_THRESHOLD;
      const isUpSwipe = translationY < -SWIPE_THRESHOLD || velocityY < -VELOCITY_THRESHOLD;
      
      if (isRightSwipe) {
        // Set animating flag
        isAnimating.value = true;
        // Animate card off screen to the right
        translateX.value = withTiming(screenWidth * 1.5, { duration: ANIMATION_DURATION });
        translateY.value = withTiming(translationY, { duration: ANIMATION_DURATION });
        runOnJS(handleSwipe)("right");
      } else if (isLeftSwipe) {
        // Set animating flag
        isAnimating.value = true;
        // Animate card off screen to the left
        translateX.value = withTiming(-screenWidth * 1.5, { duration: ANIMATION_DURATION });
        translateY.value = withTiming(translationY, { duration: ANIMATION_DURATION });
        runOnJS(handleSwipe)("left");
      } else if (isUpSwipe) {
        // Set animating flag
        isAnimating.value = true;
        // Animate card off screen upward
        translateY.value = withTiming(-screenHeight, { duration: ANIMATION_DURATION });
        runOnJS(handleSwipe)("up");
      } else {
        // Spring back to original position
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        rotate.value = withSpring(0);
        scale.value = withSpring(1);
      }
    }), [handleSwipe, isAnimating]);

  // Animated style for the current card
  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}rad` },
      { scale: scale.value },
    ],
  }), []);

  // Reset animation when refreshing
  useAnimatedReaction(
    () => refreshing,
    (current, previous) => {
      if (current && !previous) {
        resetAnimationValues();
      }
    }
  );

  // Render individual card
  const renderCard = useCallback((design, index) => {
    const relativeIndex = index - currentIndex;
    
    // Don't render cards that are too far behind
    if (relativeIndex < 0) return null;
    
    const isCurrent = relativeIndex === 0;
    const isNext = relativeIndex === 1;
    const isAfterNext = relativeIndex === 2;
    
    // Calculate scale for stacked effect
    let cardScale = 1;
    if (isNext) cardScale = 0.95;
    else if (isAfterNext) cardScale = 0.9;
    
    const Card = isCurrent ? Animated.View : View;
    
    return (
      <Card
        key={`${design.id}-${index}`}
        style={[
          styles.cardContainer,
          isCurrent && animatedCardStyle,
          {
            transform: [{ scale: cardScale }],
            zIndex: designs.length - relativeIndex,
          },
        ]}
      >
        <View style={styles.card}>
          <Image
            source={{ uri: design.imageUrl }}
            style={styles.cardImage}
            resizeMode="cover"
            onError={(error) => {
              console.warn("Failed to load image:", design.imageUrl, error);
            }}
          />
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {design.title}
            </Text>
            <Text style={styles.cardDescription} numberOfLines={3}>
              {design.description}
            </Text>
          </View>
        </View>
      </Card>
    );
  }, [currentIndex, designs.length, animatedCardStyle]);

  // Show loading or no more cards state
  if (designs.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateText}>
          {refreshing ? "Loading designs..." : "No designs available"}
        </Text>
      </View>
    );
  }

  if (currentIndex >= designs.length) {
    return (
      <View style={styles.noMoreCards}>
        <Text style={styles.noMoreCardsText}>No more nail designs!</Text>
        <Text style={styles.noMoreCardsSubtext}>Pull down to refresh</Text>
      </View>
    );
  }

  // Get visible cards (current + next 2)
  const visibleCards = designs.slice(currentIndex, currentIndex + 3);

  return (
    <View style={styles.container}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={styles.gestureContainer}>
          {visibleCards.map((design, idx) => 
            renderCard(design, currentIndex + idx)
          )}
        </Animated.View>
      </GestureDetector>
      
      {/* Optional: Add swipe indicators */}
      <View style={styles.indicators}>
        <View style={[styles.indicator, styles.leftIndicator]}>
          <Text style={styles.indicatorText}>PASS</Text>
        </View>
        <View style={[styles.indicator, styles.rightIndicator]}>
          <Text style={styles.indicatorText}>LIKE</Text>
        </View>
        <View style={[styles.indicator, styles.upIndicator]}>
          <Text style={styles.indicatorText}>SUPER</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  gestureContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContainer: {
    position: "absolute",
    width: screenWidth * 0.9,
    height: screenHeight * 0.7,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  cardImage: {
    width: "100%",
    height: "70%",
    backgroundColor: "#f0f0f0", // Placeholder background
  },
  cardInfo: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 16,
    color: "#666",
    lineHeight: 22,
  },
  noMoreCards: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  noMoreCardsText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  noMoreCardsSubtext: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
  },
  indicators: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "none",
  },
  indicator: {
    position: "absolute",
    padding: 12,
    borderRadius: 8,
    opacity: 0, // Will be animated based on swipe direction
  },
  leftIndicator: {
    top: "40%",
    left: 30,
    backgroundColor: "rgba(255, 68, 68, 0.9)",
  },
  rightIndicator: {
    top: "40%",
    right: 30,
    backgroundColor: "rgba(34, 197, 94, 0.9)",
  },
  upIndicator: {
    top: "20%",
    left: "50%",
    transform: [{ translateX: -40 }],
    backgroundColor: "rgba(59, 130, 246, 0.9)",
  },
  indicatorText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default TinderSwipeCards;