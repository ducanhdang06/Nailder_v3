// Important constants for swipe cards
import { Dimensions } from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export const SWIPE_CONSTANTS = {
  SCREEN_WIDTH: screenWidth,
  SCREEN_HEIGHT: screenHeight,
  SWIPE_THRESHOLD: screenWidth * 0.25, // How far to swipe before triggering
  ROTATION_STRENGTH: 0.2,              // How much cards rotate when swiping
  PREFETCH_THRESHOLD: 3,               // When to load more cards
  ANIMATION_DURATION: 250,             // Swipe animation speed
  SPRING_CONFIG: {
    damping: 20,
    stiffness: 300,
  },
};