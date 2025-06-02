// Purpose: Reusable form input component

// Responsibilities:
// Renders labeled text inputs with consistent styling
// Supports various input types (email, password, text)
// Handles keyboard and capitalization settings

import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { authStyles } from '../../styles/authStyles';

export const FormInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
}) => {
  return (
    <View style={authStyles.inputContainer}>
      <Text style={authStyles.label}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        placeholderTextColor="#9ca3af"
        style={authStyles.input}
      />
    </View>
  );
};