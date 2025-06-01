// Purpose: Handles all gesture detection and animations

// Creates all the animated values (translateX, translateY, rotation, scale)
// Defines the pan gesture behavior
// Calculates swipe thresholds and velocities
// Manages the smooth animations for card movements
// Controls the opacity of swipe indicators (LIKE/PASS/SUPER)

// Key responsibilities:

// Gesture recognition and thresholds
// Real-time animation during swipes
// Card spring-back animations when released
// Stack effect animations (cards behind scale up)

import {
  useSharedValue,
  useDerivedValue,
  interpolate,
  Extrapolation,
  withTiming,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { Gesture } from "react-native-gesture-handler";
import { SWIPE_CONSTANTS } from "../constants/swipeConstants";

export const useSwipeGesture = (removeCard, isAnimating) => {
  // Animation values
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const isPressed = useSharedValue(false);

  // Derived values for smooth animations
  const rotate = useDerivedValue(() => {
    return interpolate(
      translateX.value,
      [-SWIPE_CONSTANTS.SCREEN_WIDTH / 2, 0, SWIPE_CONSTANTS.SCREEN_WIDTH / 2],
      [
        -SWIPE_CONSTANTS.ROTATION_STRENGTH,
        0,
        SWIPE_CONSTANTS.ROTATION_STRENGTH,
      ],
      Extrapolation.CLAMP
    );
  });

  const scale = useDerivedValue(() => {
    const distance = Math.sqrt(translateX.value ** 2 + translateY.value ** 2);
    const maxDistance = SWIPE_CONSTANTS.SCREEN_WIDTH * 0.4;
    return interpolate(
      distance,
      [0, maxDistance],
      [1, 0.95],
      Extrapolation.CLAMP
    );
  });

  // Stack animations for background cards
  const nextCardScale = useDerivedValue(() => {
    const progress =
      Math.abs(translateX.value) / SWIPE_CONSTANTS.SWIPE_THRESHOLD;
    return interpolate(progress, [0, 1], [0.95, 1], Extrapolation.CLAMP);
  });

  const nextCardTranslateY = useDerivedValue(() => {
    const progress =
      Math.abs(translateX.value) / SWIPE_CONSTANTS.SWIPE_THRESHOLD;
    return interpolate(progress, [0, 1], [10, 0], Extrapolation.CLAMP);
  });

  // Swipe indicator opacities
  const likeOpacity = useDerivedValue(() => {
    return interpolate(
      translateX.value,
      [0, SWIPE_CONSTANTS.SWIPE_THRESHOLD],
      [0, 1],
      Extrapolation.CLAMP
    );
  });

  const nopeOpacity = useDerivedValue(() => {
    return interpolate(
      translateX.value,
      [-SWIPE_CONSTANTS.SWIPE_THRESHOLD, 0],
      [1, 0],
      Extrapolation.CLAMP
    );
  });

  const superLikeOpacity = useDerivedValue(() => {
    return interpolate(
      translateY.value,
      [-SWIPE_CONSTANTS.SWIPE_THRESHOLD, 0],
      [1, 0],
      Extrapolation.CLAMP
    );
  });

  // Reset animation values
  const resetValues = () => {
    translateX.value = 0;
    translateY.value = 0;
  };

  // Pan gesture
  const panGesture = Gesture.Pan()
    .onStart(() => {
      isPressed.value = true;
    })
    .onUpdate((event) => {
      if (isAnimating) return;

      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      isPressed.value = false;

      if (isAnimating) return;

      const { translationX, translationY, velocityX, velocityY } = event;

      const isSwipeRight =
        translationX > SWIPE_CONSTANTS.SWIPE_THRESHOLD || velocityX > 800;
      const isSwipeLeft =
        translationX < -SWIPE_CONSTANTS.SWIPE_THRESHOLD || velocityX < -800;
      const isSwipeUp =
        translationY < -SWIPE_CONSTANTS.SWIPE_THRESHOLD || velocityY < -800;

      if (isSwipeRight) {
        translateX.value = withTiming(SWIPE_CONSTANTS.SCREEN_WIDTH * 1.2, {
          duration: SWIPE_CONSTANTS.ANIMATION_DURATION,
        });
        translateY.value = withTiming(translationY * 0.5, {
          duration: SWIPE_CONSTANTS.ANIMATION_DURATION,
        });
        runOnJS(removeCard)("right");
      } else if (isSwipeLeft) {
        translateX.value = withTiming(-SWIPE_CONSTANTS.SCREEN_WIDTH * 1.2, {
          duration: SWIPE_CONSTANTS.ANIMATION_DURATION,
        });
        translateY.value = withTiming(translationY * 0.5, {
          duration: SWIPE_CONSTANTS.ANIMATION_DURATION,
        });
        runOnJS(removeCard)("left");
      } else if (isSwipeUp) {
        translateY.value = withTiming(-SWIPE_CONSTANTS.SCREEN_HEIGHT * 1.2, {
          duration: SWIPE_CONSTANTS.ANIMATION_DURATION,
        });
        runOnJS(removeCard)("up");
      } else {
        translateX.value = withSpring(0, SWIPE_CONSTANTS.SPRING_CONFIG);
        translateY.value = withSpring(0, SWIPE_CONSTANTS.SPRING_CONFIG);
      }
    });

  return {
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
  };
};
