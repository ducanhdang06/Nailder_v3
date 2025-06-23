import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { ChatScreenStyles } from "../../styles/chatScreenStyles";

export const LoadingView = () => (
  <SafeAreaView style={ChatScreenStyles.container}>
    <Text style={ChatScreenStyles.loadingText}>Loading chat...</Text>
  </SafeAreaView>
);

export const ErrorView = ({ error, onRetry }) => (
  <SafeAreaView style={ChatScreenStyles.container}>
    <View style={ChatScreenStyles.errorContainer}>
      <Text style={ChatScreenStyles.errorText}>Error loading messages</Text>
      <Text style={ChatScreenStyles.errorText}>{error.message}</Text>
      <TouchableOpacity onPress={onRetry} style={ChatScreenStyles.retryButton}>
        <Text style={ChatScreenStyles.retryText}>Retry</Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
);

export const AuthErrorView = ({ userType = "User" }) => (
  <View style={ChatScreenStyles.errorContainer}>
    <Text style={ChatScreenStyles.errorText}>{userType} not authenticated</Text>
  </View>
);