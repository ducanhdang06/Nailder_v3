// Purpose: Animated feedback overlays during swipes

// Shows "LIKE" label when swiping right
// Shows "PASS" label when swiping left
// Shows "SUPER" label when swiping up
// Handles the opacity animations based on swipe distance

// Why separate:

// Keeps animation logic focused
// Easy to customize indicator styles
// Can be easily disabled or replaced

import React from "react";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { Text } from "react-native";
import { swipeCardStyles } from "../../styles/swipeCardStyles";

const SwipeIndicators = ({ likeOpacity, nopeOpacity, superLikeOpacity }) => {
  const likeStyle = useAnimatedStyle(() => ({
    opacity: likeOpacity.value,
  }));

  const nopeStyle = useAnimatedStyle(() => ({
    opacity: nopeOpacity.value,
  }));

  const superLikeStyle = useAnimatedStyle(() => ({
    opacity: superLikeOpacity.value,
  }));

  return (
    <>
      <Animated.View style={[swipeCardStyles.likeLabel, likeStyle]}>
        <Text style={swipeCardStyles.likeLabelText}>LIKE</Text>
      </Animated.View>
      
      <Animated.View style={[swipeCardStyles.nopeLabel, nopeStyle]}>
        <Text style={swipeCardStyles.nopeLabelText}>PASS</Text>
      </Animated.View>
      
      <Animated.View style={[swipeCardStyles.superLikeLabel, superLikeStyle]}>
        <Text style={swipeCardStyles.superLikeLabelText}>SUPER</Text>
      </Animated.View>
    </>
  );
};

export default SwipeIndicators;