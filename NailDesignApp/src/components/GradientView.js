// GradientView.js
import React from 'react';
import { View, StyleSheet } from 'react-native';

const GradientView = ({ colors, style, children }) => {
  return (
    <View style={[style, { overflow: "hidden" }]}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: colors[0] }]} />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: colors[1], opacity: 0.7 }]} />
      {children}
    </View>
  );
};

export default GradientView;
