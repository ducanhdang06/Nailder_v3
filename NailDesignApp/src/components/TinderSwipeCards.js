import React, { useState, useCallback, useEffect } from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const SWIPE_THRESHOLD = screenWidth * 0.25;
const ROTATION_STRENGTH = 0.4;

const TinderSwipeCards = ({
  designs = [],
  onSwipeLeft = () => {},
  onSwipeRight = () => {},
  onSwipeUp = () => {},
  onNoMoreCards = () => {},
  refreshing = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset when designs change
  useEffect(() => {
    setCurrentIndex(0);
  }, [designs]);

  // Animation values
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);
  const scale = useSharedValue(1);

  // Handle card removal
  const removeCard = useCallback((direction) => {
    const currentCard = designs[currentIndex];
    
    // Call appropriate callback
    switch (direction) {
      case 'left':
        onSwipeLeft(currentCard);
        break;
      case 'right':
        onSwipeRight(currentCard);
        break;
      case 'up':
        onSwipeUp(currentCard);
        break;
    }

    // Move to next card or handle no more cards
    setTimeout(() => {
      setCurrentIndex(prev => {
        const next = prev + 1;
        if (next >= designs.length) {
          onNoMoreCards();
          return prev;
        }
        return next;
      });
      
      // Reset animation values
      translateX.value = 0;
      translateY.value = 0;
      rotate.value = 0;
      scale.value = 1;
    }, 300);
  }, [currentIndex, designs, onSwipeLeft, onSwipeRight, onSwipeUp, onNoMoreCards, translateX, translateY, rotate, scale]);

  // Create pan gesture
  const panGesture = Gesture.Pan()
    .onStart(() => {
      // Card starts moving
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
      
      // Calculate rotation based on horizontal movement
      rotate.value = interpolate(
        event.translationX,
        [-screenWidth / 2, 0, screenWidth / 2],
        [-ROTATION_STRENGTH, 0, ROTATION_STRENGTH],
        Extrapolation.CLAMP
      );
      
      // Scale effect during swipe
      const distance = Math.sqrt(
        event.translationX ** 2 + event.translationY ** 2
      );
      scale.value = interpolate(
        distance,
        [0, screenWidth * 0.3],
        [1, 0.95],
        Extrapolation.CLAMP
      );
    })
    .onEnd((event) => {
      const { translationX, translationY, velocityX, velocityY } = event;
      
      // Determine swipe direction
      const isSwipeRight = translationX > SWIPE_THRESHOLD || velocityX > 500;
      const isSwipeLeft = translationX < -SWIPE_THRESHOLD || velocityX < -500;
      const isSwipeUp = translationY < -SWIPE_THRESHOLD || velocityY < -500;
      
      if (isSwipeRight) {
        // Animate out to the right
        translateX.value = withTiming(screenWidth * 1.5, { duration: 300 });
        translateY.value = withTiming(translationY, { duration: 300 });
        runOnJS(removeCard)('right');
      } else if (isSwipeLeft) {
        // Animate out to the left
        translateX.value = withTiming(-screenWidth * 1.5, { duration: 300 });
        translateY.value = withTiming(translationY, { duration: 300 });
        runOnJS(removeCard)('left');
      } else if (isSwipeUp) {
        // Animate out upward
        translateY.value = withTiming(-screenHeight, { duration: 300 });
        runOnJS(removeCard)('up');
      } else {
        // Spring back to center
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        rotate.value = withSpring(0);
        scale.value = withSpring(1);
      }
    });

  // Animated style for current card
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate.value}rad` },
        { scale: scale.value },
      ],
    };
  });

  // Animated styles for swipe indicators
  const likeAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  const nopeAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, 0],
      [1, 0],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  const superLikeAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [-SWIPE_THRESHOLD, 0],
      [1, 0],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  // Helper functions
  const renderTags = useCallback((tagsString) => {
    if (!tagsString || tagsString.trim() === '') return null;
    
    const tagsArray = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    const visibleTags = tagsArray.slice(0, 3);
    const remainingCount = tagsArray.length - visibleTags.length;
    
    return (
      <View style={styles.tagsContainer}>
        {visibleTags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
        {remainingCount > 0 && (
          <View style={[styles.tag, styles.moreTag]}>
            <Text style={styles.tagText}>+{remainingCount}</Text>
          </View>
        )}
      </View>
    );
  }, []);

  const getDesignerInitials = useCallback((fullName) => {
    if (!fullName) return '??';
    const names = fullName.trim().split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  }, []);

  // Render single card
  const renderCard = useCallback((design, index) => {
    const relativeIndex = index - currentIndex;
    
    if (relativeIndex < 0 || relativeIndex > 2) return null;
    
    const isCurrent = relativeIndex === 0;
    const isNext = relativeIndex === 1;
    const isAfterNext = relativeIndex === 2;
    
    // Calculate scale and position for stacking effect
    let cardScale = 1;
    let zIndex = 1000;
    let stackOffset = 0;
    
    if (isNext) {
      cardScale = 0.95;
      zIndex = 999;
      stackOffset = 10;
    } else if (isAfterNext) {
      cardScale = 0.9;
      zIndex = 998;
      stackOffset = 20;
    }

    // Card content that stays consistent
    const cardContent = (
      <View style={styles.card}>
        <Image
          key={`image-${design.id}`}
          source={{ uri: design.imageUrl }}
          style={styles.cardImage}
          resizeMode="cover"
        />
        
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {design.title || 'Untitled Design'}
          </Text>
          
          <View style={styles.designerRow}>
            <View style={styles.designerAvatar}>
              <Text style={styles.avatarText}>
                {getDesignerInitials(design.designerName)}
              </Text>
            </View>
            <Text style={styles.designerName} numberOfLines={1}>
              {design.designerName || 'Unknown Designer'}
            </Text>
            
            <View style={styles.likesContainer}>
              <Text style={styles.heartIcon}>❤️</Text>
              <Text style={styles.likesCount}>{design.likes || 0}</Text>
            </View>
          </View>
          
          {renderTags(design.tags)}
        </View>

        {/* Swipe indicators - only show on current card */}
        {isCurrent && (
          <>
            <Animated.View style={[styles.likeLabel, likeAnimatedStyle]}>
              <Text style={styles.likeLabelText}>LIKE</Text>
            </Animated.View>
            
            <Animated.View style={[styles.nopeLabel, nopeAnimatedStyle]}>
              <Text style={styles.nopeLabelText}>PASS</Text>
            </Animated.View>
            
            <Animated.View style={[styles.superLikeLabel, superLikeAnimatedStyle]}>
              <Text style={styles.superLikeLabelText}>SUPER</Text>
            </Animated.View>
          </>
        )}
      </View>
    );
    
    const CardComponent = isCurrent ? Animated.View : View;
    const cardStyle = isCurrent 
      ? [styles.cardContainer, { zIndex }, animatedStyle]
      : [styles.cardContainer, { zIndex, transform: [{ scale: cardScale }, { translateY: stackOffset }] }];
    
    return (
      <CardComponent key={design.id} style={cardStyle}>
        {cardContent}
      </CardComponent>
    );
  }, [currentIndex, animatedStyle, renderTags, getDesignerInitials, likeAnimatedStyle, nopeAnimatedStyle, superLikeAnimatedStyle]);

  // Show appropriate state
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
        <Text style={styles.noMoreCardsText}>No more designs!</Text>
        <Text style={styles.noMoreCardsSubtext}>Pull down to refresh</Text>
      </View>
    );
  }

  // Get visible cards (current + next 2)
  const visibleCards = designs.slice(currentIndex, currentIndex + 3);

  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={styles.cardsWrapper}>
          {visibleCards.map((design, idx) => 
            renderCard(design, currentIndex + idx)
          )}
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  cardsWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  cardContainer: {
    position: "absolute",
    width: screenWidth * 0.9,
    height: screenHeight * 0.7,
    maxHeight: 600,
  },
  card: {
    flex: 1,
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
    height: "75%",
    backgroundColor: "#f0f0f0",
  },
  cardInfo: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  designerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  designerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#6366f1",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  avatarText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  designerName: {
    flex: 1,
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  likesContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  heartIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  likesCount: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  tag: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  moreTag: {
    backgroundColor: "#e2e8f0",
  },
  tagText: {
    fontSize: 12,
    color: "#475569",
    fontWeight: "500",
  },
  // Swipe indicator styles
  likeLabel: {
    position: 'absolute',
    top: 60,
    left: 40,
    backgroundColor: '#4caf50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    transform: [{ rotate: '-15deg' }],
    borderWidth: 3,
    borderColor: '#fff',
  },
  likeLabelText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  nopeLabel: {
    position: 'absolute',
    top: 60,
    right: 40,
    backgroundColor: '#f44336',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    transform: [{ rotate: '15deg' }],
    borderWidth: 3,
    borderColor: '#fff',
  },
  nopeLabelText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  superLikeLabel: {
    position: 'absolute',
    top: 40,
    left: '50%',
    transform: [{ translateX: -30 }],
    backgroundColor: '#2196f3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  superLikeLabelText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
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
});

export default TinderSwipeCards;