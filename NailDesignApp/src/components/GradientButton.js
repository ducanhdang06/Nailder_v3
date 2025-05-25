import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import authStyles from '../styles/authStyles';

const GradientButton = ({ onPress, children, style }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[authStyles.primaryButton, style]}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: "#fb7185", borderRadius: 12 }]} />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: "#ec4899", opacity: 0.8, borderRadius: 12 }]} />
      {children}
    </TouchableOpacity>
  );
};

export default GradientButton;