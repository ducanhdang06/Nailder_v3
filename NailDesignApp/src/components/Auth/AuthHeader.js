// Purpose: Reusable header component for authentication screens
// Responsibilities:

// Renders logo with gradient background
// Displays title and subtitle text
// Maintains consistent branding across auth screens

import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { authStyles } from '../../styles/authStyles';

export const AuthHeader = ({ title, subtitle }) => {
  return (
    <View style={authStyles.header}>
      <View style={authStyles.logoContainer}>
        <LinearGradient
          colors={["#fb7185", "#ec4899"]}
          style={authStyles.logo}
        >
          <View style={authStyles.logoInner} />
        </LinearGradient>
      </View>
      <Text style={authStyles.title}>{title}</Text>
      <Text style={authStyles.subtitle}>{subtitle}</Text>
    </View>
  );
};