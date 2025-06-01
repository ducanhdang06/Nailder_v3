// Purpose: Main orchestrator that brings everything together

// Uses the custom hooks for logic
// Renders the card stack with proper layering
// Applies gesture detection to the top card
// Handles the overall component lifecycle

// What it does:

// Combines useCardStack + useSwipeGesture hooks
// Creates animated styles for the 3-card stack effect
// Handles empty states and edge cases
// Renders the GestureDetector with pan gesture
// Manages the z-index layering of cards

// Why this approach:

// Main component stays focused on composition
// Business logic is in hooks (testable)
// UI logic is in sub-components (reusable)
// Much easier to understand and maintain

import React, { useMemo } from "react";
import { View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import { swipeCardStyles } from "../../styles/swipeCardStyles";

import CardContent from "./CardContent";
import SwipeIndicators from "./SwipeIndicators";
import { EmptyState, NoMoreCards } from "./EmptyStates";
import { useCardStack } from "../../hooks/useCardStack";
import { useSwipeGesture } from "../../hooks/useSwipeGesture";

const TinderSwipeCards = ({
  designs = [],
  onSwipeLeft = () => {},
  onSwipeRight = () => {},
  onSwipeUp = () => {},
  onNoMoreCards = () => {},
  refreshing = false,
}) => {
  // Custom hooks
  const { currentIndex, isAnimating, removeCard, getVisibleCards } = useCardStack(designs, onNoMoreCards);
  
  const swipeCallbacks = { onSwipeLeft, onSwipeRight, onSwipeUp };
  const handleRemoveCard = (direction) => removeCard(direction, swipeCallbacks);
  
  const {
    translateX,
    translateY,
    rotate,
    scale,
    nextCardScale,
    nextCardTranslateY,
    likeOpacity,
    nopeOpacity,
    superLikeOpacity,
    panGesture,
    resetValues,
  } = useSwipeGesture(handleRemoveCard, isAnimating);

  // Reset animation values when cards change
  React.useEffect(() => {
    resetValues();
  }, [currentIndex]);

  // Animated styles
  const currentCardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}rad` },
      { scale: scale.value },
    ],
    zIndex: 1000,
  }));

  const nextCardStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: nextCardScale.value },
      { translateY: nextCardTranslateY.value },
    ],
    zIndex: 999,
  }));

  const thirdCardStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: 0.9 },
      { translateY: 20 },
    ],
    zIndex: 998,
  }));

  // Memoize visible cards for better performance
  const visibleCards = useMemo(() => getVisibleCards(), [getVisibleCards]);

  // Handle empty states
  if (designs.length === 0) {
    return <EmptyState refreshing={refreshing} />;
  }

  if (currentIndex >= designs.length) {
    return <NoMoreCards />;
  }

  const [currentCard, nextCard, thirdCard] = visibleCards;

  return (
    <GestureHandlerRootView style={swipeCardStyles.container}>
      <View style={swipeCardStyles.cardsWrapper}>
        {/* Third card (furthest back) */}
        {thirdCard && (
          <Animated.View style={[swipeCardStyles.cardContainer, thirdCardStyle]}>
            <CardContent design={thirdCard} />
          </Animated.View>
        )}
        
        {/* Next card (middle) */}
        {nextCard && (
          <Animated.View style={[swipeCardStyles.cardContainer, nextCardStyle]}>
            <CardContent design={nextCard} />
          </Animated.View>
        )}
        
        {/* Current card (top) with gesture */}
        {currentCard && (
          <GestureDetector gesture={panGesture}>
            <Animated.View style={[swipeCardStyles.cardContainer, currentCardStyle]}>
              <CardContent design={currentCard} />
              <SwipeIndicators 
                likeOpacity={likeOpacity}
                nopeOpacity={nopeOpacity}
                superLikeOpacity={superLikeOpacity}
              />
            </Animated.View>
          </GestureDetector>
        )}
      </View>
    </GestureHandlerRootView>
  );
};

export default TinderSwipeCards;