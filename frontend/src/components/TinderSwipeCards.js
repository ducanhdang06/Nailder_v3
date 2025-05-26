
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const SWIPE_THRESHOLD = screenWidth * 0.25;
const ROTATION_STRENGTH = 0.4;

const TinderSwipeCards = ({ designs = [], onSwipeLeft, onSwipeRight, onSwipeUp }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);
  const scale = useSharedValue(1);

  const handleSwipe = (direction) => {
    const currentCard = designs[currentIndex];
    setTimeout(() => {
      if (direction === 'right') onSwipeRight?.(currentCard, currentIndex);
      else if (direction === 'left') onSwipeLeft?.(currentCard, currentIndex);
      else if (direction === 'up') onSwipeUp?.(currentCard, currentIndex);
      nextCard();
    }, 300);
  };

  const nextCard = () => {
    setCurrentIndex((prev) => {
      const next = prev + 1;
      if (next < designs.length) {
        translateX.value = 0;
        translateY.value = 0;
        rotate.value = 0;
        scale.value = 1;
        return next;
      }
      return prev;
    });
  };

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
      rotate.value = interpolate(
        translateX.value,
        [-screenWidth / 2, 0, screenWidth / 2],
        [-ROTATION_STRENGTH, 0, ROTATION_STRENGTH],
        'clamp'
      );
      const distance = Math.sqrt(e.translationX ** 2 + e.translationY ** 2);
      scale.value = interpolate(distance, [0, screenWidth * 0.3], [1, 0.95], 'clamp');
    })
    .onEnd((e) => {
      const { translationX, translationY, velocityX, velocityY } = e;
      const isRight = translationX > SWIPE_THRESHOLD || velocityX > 500;
      const isLeft = translationX < -SWIPE_THRESHOLD || velocityX < -500;
      const isUp = translationY < -SWIPE_THRESHOLD || velocityY < -500;

      if (isRight) {
        translateX.value = withTiming(screenWidth * 1.5, { duration: 300 });
        translateY.value = withTiming(translationY, { duration: 300 });
        runOnJS(handleSwipe)('right');
      } else if (isLeft) {
        translateX.value = withTiming(-screenWidth * 1.5, { duration: 300 });
        translateY.value = withTiming(translationY, { duration: 300 });
        runOnJS(handleSwipe)('left');
      } else if (isUp) {
        translateY.value = withTiming(-screenHeight, { duration: 300 });
        runOnJS(handleSwipe)('up');
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        rotate.value = withSpring(0);
        scale.value = withSpring(1);
      }
    });

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}rad` },
      { scale: scale.value },
    ],
  }));

  const renderCard = (design, index) => {
    const isCurrent = index === currentIndex;
    const nextScale = index === currentIndex + 1 ? 0.95 : index === currentIndex + 2 ? 0.9 : 1;
    if (index < currentIndex) return null;

    const Card = isCurrent ? Animated.View : View;
    return (
      <Card
        key={design.id || index}
        style={[styles.cardContainer, isCurrent && animatedCardStyle, { transform: [{ scale: nextScale }], zIndex: -index }]}
      >
        <View style={styles.card}>
          <Image source={{ uri: design.imageUrl }} style={styles.cardImage} resizeMode="cover" />
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>{design.title}</Text>
            <Text style={styles.cardDescription}>{design.description}</Text>
          </View>
        </View>
      </Card>
    );
  };

  if (currentIndex >= designs.length) {
    return (
      <View style={styles.noMoreCards}>
        <Text style={styles.noMoreCardsText}>No more nail designs!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={styles.gestureContainer}>
          {designs.slice(currentIndex, currentIndex + 3).map((design, idx) =>
            renderCard(design, currentIndex + idx)
          )}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  gestureContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  cardContainer: {
    position: 'absolute',
    width: screenWidth * 0.9,
    height: screenHeight * 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  cardImage: { width: '100%', height: '70%' },
  cardInfo: { flex: 1, padding: 20 },
  cardTitle: { fontSize: 24, fontWeight: 'bold' },
  cardDescription: { fontSize: 16, color: '#666', marginTop: 10 },
  noMoreCards: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  noMoreCardsText: { fontSize: 22, color: '#333' },
});

export default TinderSwipeCards;