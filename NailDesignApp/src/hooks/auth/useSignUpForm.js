// Purpose: Custom React hook for managing form state and validation
// Responsibilities:

// Manages all form input states (name, email, passwords, role)
// Provides form validation logic
// Offers form reset functionality
// Returns organized data and setter functions

import { useState } from 'react';
import { Alert } from 'react-native';

export const useSignupForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("customer");

  const validateForm = () => {
    if (!fullName.trim()) {
      Alert.alert("Error", "Please enter your full name");
      return false;
    }
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email");
      return false;
    }
    if (!password.trim()) {
      Alert.alert("Error", "Please enter a password");
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setRole("customer");
  };

  return {
    formData: {
      fullName,
      email,
      password,
      confirmPassword,
      role,
    },
    setters: {
      setFullName,
      setEmail,
      setPassword,
      setConfirmPassword,
      setRole,
    },
    validateForm,
    resetForm,
  };
};