// Purpose: Manages the card deck state and navigation

// Tracks which card is currently active (currentIndex)
// Handles moving to the next card after swipes
// Manages the "prefetch more cards" logic
// Controls animation states to prevent double-swipes

// Key responsibilities:

// Card index management
// Triggering callbacks when cards are swiped
// Determining when to load more content
// Providing the 3 visible cards for rendering

import { useState, useEffect, useCallback } from "react";
import { SWIPE_CONSTANTS } from "../../constants/swipeConstants";

export const useCardStack = (designs, onNoMoreCards) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Reset when designs change
  useEffect(() => {
    setCurrentIndex(0);
  }, [designs]);

  // Prefetch more cards when running low
  const checkAndPrefetch = useCallback(
    (newIndex) => {
      const remainingCards = designs.length - newIndex;
      if (remainingCards <= SWIPE_CONSTANTS.PREFETCH_THRESHOLD) {
        onNoMoreCards();
      }
    },
    [designs.length, onNoMoreCards]
  );

  // Handle card removal with proper index management
  const removeCard = useCallback(
    (direction, callbacks) => {
      if (isAnimating) return;

      const currentCard = designs[currentIndex];
      if (!currentCard) return;

      setIsAnimating(true);

      // Call appropriate callback
      switch (direction) {
        case "left":
          callbacks.onSwipeLeft(currentCard);
          break;
        case "right":
          callbacks.onSwipeRight(currentCard);
          break;
        case "up":
          callbacks.onSwipeUp(currentCard);
          break;
      }

      // Move to next card with proper handling
      setTimeout(() => {
        setCurrentIndex((prev) => {
          const nextIndex = prev + 1;

          if (nextIndex < designs.length) {
            checkAndPrefetch(nextIndex);
          }

          return nextIndex;
        });

        setIsAnimating(false);
      }, 200);
    },
    [currentIndex, designs, checkAndPrefetch, isAnimating]
  );

  const getVisibleCards = useCallback(() => {
    return designs.slice(currentIndex, currentIndex + 3);
  }, [designs, currentIndex]);

  return {
    currentIndex,
    isAnimating,
    removeCard,
    getVisibleCards,
  };
};
