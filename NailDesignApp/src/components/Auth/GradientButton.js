import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { authStyles } from '../../styles/authStyles';

export const GradientButton = ({ 
  title, 
  onPress, 
  colors = ["#fb7185", "#ec4899"],
  style = authStyles.primaryButton 
}) => {
  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <LinearGradient colors={colors} style={authStyles.buttonGradient}>
        <Text style={authStyles.primaryButtonText}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};