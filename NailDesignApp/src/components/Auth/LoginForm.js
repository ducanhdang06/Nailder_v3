// Purpose: Renders the login form inputs
// Responsibilities:
// Displays email and password input fields
// Includes "Forgot Password" link
// Handles form input interactions

import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { authStyles } from '../../styles/authStyles';

export const LoginForm = ({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onForgotPassword,
}) => {
  return (
    <>
      <View style={authStyles.inputContainer}>
        <Text style={authStyles.label}>Email Address</Text>
        <TextInput
          placeholder="your@email.com"
          value={email}
          onChangeText={onEmailChange}
          placeholderTextColor="#9ca3af"
          keyboardType="email-address"
          autoCapitalize="none"
          style={authStyles.input}
        />
      </View>

      <View style={authStyles.inputContainer}>
        <View style={authStyles.labelRow}>
          <Text style={authStyles.label}>Password</Text>
          <TouchableOpacity onPress={onForgotPassword}>
            <Text style={authStyles.footerLink}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          placeholder="Enter your password"
          value={password}
          placeholderTextColor="#9ca3af"
          onChangeText={onPasswordChange}
          secureTextEntry
          style={authStyles.input}
        />
      </View>
    </>
  );
};