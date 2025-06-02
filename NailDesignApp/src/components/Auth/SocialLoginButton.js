import React from 'react';
import { View, TouchableOpacity, Text, Image, Platform } from 'react-native';
import { authStyles } from '../../styles/authStyles';

export const SocialLoginButtons = ({ onGooglePress, onApplePress }) => {
  return (
    <>
      <View style={authStyles.separatorContainer}>
        <View style={authStyles.separatorLine} />
        <Text style={authStyles.separatorText}>or</Text>
        <View style={authStyles.separatorLine} />
      </View>

      <TouchableOpacity
        style={authStyles.socialButton}
        onPress={onGooglePress}
      >
        <Image
          source={require("../../assets/google-logo.png")}
          style={authStyles.socialIcon}
        />
        <Text style={authStyles.socialButtonText}>
          Continue with Google
        </Text>
      </TouchableOpacity>

      {Platform.OS === "ios" && (
        <TouchableOpacity
          style={authStyles.socialButton}
          onPress={onApplePress}
        >
          <Image
            source={require("../../assets/apple-logo.png")}
            style={authStyles.socialIcon}
          />
          <Text style={authStyles.socialButtonText}>
            Continue with Apple
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
};