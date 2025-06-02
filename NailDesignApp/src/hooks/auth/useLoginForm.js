// Purpose: Manages login form state and basic validation
// Responsibilities:
// Manages email and password state
// Provides form validation
// Offers form reset functionality

import { useState } from 'react';
import { Alert } from 'react-native';

export const useLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateForm = () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email");
      return false;
    }
    if (!password.trim()) {
      Alert.alert("Error", "Please enter your password");
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
  };

  return {
    formData: { email, password },
    setters: { setEmail, setPassword },
    validateForm,
    resetForm,
  };
};